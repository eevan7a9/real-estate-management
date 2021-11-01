import { Property } from "../models/property.js";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";
import util from "util";
import { pipeline } from "stream";
const pump = util.promisify(pipeline);

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

export const updateProperty = async function (req, res) {
  const property_id = req.params.id;
  if (!property_id) {
    res.status(400).send({ message: "Error: Can't update unknown property" });
  }
  const {
    name,
    address,
    description,
    type,
    position,
    price,
    features,
    currency,
    contactNumber,
    contactEmail,
  } = req.body;
  const $set = {
    // Fields to update
    ...(name !== undefined && { name }),
    ...(address !== undefined && { address }),
    ...(description !== undefined && { description }),
    ...(type !== undefined && { type }),
    ...(position !== undefined && { position }),
    ...(price !== undefined && { price }),
    ...(features !== undefined && { features }),
    ...(currency !== undefined && { currency }),
    ...(contactNumber !== undefined && { contactNumber }),
    ...(contactEmail !== undefined && {
      contactEmail: contactEmail.toLowerCase(),
    }),
  };
  try {
    const options = { useFindAndModify: false, new: true, runValidators: true };
    const result = await Property.findOneAndUpdate(
      { property_id },
      { $set },
      options
    );
    if (!result) {
      res.status(400).send({ message: "Error: Can't update unknown property" });
      return;
    }
    res.status(201).send({
      ...result.toObject(),
      message: "Success: Property is updated.",
    });
  } catch (error) {
    res.send(error);
  }
};

export const deleteProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const property = await Property.findOneAndDelete({ property_id: id });

    if (property) {
      res.status(200).send({
        ...property.toObject(),
        message: "Success: Property deleted!",
      });
      return;
    }
    res.status(404).send({ message: "Error: Can't find property." });
  } catch (error) {
    res.send(error);
  }
};

export const addImagesProperty = async function (req, res) {
  try {
    const data = await req.file();
    data.fieldname;

    fs.statSync("uploads/");
    await pump(data.file, fs.createWriteStream(data.filename));
    res.send({ message: data.filename + " is uploaded" });
  } catch (error) {
    res.send(error);
  }
};
