import { Enquiry } from "../../models/enquiry.js";

export const deleteEnquiry = async function (req, res) {
  const { id } = req.params;
  try {
    const enquiry = await Enquiry.findOneAndDelete({ enquiry_id: id });
    if (!enquiry) {
      res.status(404).send({ message: "Error: Can't find Enquiry." });
      return;
    }
    res
      .status(200)
      .send({ data: enquiry, message: "Success: Enquiry deleted!" });
  } catch (error) {
    res.status(400).send(error);
  }
};
