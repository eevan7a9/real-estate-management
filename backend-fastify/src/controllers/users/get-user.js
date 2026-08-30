import { User } from "../../models/user.js";

const publicProjection = "user_id fullName about address profileImage";

export const getUser = async function (req, res) {
  const { id } = req.params;
  try {
    const user = await User.findOne({ user_id: id })
      .select(publicProjection)
      .lean();
    if (!user) {
      return res.status(404).send({ message: "Error: Can not find user." });
    }
    return res.status(200).send({ data: user });
  } catch (error) {
    req.log.error({ err: error }, "Public user fetch failed");
    return res.status(500).send({ message: "Error: Unable to fetch user." });
  }
};
