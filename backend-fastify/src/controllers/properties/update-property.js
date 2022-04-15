import { Property } from "../../models/property.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

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
    const token = authBearerToken(req);
    const user_id = userIdToken(token);
    const options = { useFindAndModify: false, new: true, runValidators: true };
    const property = await Property.findOneAndUpdate(
      { property_id, user_id },
      { $set },
      options
    );
    if (!property) {
      res.status(404).send({ message: "Error: Can't update unknown property" });
      return;
    }
    res.status(201).send({
      data: { ...property.toObject() },
      message: "Success: Property is updated.",
    });
  } catch (error) {
    res.send(error);
  }
};
