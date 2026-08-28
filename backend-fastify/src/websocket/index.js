import { fastify } from "../index.js";

/**
 * Sends a WebSocket notification to specific clients.
 * @param {Object} payload - The payload to send as a WebSocket notification.
 * @param {String} type - The type of notification to send.
 * @param {String|String[]} targetUserId - A string or an array of user IDs to send the notification to.
 */
export const sendTargetedNotification = function (type, payload, targetUserId) {
  fastify.websocketServer.clients.forEach((client) => {
    if (
      (Array.isArray(targetUserId)
        ? targetUserId.includes(client.userId)
        : targetUserId === client.userId) &&
      client.readyState === client.OPEN
    ) {
      client.send(JSON.stringify({ type, payload }));
    }
  });
};

/**
 * Sends a WebSocket notification to all connected clients.
 * @param {Object} payload - The payload to send as a WebSocket notification.
 * @param {String} type - The type of notification to send.
 */
export const sendGeneralNotification = function (type, payload) {
  fastify.websocketServer.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type, payload }));
    }
  });
};

/**
 * Sets up WebSocket functionality for the Fastify instance.
 */
export const setFastifyWebsocket = function () {
  fastify.register(async function (fastify) {
    fastify.get("/websocket", { websocket: true }, (socket, req) => {
      const rawToken = req.query?.userToken || req.request?.query?.userToken;
      const token =
        typeof rawToken === "string" ? rawToken.replace(/^Bearer\s+/i, "") : "";

      let payload;
      try {
        payload = fastify.jwt.verify(token);
      } catch (error) {
        req.log.warn(
          { err: error },
          "Rejected unauthenticated WebSocket connection",
        );
        socket.close(1008, "Authentication required");
        return;
      }

      if (!payload?.id || typeof payload.exp !== "number") {
        req.log.warn("Rejected WebSocket token without required claims");
        socket.close(1008, "Authentication required");
        return;
      }

      const expiresInMs = payload.exp * 1000 - Date.now();
      if (expiresInMs <= 0) {
        socket.close(1008, "Authentication required");
        return;
      }

      // clientTracking is enabled on the WebSocket server, so authenticated
      // sockets are already included in websocketServer.clients.
      socket.userId = payload.id;
      const expirationTimer = setTimeout(() => {
        socket.close(1008, "Token expired");
      }, expiresInMs);

      socket.on("close", () => {
        clearTimeout(expirationTimer);
      });
    });
  });
};
