import fs from "fs";
import path from "path";
import { Property } from "../../models/property.js";

export const deleteProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const property = await Property.findOneAndDelete({ property_id: id });
    if (!property) {
      res.status(404).send({});
    }
    if (property.images?.length) {
      const images = property.images.map((img) => {
        const imgSplt = img.split("/");
        return imgSplt[imgSplt.length - 1];
      });
      images.forEach((img) => {
        const __dirname = path.resolve();
        fs.unlink(__dirname + "/uploads/" + img, (err) => {
          if (err) console.log(err);
          console.log("Successfully deleted " + img);
        });
      });
    }

    res.status(200).send({ data: { ...property.toObject() } });
    return;
  } catch (error) {
    res.send(error);
  }
};
