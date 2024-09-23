import { User } from "../../models/user.js";

export const getMe = async function (req, res) {
    const user_id = req.user.id;

    try {
        const user = await User.findOne({ user_id });
        return res.send({ data: user });
    } catch (error) {
        return res.send(error);
    }
};
