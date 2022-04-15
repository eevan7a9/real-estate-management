import { Enquiry } from "../../models/enquiry.js";
import { v4 as uuidV4 } from "uuid";

export const createEnquiry = async function (req, res) {
  const { title, topic, user } = req.body;
  if (!title || !topic || !user.from || !user.to) {
    res.status(400).send({ message: "Some fields are missing!." });
    return;
  }
  try {
    const newEnquiry = new Enquiry({
      enquiry_id: uuidV4(),
      read: false,
      ...req.body,
    });
    await newEnquiry.save();
    res.status(201).send({ data: newEnquiry });
  } catch (error) {
    res.status(400).send(error);
  }
};
