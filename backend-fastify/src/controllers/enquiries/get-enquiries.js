import { Enquiry } from "../../models/enquiry.js";

export const getEnquiries = async function (req, res) {
  const list = await Enquiry.find();
  res.status(200).send(list);
};
