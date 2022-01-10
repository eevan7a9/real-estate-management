// DUMMY DATA
import { enquiries } from "../dummy-data/enquiries.js";

export const getEnquiries = function (req, res) {
  res.status(200).send(enquiries);
};
