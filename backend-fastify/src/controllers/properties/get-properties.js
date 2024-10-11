import { Property } from "../../models/property.js";

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getProperties = async function (req, res) {
  const {
    sort = "latest",
    limit = 4,
    lastCreatedAt,
    lastPrice,
    lastName,
  } = req.query;

  let sortOrder;
  let sortField;

  switch (sort) {
    case "name":
      sortField = "name";
      sortOrder = 1; // Ascending order (A-Z)
      break;
    case "price":
      sortField = "price";
      sortOrder = -1; // highest to lowest
      break;
    case "latest":
    default:
      sortField = "createdAt";
      sortOrder = -1; // newest first
      break;
  }
  const filterQuery = {};
  let rangeQuery = {};

  if (sort === "price" && lastPrice && lastCreatedAt) {
    rangeQuery = {
      price: { $lte: lastPrice },
      createdAt: { $ne: new Date(lastCreatedAt) },
    };
  } else if (sort === "latest" && lastCreatedAt) {
    rangeQuery = {
      createdAt: { $lt: new Date(lastCreatedAt) },
    };
  } else if (sort === "name" && lastName) {
    rangeQuery = {
      name: { $gt: lastName },
    };
  }
  const query = { ...filterQuery, ...rangeQuery };

  const properties = await Property.find(query)
    .select("property_id name createdAt price")
    .limit(parseInt(limit))
    .sort({ [sortField]: sortOrder, _id: 1 }) // Use _id for tie-breaking in the sort
    .collation({ locale: "en", strength: 2 });

  const { price, name, createdAt } = properties[properties.length - 1] || {};
  const lastFetchedPrice = price;
  const lastFetchedName = name;
  const lastFetchedCreatedAt = createdAt;
  const hasMore = !!(price || name || createdAt);

  return res.status(200).send({
    data: {
      items: properties,
      ...(sort === "price" && { lastPrice: lastFetchedPrice }),
      ...(sort === "name"
        ? { lastName: lastFetchedName }
        : { lastCreatedAt: lastFetchedCreatedAt }),
      hasMore,
    },
  });
};

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getMyProperties = async function (req, res) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(400).send({ message: "Invalid request missing user id" });
  }
  try {
    const properties = await Property.find({ user_id });
    return res.status(200).send({
      data: properties,
    });
  } catch (error) {
    console.error("\n", error);
    return res.status(500).send({ message: "Error: Something went wrong" });
  }
};
