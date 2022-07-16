import { Enquiry } from "../../models/enquiry.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";
import { User } from "../../models/user.js";

export const deleteEnquiry = async function (req, res) {
  const { id } = req.params;
  const token = authBearerToken(req);
  const user_id = userIdToken(token);
  try {
    const enquiry = await Enquiry.findOne({ enquiry_id: id });
    if (!enquiry) {
      return res.status(404).send({});
    }
    const { from, to } = enquiry.user;
    if (from !== user_id && to !== user_id) {
      return res.status(400).send({ message: "Not allowed." });
    }
    await enquiry.delete();

    const users = await User.find({ user_id: { "$in": [from, to] } });
    users.forEach(async (user) => {
      user.enquiries = user.enquiries.filter(i => i !== enquiry.enquiry_id);
      await user.save();
    });
    res
      .status(200)
      .send({ data: enquiry });
  } catch (error) {
    res.status(400).send(error);
  }
}

