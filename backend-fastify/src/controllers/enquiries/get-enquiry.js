import { Enquiry } from "../../models/enquiry.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

export const getEnquiry = async function (req, res) {
  const { id } = req.params;
  try {
    const token = authBearerToken(req);
    const user_id = userIdToken(token);
    const enquiry = await Enquiry.findOne({ 
      enquiry_id: id,
      $or: [
        {"users.from.user_id": user_id, "users.from.keep": true},
        {"users.to.user_id": user_id, "users.to.keep": true},
      ]
    });

    if (!enquiry) {
      return res.status(200).send({ message: "Can't find Enquiry." });
    }
    return res.status(200).send({ data: enquiry });
  } catch (error) {
    return res.status(400).send(error);
  }
};
