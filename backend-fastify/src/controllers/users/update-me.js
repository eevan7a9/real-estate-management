import { User } from "../../models/user.js";
import {
  createImageUpload,
  createImageUrl,
  saveImageUploads,
  unlinkStoredImages,
} from "../../utils/uploads/images.js";

/**
 *
 * @param {import("fastify/types/request").FastifyRequest} req
 * @param {import("fastify/types/reply").FastifyReply} res
 */
export const updateMe = async function (req, res) {
  const user_id = req.user.id;
  const { fullName, about, address } = req.body;
  const $set = {
    ...(fullName !== undefined && { fullName }),
    ...(about !== undefined && { about }),
    ...(address !== undefined && { address }),
  };
  try {
    const options = { new: true, runValidators: true };
    const updatedUser = await User.findOneAndUpdate(
      { user_id },
      { $set },
      options,
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "Error: User not found." });
    }

    res.status(200).send({
      message: "Success: update user information.",
      data: updatedUser,
    });
  } catch {
    res.status(500).send({
      message: "Error: An internal error occurred, please try again later.",
    });
  }
};

export const uploadProfileImage = async function (req, res) {
  let imageUrl;
  try {
    const uploads = [];
    const parts = await req.parts();
    for await (const part of parts) {
      if (part.type !== "file" || part.fieldname !== "image") {
        return res.status(400).send({
          message: "Error: Submit one image file using the image field.",
        });
      }
      if (part.file.truncated) {
        return res
          .status(413)
          .send({ message: "Error: An image exceeds the 2 MB size limit." });
      }
      const upload = createImageUpload(await part.toBuffer());
      if (!upload) {
        return res.status(400).send({
          message:
            "Error: Only JPEG, PNG, GIF, and WebP image files are allowed.",
        });
      }
      uploads.push(upload);
    }

    if (uploads.length !== 1) {
      return res.status(400).send({
        message: "Error: Submit exactly one profile image.",
      });
    }

    const user = await User.findOne({ user_id: req.user.id });
    if (!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }

    await saveImageUploads(uploads, "profiles");
    imageUrl = createImageUrl(req, uploads[0].filename, "profiles");
    const previousImage = user.profileImage;
    user.profileImage = imageUrl;
    await user.save();
    await unlinkStoredImages(previousImage ? [previousImage] : [], "profiles");

    return res.status(200).send({
      message: "Success: profile image uploaded.",
      data: user,
    });
  } catch (error) {
    if (imageUrl) await unlinkStoredImages([imageUrl], "profiles");
    if (error.code === "FST_REQ_FILE_TOO_LARGE") {
      return res
        .status(413)
        .send({ message: "Error: An image exceeds the 2 MB size limit." });
    }
    req.log.error({ err: error }, "Profile image upload failed");
    return res
      .status(500)
      .send({ message: "Error: Unable to upload profile image." });
  }
};
