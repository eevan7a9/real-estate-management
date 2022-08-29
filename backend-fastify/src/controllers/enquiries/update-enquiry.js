import { Enquiry } from "../../models/enquiry.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

export const updateEnquiry = async function (req, res) {
  const enquiry_id = req.params.id;
  if (!enquiry_id) {
    res.status(404).send({ message: "Can't find Enquiry." });
    return;
  }

  const token = authBearerToken(req);
  const user_id = userIdToken(token);

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
          { 'users.from.user_id': user_id, enquiry_id},
          { 'users.to.user_id': user_id, enquiry_id},
        ],
      },
      { $set },
      options
    );

    if (!enquiry) {
      res.status(404).send({ message: "Can't find Enquiry." });
      return;
    }
    res.status(201).send({ data: enquiry });
  } catch (error) {
    res.status(400).send(error);
  }
};
