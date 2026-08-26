import { Enquiry } from "../../models/enquiry.js";

export const getEnquiries = async function (req, res) {
  const user_id = req.user.id;

  try {
    const list = await Enquiry.find({
      $or: [
        { "users.from.user_id": user_id, "users.from.keep": true },
        { "users.to.user_id": user_id, "users.to.keep": true },
      ],
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: list });
  } catch (error) {
    req.log.error({ err: error }, "Enquiry list fetch failed");
    return res
      .status(500)
      .send({ message: "Error: Unable to fetch enquiries." });
  }
};
