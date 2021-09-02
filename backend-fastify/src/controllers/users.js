import { users } from "../dummy-data/users.js";

export const getUsers = function (_, res) {
  res.status(200).send(users);
};
