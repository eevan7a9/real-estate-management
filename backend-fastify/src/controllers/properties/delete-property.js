import { Property } from "../../models/property.js";
import { User } from "../../models/user.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";
import { unlinkImages } from "./image-property.js";

export const deleteProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const token = authBearerToken(req);
    const user_id = userIdToken(token);
    const property = await Property.findOneAndDelete({ property_id: id, user_id });
    if (!property) {
      res.status(404).send({});
    }
    if (property.images?.length) {
      unlinkImages(property.images);
    }
    const user = await User.findOne({ user_id });
    user.properties = user.properties.filter(i => i !== property.property_id);
    user.save();

    res.status(200).send({ data: { ...property.toObject() } });
    return;
  } catch (error) {
    res.send(error);
  }
};
