import { Enquiry } from "../../models/enquiry.js";

export const updateEnquiry = async function (req, res) {
  const enquiry_id = req.params.id;
  const user_id = req.user.id;

  if (
    req.body?.read !== true ||
    Object.keys(req.body).some((key) => key !== "read")
  ) {
    return res.status(400).send({
      message: "Error: Only the recipient can mark an enquiry as read.",
    });
  }

  try {
    const enquiry = await Enquiry.findOneAndUpdate(
      {
        enquiry_id,
        "users.to.user_id": user_id,
        "users.to.keep": true,
      },
      { $set: { read: true } },
      { new: true, runValidators: true },
    );

    if (!enquiry) {
      return res.status(404).send({ message: "Error: Can not find enquiry." });
    }
    return res.status(200).send({ data: enquiry });
  } catch (error) {
    req.log.error({ err: error }, "Enquiry update failed");
    return res
      .status(500)
      .send({ message: "Error: Unable to update enquiry." });
  }
};
