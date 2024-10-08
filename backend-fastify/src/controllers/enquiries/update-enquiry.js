import { Enquiry } from "../../models/enquiry.js";

export const updateEnquiry = async function (req, res) {
  const enquiry_id = req.params.id;
  if (!enquiry_id) {
    return res.status(404).send({ message: "Can't find Enquiry." });
  }

  const user_id = req.user.id;

  const { content, title, topic, read } = req.body;
  const $set = {
    // Fields to update
    ...(content !== undefined && { content }),
    ...(title !== undefined && { title }),
    ...(topic !== undefined && { topic }),
    ...(read !== undefined && { read }),
  };
  const options = { new: true };

  try {
    const enquiry = await Enquiry.findOneAndUpdate(
      {
        $or: [
          { "users.from.user_id": user_id, enquiry_id },
          { "users.to.user_id": user_id, enquiry_id },
        ],
      },
      { $set },
      options
    );

    if (!enquiry) {
      return res.status(404).send({ message: "Can't find Enquiry." });
    }
    return res.status(201).send({ data: enquiry });
  } catch (error) {
    return res.status(400).send(error);
  }
};
