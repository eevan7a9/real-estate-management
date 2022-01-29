import { Property } from "../../models/property.js";

export const getProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const property = await Property.findOne({ property_id: id });
    res.status(200).send({ data: property });
  } catch (error) {
    res.status(404).send({});
  }
};
