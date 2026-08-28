import { v4 as uuidV4 } from "uuid";
import { ContactSubmission } from "../../models/contact-submission.js";
import { Property } from "../../models/property.js";
import { ContactSubmissionTopic } from "../../enums/contact-submissions.js";

const validTopics = new Set(Object.values(ContactSubmissionTopic));
const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export const createContactSubmission = async function (req, res) {
  const { name, email, topic, message, property } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res
      .status(400)
      .send({ message: "Error: Required contact fields are missing." });
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedTopic =
    topic === undefined
      ? ContactSubmissionTopic.general
      : topic.trim().toLowerCase();
  const trimmedMessage = message.trim();

  if (
    trimmedName.length < 1 ||
    trimmedName.length > 120 ||
    !isEmail(normalizedEmail) ||
    !validTopics.has(normalizedTopic) ||
    trimmedMessage.length < 10 ||
    trimmedMessage.length > 2000
  ) {
    return res
      .status(400)
      .send({ message: "Error: Contact details are invalid." });
  }

  try {
    let propertySnapshot;
    if (property?.property_id !== undefined) {
      if (
        typeof property.property_id !== "string" ||
        property.property_id.trim().length === 0
      ) {
        return res
          .status(400)
          .send({ message: "Error: Property reference is invalid." });
      }

      const foundProperty = await Property.findOne({
        property_id: property.property_id.trim(),
        isActive: true,
      }).select("property_id name");
      if (!foundProperty)
        return res
          .status(404)
          .send({ message: "Error: Property was not found." });
      propertySnapshot = {
        property_id: foundProperty.property_id,
        name: foundProperty.name,
      };
    }

    const submission = await new ContactSubmission({
      submission_id: uuidV4(),
      name: trimmedName,
      email: normalizedEmail,
      topic: normalizedTopic,
      message: trimmedMessage,
      ...(req.user?.id && { user_id: req.user.id }),
      ...(propertySnapshot && { property: propertySnapshot }),
    }).save();

    return res.status(201).send({
      data: {
        submission_id: submission.submission_id,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    req.log.error({ err: error }, "Contact submission creation failed");
    return res
      .status(500)
      .send({ message: "Error: Unable to create contact submission." });
  }
};
