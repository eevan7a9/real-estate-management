import { Enquiry } from "../../models/enquiry.js";

export const updateEnquiry = async function (req, res) {
  const enquiry_id = req.params.id;
  if (!enquiry_id) {
    res.status(404).send({ message: "Error: Can't find Enquiry." });
    return;
  }
  const { content, email, title, topic, read, property, user } = req.body;
  const $set = {
    // Fields to update
    ...(content !== undefined && { content }),
    ...(email !== undefined && { email: email.toLowerCase() }),
    ...(title !== undefined && { title }),
    ...(topic !== undefined && { topic }),
    ...(read !== undefined && { read }),
    ...(property !== undefined && { property }),
    ...(user !== undefined && { user }),
  };
  const options = { new: true };
  try {
    const enquiry = await Enquiry.findOneAndUpdate(
      { enquiry_id },
      { $set },
      options
    );
    if (!enquiry) {
      res.status(404).send({ message: "Error: Can't find Enquiry." });
      return;
    }
    res.status(201).send({ data: enquiry });
  } catch (error) {
    res.status(400).send(error);
  }
};
