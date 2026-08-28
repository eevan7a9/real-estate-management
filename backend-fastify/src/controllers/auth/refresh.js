import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import {
  REFRESH_TOKEN_COOKIE,
  clearRefreshTokenCookie,
  revokeRefreshSession,
  rotateRefreshSession,
  setRefreshTokenCookie,
} from "../../services/auth-session.js";

export const refresh = async function (req, res) {
  const rotatedSession = await rotateRefreshSession(
    req.cookies[REFRESH_TOKEN_COOKIE],
    req,
  );
  if (!rotatedSession) {
    clearRefreshTokenCookie(res);
    return res
      .status(401)
      .send({ message: "Invalid or expired refresh token." });
  }

  const user = await User.exists({ user_id: rotatedSession.userId });
  if (!user) {
    await revokeRefreshSession(rotatedSession.refreshToken);
    clearRefreshTokenCookie(res);
    return res
      .status(401)
      .send({ message: "Invalid or expired refresh token." });
  }

  setRefreshTokenCookie(res, rotatedSession.refreshToken);
  return res.status(200).send({
    data: { accessToken: fastify.jwt.sign({ id: rotatedSession.userId }) },
  });
};
