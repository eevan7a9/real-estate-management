import { Enquiry } from "../models/enquiry.js";
import { v4 as uuidV4 } from "uuid";

export const getEnquiries = async function (req, res) {
  const list = await Enquiry.find();
  res.status(200).send(list);
};

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
    res.status(201).send(newEnquiry);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateEnquiry = async function (req, res) {
  const enquiry_id = req.params.id;
  if (!enquiry_id) {
    res.status(404).send({ message: "Error: Can't find Enquiry." });
    return;
  }
  const { content, email, title, topic, read, property, user } = req.body;
  const $set = {
    // Fields to update
    ...(content !== undefined && { content }),
    ...(email !== undefined && { email: email.toLowerCase() }),
    ...(title !== undefined && { title }),
    ...(topic !== undefined && { topic }),
    ...(read !== undefined && { read }),
    ...(property !== undefined && { property }),
    ...(user !== undefined && { user }),
  };
  const options = { new: true };
  try {
    const result = await Enquiry.findOneAndUpdate(
      { enquiry_id },
      { $set },
      options
    );
    if (!result) {
      res.status(404).send({ message: "Error: Can't find Enquiry." });
      return;
    }
    res.status(201).send({ ...result.toObject() });
  } catch (error) {
    res.status(400).send(error);
  }
};

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
