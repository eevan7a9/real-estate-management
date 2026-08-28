import {
  REFRESH_TOKEN_COOKIE,
  clearRefreshTokenCookie,
  revokeRefreshSession,
} from "../../services/auth-session.js";

export const logout = async function (req, res) {
  await revokeRefreshSession(req.cookies[REFRESH_TOKEN_COOKIE]);
  clearRefreshTokenCookie(res);
  return res.status(200).send({ message: "Success: User is now logged out." });
};
