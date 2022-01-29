import { v4 as uuidv4 } from "uuid";
import { Property } from "../../models/property.js";

export const createProperty = async function (req, res) {
  const { name, address, type, position } = req.body;
  if (!name || !address || !type || !position) {
    res.status(400).send({ message: "Error: Required fields are missing." });
    return;
  }
  try {
    const newProperty = new Property({
      property_id: uuidv4(),
      ...req.body,
    });
    await newProperty.save();
    res.status(201).send({ data: newProperty });
  } catch (error) {
    res.send(error);
  }
};
