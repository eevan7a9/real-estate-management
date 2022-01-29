import { Enquiry } from "../../models/enquiry.js";

export const getEnquiry = async function (req, res) {
  const { id } = req.params;
  try {
    const found = await Enquiry.findOne({ enquiry_id: id });
    if (!found) {
      res.status(404).send({ message: "Error: Can't find Enquiry." });
      return;
    }
    res.status(200).send(found);
  } catch (error) {
    res.status(400).send(error);
  }
};
