import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Property } from "../../models/property.js";

const MAX_IMAGES_PER_PROPERTY = 10;
const uploadsDirectory = path.join(process.cwd(), "uploads");

const getImageExtension = function (buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpg";
  }
  if (
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "png";
  }
  if (
    buffer.length >= 6 &&
    (buffer.subarray(0, 6).toString() === "GIF87a" ||
      buffer.subarray(0, 6).toString() === "GIF89a")
  ) {
    return "gif";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP"
  ) {
    return "webp";
  }
  return null;
};

const isPropertyOwner = function (property, userId) {
  return property.user_id === userId;
};

export const addImagesProperty = async function (req, res) {
  const property_id = req.params.id;
  try {
    const property = await Property.findOne({ property_id });
    if (!property) {
      return res.status(404).send({ message: "Error: Can not find property." });
    }
    if (!isPropertyOwner(property, req.user.id)) {
      return res
        .status(403)
        .send({ message: "Error: You do not own this property." });
    }

    const existingImages = property.images || [];
    const uploads = [];
    const parts = await req.files();
    for await (const data of parts) {
      const buffer = await data.toBuffer();
      if (data.file.truncated) {
        return res
          .status(400)
          .send({ message: "Error: An image exceeds the 2 MB size limit." });
      }

      const extension = getImageExtension(buffer);
      if (!extension) {
        return res.status(400).send({
          message:
            "Error: Only JPEG, PNG, GIF, and WebP image files are allowed.",
        });
      }
      uploads.push({ buffer, filename: `${randomUUID()}.${extension}` });
    }

    if (!uploads.length) {
      return res
        .status(400)
        .send({ message: "Error: No images were uploaded." });
    }
    if (existingImages.length + uploads.length > MAX_IMAGES_PER_PROPERTY) {
      return res.status(400).send({
        message: `Error: A property can contain at most ${MAX_IMAGES_PER_PROPERTY} images.`,
      });
    }

    await fs.promises.mkdir(uploadsDirectory, { recursive: true });
    const savedPaths = [];
    try {
      for (const upload of uploads) {
        const filePath = path.join(uploadsDirectory, upload.filename);
        await fs.promises.writeFile(filePath, upload.buffer, { flag: "wx" });
        savedPaths.push(filePath);
      }

      const imageUrls = uploads.map(
        ({ filename }) =>
          `${req.protocol}://${req.headers.host}/uploads/${filename}`,
      );
      property.images = [...existingImages, ...imageUrls];
      await property.save();
      return res.status(201).send({ data: property.images });
    } catch (error) {
      await Promise.all(
        savedPaths.map((filePath) =>
          fs.promises.unlink(filePath).catch(() => {}),
        ),
      );
      throw error;
    }
  } catch (error) {
    if (error.code === "FST_REQ_FILE_TOO_LARGE") {
      return res
        .status(413)
        .send({ message: "Error: An image exceeds the 2 MB size limit." });
    }
    req.log.error({ err: error }, "Property image upload failed");
    return res.status(500).send({ message: "Error: Unable to upload images." });
  }
};

export const deleteImagesProperty = async function (req, res) {
  const property_id = req.params.id;
  const { images } = req.body;
  if (!Array.isArray(images)) {
    return res.status(400).send({ message: "Error: Images must be an array." });
  }

  try {
    const property = await Property.findOne({ property_id });
    if (!property) {
      return res.status(404).send({ message: "Error: Can not find property." });
    }
    if (!isPropertyOwner(property, req.user.id)) {
      return res
        .status(403)
        .send({ message: "Error: You do not own this property." });
    }

    const currentImages = property.images || [];
    const requestedImages = new Set(images);
    const imagesToDelete = currentImages.filter((image) =>
      requestedImages.has(image),
    );
    property.images = currentImages.filter(
      (image) => !requestedImages.has(image),
    );
    await property.save();
    await unlinkImages(imagesToDelete);

    return res.status(200).send({ data: imagesToDelete });
  } catch (error) {
    req.log.error({ err: error }, "Property image deletion failed");
    return res.status(500).send({ message: "Error: Unable to delete images." });
  }
};

export const unlinkImages = async function (propertyImages = []) {
  await Promise.all(
    propertyImages.map(async (image) => {
      try {
        const filename = path.basename(new URL(image).pathname);
        const filePath = path.resolve(uploadsDirectory, filename);
        if (path.dirname(filePath) !== path.resolve(uploadsDirectory)) return;
        await fs.promises.unlink(filePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Unable to delete property image", error);
        }
      }
    }),
  );
};
