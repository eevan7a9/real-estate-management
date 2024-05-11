import { User } from "../../models/user.js";

export const getUsers = async function (_, res) {
  const users = await User.find();
  return res.status(200).send({ data: users });
};
