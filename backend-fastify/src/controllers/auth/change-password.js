import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import {authBearerToken} from "../../utils/requests.js";
import {isPasswordValid, userIdToken} from "../../utils/users.js";

export const changePassword = async function (req, res) {
  const { passwordCurrent, passwordNew } = req.body;
  if (!passwordCurrent) return res.status(400).send({ message: "Error: form is invalid, current password is missing" });
  else if (!passwordNew) return res.status(400).send({ message: "Error: form is invalid, new password is missing" });
  else if (passwordCurrent === passwordNew) return res.status(400).send({
    message: "Error: new password cannot be the same as your current password. Please choose a different password"
  })

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

    if (!isPasswordValid(passwordNew)) {
      return res.status(400).send({ message: "Error: New password is not valid." });
    }

    const hashedPassword = await fastify.bcrypt.hash(passwordNew);
    foundUser.password = hashedPassword;
    await foundUser.save();

    return res.status(200).send({});
  } catch (error) {
    return res.status(400).send({ message: "Error: Something went wrong." });
  }
};
