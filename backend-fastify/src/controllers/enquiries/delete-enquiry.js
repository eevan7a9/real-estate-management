import { Enquiry } from "../../models/enquiry.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

export const deleteEnquiry = async function (req, res) {
  const { id } = req.params;
  const token = authBearerToken(req);
  const user_id = userIdToken(token);

  try {
    const enquiry = await Enquiry.findOne({ enquiry_id: id });
    if (!enquiry) {
      return res.status(404).send({});
    }
    if (enquiry.users.from.user_id !== user_id && enquiry.users.to.user_id !== user_id) {
      return res.status(400).send({ message: "Not allowed." });
    }
    if (enquiry.users.from.user_id === user_id) {
      enquiry.users.from.keep = false;
    }
    if (enquiry.users.to.user_id === user_id) {
      enquiry.users.to.keep = false;
    }
    if (!enquiry.users.from.keep && !enquiry.users.to.keep) {
      // if both sender & receiver have deleted the message
      await enquiry.delete();
    } else {
      await enquiry.save();
    }
    res
      .status(200)
      .send({ data: enquiry });
  } catch (error) {
    res.status(400).send(error);
  }
}

