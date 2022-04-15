import fs from "fs";
import util from "util";
import path from "path";
import { pipeline } from "stream";
import { Property } from "../../models/property.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

const pump = util.promisify(pipeline);

const isPropertyOwner = function (property, req, res) {
  const token = authBearerToken(req);
  const user_id = userIdToken(token);
  if (property.user_id !== user_id) {
    return res.status(401).send({ message: "Error: you do not own the property." });
  }
}

export const addImagesProperty = async function (req, res) {
  const property_id = req.params.id;
  try {
    // We check if property exists
    const property = await Property.findOne({ property_id });
    if (!property) {
      return res.status(404).send({ message: "Error: Can't find property." });
    }

    isPropertyOwner(property, req, res);

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
      property.images.push(image);
      property.save();
    }
    res.status(201).send({ data: property.images });
  } catch (error) {
    res.send(error);
  }
};

export const deleteImagesProperty = async function (req, res) {
  const property_id = req.params.id;
  const { images } = req.body;
  try {
    // We check if property exists
    const property = await Property.findOne({ property_id });
    if (!property) {
      return res.status(404).send({ message: "Error: Can't find property." });
    }

    isPropertyOwner(property, req, res);

    property.images = property.images.filter(
      (img) => !images.includes(img)
    );
    property.save();
    unlinkImages(images);
    return res.send({ data: images });
  } catch (error) {
    res.send(error);
  }
};

export const unlinkImages = function (propertyImages = []) {
  const images = propertyImages.map((img) => {
    const imgSplt = img.split("/");
    return imgSplt[imgSplt.length - 1];
  });
  images.forEach((img) => {
    const __dirname = path.resolve();
    fs.unlink(__dirname + "/uploads/" + img, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Successfully deleted " + img);
    });
  });
};