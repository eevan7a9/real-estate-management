import { User } from "../../models/user.js";

export const getUser = async function (req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({ user_id: id });
        if (!user) {
            return res.status(404).send({ message: "Error: Can't find User." });
        }
        res.send({ data: user });
    } catch (error) {
        res.send(error);
    }
};
