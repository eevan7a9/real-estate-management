// DUMMY DATA
import { enquiries } from "../dummy-data/enquiries.js";

export const getEnquiries = function (req, res) {
  res.status(200).send(enquiries);
};

export const getEnquiry = function (req, res) {
  const { id } = req.params;
  const foundEnquiry = enquiries.find((enq) => enq.enquiry_id === id);
  if (foundEnquiry) {
    res.status(200).send(foundEnquiry);
  }
};
