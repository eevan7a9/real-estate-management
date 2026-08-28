import { randomBytes } from "node:crypto";
import argon2 from "argon2";
import { RefreshSession } from "../models/refresh-session.js";

export const REFRESH_TOKEN_COOKIE = "refresh_token";

const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = "14d";

const durationToMs = function (value, fallback) {
  const match = /^(\d+)\s*([smhdw])$/i.exec(value || "");
  if (!match) return fallback;

  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  };
  return Number(match[1]) * units[match[2].toLowerCase()];
};

export const getRefreshTokenExpiresIn = () =>
  process.env.REFRESH_TOKEN_EXPIRES_IN || DEFAULT_REFRESH_TOKEN_EXPIRES_IN;

export const getRefreshTokenMaxAgeMs = () =>
  durationToMs(getRefreshTokenExpiresIn(), 14 * 24 * 60 * 60 * 1000);

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/auth",
  maxAge: Math.floor(getRefreshTokenMaxAgeMs() / 1000),
});

export const setRefreshTokenCookie = function (reply, refreshToken) {
  reply.setCookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions());
};

export const clearRefreshTokenCookie = function (reply) {
  reply.clearCookie(REFRESH_TOKEN_COOKIE, refreshCookieOptions());
};

const createTokenParts = () => ({
  selector: randomBytes(18).toString("base64url"),
  secret: randomBytes(48).toString("base64url"),
});

const serializeToken = ({ selector, secret }) => `${selector}.${secret}`;

const parseToken = function (token) {
  if (typeof token !== "string") return null;
  const [selector, secret, extra] = token.split(".");
  if (!selector || !secret || extra) return null;
  return { selector, secret };
};

const requestMetadata = (request) => ({
  userAgent: request.headers["user-agent"]?.slice(0, 500),
  ipAddress: request.ip?.slice(0, 100),
});

export const createRefreshSession = async function (userId, request) {
  const tokenParts = createTokenParts();
  const now = new Date();
  await RefreshSession.create({
    userId,
    selector: tokenParts.selector,
    tokenHash: await argon2.hash(tokenParts.secret),
    expiresAt: new Date(now.getTime() + getRefreshTokenMaxAgeMs()),
    lastUsedAt: now,
    ...requestMetadata(request),
  });
  return serializeToken(tokenParts);
};

export const rotateRefreshSession = async function (refreshToken, request) {
  const tokenParts = parseToken(refreshToken);
  if (!tokenParts) return null;

  const session = await RefreshSession.findOne({
    selector: tokenParts.selector,
  });
  const now = new Date();
  if (!session || session.expiresAt <= now) return null;

  const isValid = await argon2.verify(session.tokenHash, tokenParts.secret);
  if (!isValid) {
    await RefreshSession.deleteOne({ _id: session._id });
    return null;
  }

  const replacement = {
    selector: tokenParts.selector,
    secret: randomBytes(48).toString("base64url"),
  };
  const replacementHash = await argon2.hash(replacement.secret);
  const result = await RefreshSession.updateOne(
    {
      _id: session._id,
      tokenHash: session.tokenHash,
      expiresAt: { $gt: now },
    },
    {
      $set: {
        tokenHash: replacementHash,
        expiresAt: new Date(now.getTime() + getRefreshTokenMaxAgeMs()),
        lastUsedAt: now,
        ...requestMetadata(request),
      },
    },
  );
  if (result.modifiedCount !== 1) return null;

  return { userId: session.userId, refreshToken: serializeToken(replacement) };
};

export const revokeRefreshSession = async function (refreshToken) {
  const tokenParts = parseToken(refreshToken);
  if (!tokenParts) return;

  const session = await RefreshSession.findOne({
    selector: tokenParts.selector,
  });
  if (!session) return;

  const isValid = await argon2.verify(session.tokenHash, tokenParts.secret);
  if (isValid) await RefreshSession.deleteOne({ _id: session._id });
};

export const revokeAllRefreshSessions = (userId) =>
  RefreshSession.deleteMany({ userId });
