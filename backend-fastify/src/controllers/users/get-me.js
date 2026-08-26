import { User } from "../../models/user.js";

const privateProjection =
  "user_id email fullName about address verified createdAt updatedAt properties";

export const getMe = async function (req, res) {
  const user_id = req.user.id;

  try {
    const user = await User.findOne({ user_id })
      .select(privateProjection)
      .lean();
    if (!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    return res.status(200).send({ data: user });
  } catch (error) {
    req.log.error({ err: error }, "Current user fetch failed");
    return res
      .status(500)
      .send({ message: "Error: Unable to fetch current user." });
  }
};
