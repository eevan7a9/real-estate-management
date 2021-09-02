import { users } from "../dummy-data/users.js";

export const register = async function (req, res) {
  const { fullName, email, password } = req.body;
  const userExist = users.find(
    (user) => user.email === email || user.fullName === fullName
  );
  if (userExist) {
    res.status(400).send({ message: "Error: User already exists" });
  }
  if (fullName && email && password) {
    const hashedPassword = password + "hashed";
    const user = {
      id: "newID",
      fullName,
      email,
      password: hashedPassword,
    };
    users.push(user);
    const accessToken = "string";
    res.status(201).send({ ...user, accessToken });
  }
  res.status(400).send({ message: "Error: form is invalid" });
};
