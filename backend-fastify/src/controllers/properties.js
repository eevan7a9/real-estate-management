import { Property } from "../models/property.js";
import { v4 as uuidv4 } from "uuid";

export const getProperties = async function (_, res) {
  const properties = await Property.find();
  res.status(200).send(properties);
};

export const getProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const property = await Property.findOne({ property_id: id });
    res.status(200).send(property);
  } catch (error) {
    res.status(404).send({ message: "Error: Can't find property." });
  }
};

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
    res.status(201).send(newProperty);
  } catch (error) {
    res.send(error);
  }
};
