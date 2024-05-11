import { Property } from "../../models/property.js";

export const getProperties = async function (_, res) {
  const properties = await Property.find();
  return res.status(200).send({ data: properties });
};
