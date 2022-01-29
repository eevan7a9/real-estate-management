import fs from "fs";
import util from "util";
import path from "path";
import { pipeline } from "stream";
import { Property } from "../../models/property.js";

const pump = util.promisify(pipeline);

export const addImagesProperty = async function (req, res) {
  const property_id = req.params.id;
  try {
    // We check if property exists
    const foundProperty = await Property.findOne({ property_id });
    if (!foundProperty) {
      res.status(404).send({ message: "Error: Can't find property." });
      return;
    }
    // If property do exist save uploaded files
    const parts = await req.files();
    for await (const data of parts) {
      const imgName = new Date().getTime() + "-" + data.filename;
      fs.statSync("uploads/");
      await pump(
        data.file,
        fs.createWriteStream(path.join(process.cwd(), "uploads", imgName))
      );
      const image =
        req.protocol + "://" + req.headers.host + "/uploads/" + imgName;
      // We update Property images
      foundProperty.images.push(image);
      foundProperty.save();
    }
    res.status(201).send({ data: foundProperty.images });
  } catch (error) {
    res.send(error);
  }
};
