import { Property } from "../../models/property.js";
import { unlinkImages } from "./image-property.js";

export const deleteProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const property = await Property.findOneAndDelete({ property_id: id });
    if (!property) {
      res.status(404).send({});
    }
    if (property.images?.length) {
      unlinkImages(property.images);
    }

    res.status(200).send({ data: { ...property.toObject() } });
    return;
  } catch (error) {
    res.send(error);
  }
};
