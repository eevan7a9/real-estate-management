import { properties } from "../dummy-data/properties.js";
import { Property } from "../models/property.js";
import { v4 as uuidv4 } from "uuid";
export const getProperties = function (_, res) {
  res.status(200).send(properties);
};

export const getProperty = function (req, res) {
  const findProperty = properties.find(
    (property) => property.id == req.params.id
  );
  if (findProperty) {
    res.status(200).send(findProperty);
  }
};

export const createProperty = async function (req, res) {
  const {
    name,
    address,
    description,
    type,
    position,
    price,
    date,
    enquiries,
    currency,
    features,
  } = req.body;
  if (!name || !address || !type || !position) {
    res.status(400).send({ message: "Required fields are missing" });
    return;
  }
  try {
    const newProperty = new Property({
      property_id: uuidv4(),
      name,
      address,
      description,
      type,
      position,
      price,
      date,
      enquiries,
      currency,
      features,
    });
    await newProperty.save();
    res.status(201).send(newProperty);
  } catch (error) {
    res.send(error);
  }
};
