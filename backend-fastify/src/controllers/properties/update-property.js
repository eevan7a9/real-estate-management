import { Property } from "../../models/property.js";

export const updateProperty = async function (req, res) {
  const property_id = req.params.id;
  if (!property_id) {
    res.status(404).send({ message: "Error: Can't update unknown property" });
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
      res.status(404).send({ message: "Error: Can't update unknown property" });
      return;
    }
    res.status(201).send({
      data: { ...result.toObject() },
      message: "Success: Property is updated.",
    });
  } catch (error) {
    res.send(error);
  }
};
