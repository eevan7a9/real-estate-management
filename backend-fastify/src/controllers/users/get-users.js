import { User } from "../../models/user.js";

const publicProjection = "user_id fullName about address";

export const getUsers = async function (req, res) {
  try {
    const users = await User.find().select(publicProjection).lean();
    return res.status(200).send({ data: users });
  } catch (error) {
    req.log.error({ err: error }, "Public user list fetch failed");
    return res.status(500).send({ message: "Error: Unable to fetch users." });
  }
};
