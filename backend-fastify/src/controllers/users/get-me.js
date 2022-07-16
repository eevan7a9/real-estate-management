import { User } from "../../models/user.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

export const getMe = async function (req, res) {
    const token = authBearerToken(req);
    const user_id = userIdToken(token);
    try {
        const user = await User.findOne({ user_id });
        res.send({ data: user });
    } catch (error) {
        res.send(error);
    }
};
