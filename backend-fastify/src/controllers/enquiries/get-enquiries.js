import { Enquiry } from "../../models/enquiry.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

export const getEnquiries = async function (req, res) {
  const token = authBearerToken(req);
  const user_id = userIdToken(token);

  try {
    const list = await Enquiry.find({
      $or: [
        { 'users.from.user_id': user_id, 'users.from.keep': true },
        { 'users.to.user_id': user_id, 'users.to.keep': true },
      ]
    });
    res.status(200).send({ data: list });
  } catch (error) {
    res.status(400).send(error);
  }
};
