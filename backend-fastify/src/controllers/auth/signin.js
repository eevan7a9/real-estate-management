import { ActivityType } from "../../enums/activity.js";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { addActivity } from "../../services/activity.js";
import { activitySigninDescription } from "../../utils/activity/index.js";

export const signIn = async function (req, res) {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (!foundUser) {
      return res.status(400).send({
        // error: "Internal Server Error",
        message: "Error: Invalid Email or Password.",
        // message: "Error: We can't find a user with that e-mail address.",
      });
    }
    const validPassword = await fastify.bcrypt.compare(
      password,
      foundUser.password
    );
    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Error: Invalid Email or Password." });
    }
    const { user_id } = foundUser;
    const accessToken = fastify.jwt.sign({ id: user_id });

    // We log as User activity
    addActivity(foundUser, {
      action: ActivityType.user.login,
      description: activitySigninDescription(foundUser),
      user_id,
    })
    await foundUser.save();

    return res.status(200).send({
      data: {
        ...foundUser.toObject(),
        accessToken,
      },
    });
  } catch (error) {
    return res.status(404).send({ message: "Error: Something went wrong." });
  }
};
