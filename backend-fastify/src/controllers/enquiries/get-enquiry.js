import { Enquiry } from "../../models/enquiry.js";

export const getEnquiry = async function (req, res) {
  const { id } = req.params;
  const user_id = req.user?.id;
  try {
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
