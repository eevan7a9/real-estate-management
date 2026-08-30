import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const uploadsDirectory = path.join(process.cwd(), "uploads");

export const getImageExtension = function (buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  )
    return "jpg";
  if (
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    return "png";
  if (
    buffer.length >= 6 &&
    (buffer.subarray(0, 6).toString() === "GIF87a" ||
      buffer.subarray(0, 6).toString() === "GIF89a")
  )
    return "gif";
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP"
  )
    return "webp";
  return null;
};

export const createImageUpload = function (buffer) {
  const extension = getImageExtension(buffer);
  return extension
    ? { buffer, filename: `${randomUUID()}.${extension}` }
    : null;
};

export const saveImageUploads = async function (uploads, directory = "") {
  const targetDirectory = path.join(uploadsDirectory, directory);
  await fs.promises.mkdir(targetDirectory, { recursive: true });

  const savedPaths = [];
  try {
    for (const upload of uploads) {
      const filePath = path.join(targetDirectory, upload.filename);
      await fs.promises.writeFile(filePath, upload.buffer, { flag: "wx" });
      savedPaths.push(filePath);
    }
    return savedPaths;
  } catch (error) {
    await Promise.all(
      savedPaths.map((filePath) =>
        fs.promises.unlink(filePath).catch(() => {}),
      ),
    );
    throw error;
  }
};

export const createImageUrl = function (req, filename, directory = "") {
  const relativePath = directory ? `${directory}/${filename}` : filename;
  return `${req.protocol}://${req.headers.host}/uploads/${relativePath}`;
};

export const unlinkStoredImages = async function (
  imageUrls = [],
  directory = "",
) {
  const targetDirectory = path.resolve(uploadsDirectory, directory);
  const expectedPrefix = `/uploads/${directory ? `${directory}/` : ""}`;
  await Promise.all(
    imageUrls.map(async (imageUrl) => {
      try {
        const url = new URL(imageUrl);
        if (!url.pathname.startsWith(expectedPrefix)) return;
        const filePath = path.resolve(
          targetDirectory,
          path.basename(url.pathname),
        );
        if (path.dirname(filePath) !== targetDirectory) return;
        await fs.promises.unlink(filePath);
      } catch (error) {
        if (error.code !== "ENOENT")
          console.error("Unable to delete uploaded image", error);
      }
    }),
  );
};
