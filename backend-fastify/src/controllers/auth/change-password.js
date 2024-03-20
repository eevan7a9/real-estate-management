import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import {authBearerToken} from "../../utils/requests.js";
import {userIdToken} from "../../utils/users.js";

export const changePassword = async function (req, res) {
  const { passwordCurrent, passwordNew } = req.body;
  if (!passwordCurrent) res.status(400).send({ message: "Error: form is invalid, current password is missing" });
  else if (!passwordNew) res.status(400).send({ message: "Error: form is invalid, new password is missing" });

  const token = authBearerToken(req);
  const user_id = userIdToken(token);

  try {
    const foundUser = await User.findOne({ user_id });
    if (!foundUser) {
      return res.status(404).send({
        statusCode: 404,
        message: "Error: We can't find the user.",
      });
    }

    const validPasswordCurrent = await fastify.bcrypt.compare(passwordCurrent, foundUser.password);
    if (!validPasswordCurrent) {
      return res.status(400).send({ message: "Error: Current password is not valid." });
    }

    const validPasswordNew = passwordNew.length >= 8 &&
        passwordNew.match(/\d/) &&
        passwordNew.match(/[A-Z]/) &&
        passwordNew.match(/[a-z]/) &&
        passwordNew.match(/[!@#$%^&*(),.?":{}|<>]/)

    if (!validPasswordNew) {
      return res.status(400).send({ message: "Error: New password is not valid." });
    }

    const hashedPassword = await fastify.bcrypt.hash(passwordNew);
    foundUser.password = hashedPassword;
    await foundUser.save();

    res.status(200).send({});
  } catch (error) {
    res.status(400).send({ message: "Error: Something went wrong." });
  }
};
