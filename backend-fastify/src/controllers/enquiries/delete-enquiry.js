import { Enquiry } from "../../models/enquiry.js";

export const deleteEnquiry = async function (req, res) {
  const { id } = req.params;
  try {
    const found = await Enquiry.findOneAndDelete({ enquiry_id: id });
    if (!found) {
      res.status(404).send({ message: "Error: Can't find Enquiry." });
      return;
    }
    res
      .status(200)
      .send({ ...found.toObject(), message: "Success: Enquiry deleted!" });
  } catch (error) {
    res.status(400).send(error);
  }
};
