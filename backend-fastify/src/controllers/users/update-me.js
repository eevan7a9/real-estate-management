import { User } from "../../models/user.js";

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
    const updatedUser = await User.findOneAndUpdate({ user_id }, { $set }, options);
    
    if (!updatedUser) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    
    res.status(200).send({
      message: "Success: update user information.",
      data: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error: An internal error occurred, please try again later.", });
  }
};
