import { Enquiry } from "../../models/enquiry.js";

export const getEnquiries = async function (req, res) {
  try {
    const list = await Enquiry.find();
    res.status(200).send({ data: list });
  } catch (error) {
    res.status(400).send(error);
  }
};
