import { Property } from "../../models/property.js";

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getProperties = async function (req, res) {
  const {
    search = "",
    filter = "",
    sort = "latest",
    limit = 4,
    lastCreatedAt,
    lastPrice,
    lastName,
  } = req.query;

  const { sortOrder, sortField } = composeSort(sort);
  const rangeQuery = composeRangeQuery(sort, {
    lastCreatedAt,
    lastPrice,
    lastName,
  });
  const filterQuery = composeFilterQuery(filter, search);
  const query = { ...filterQuery, ...rangeQuery };

  const properties = await Property.find(query)
    // .select("property_id name createdAt price type transactionType")
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

/**
 *
 * @param {string} filter
 * @returns {object}
 */
const composeFilterQuery = function (filter, search) {
  const filterQuery = {};
  if (filter) {
    const transactionTypes = [];
    const propertyTypes = [];

    filter
      .split(",")
      .forEach((t) =>
        t === "sale" || t === "rent"
          ? transactionTypes.push(t)
          : propertyTypes.push(t)
      );
    if (propertyTypes.length) {
      filterQuery.type = { $in: propertyTypes };
    }
    if (transactionTypes.length) {
      filterQuery.transactionTypes = { $in: transactionTypes };
    }
  }
  if(search) {
    filterQuery.$or = [
      { name: { $regex: search, $options: "i" } }, // Case-insensitive search on name
      { address: { $regex: search, $options: "i" } }, // Assuming there's a description field
    ];
  }
  return filterQuery;
};

/**
 *
 * @param {string} sort
 * @param {object} param2
 * @returns {object}
 */
const composeRangeQuery = function (
  sort,
  { lastCreatedAt, lastPrice, lastName } = {}
) {
  if (sort === "price" && lastPrice && lastCreatedAt) {
    return {
      price: { $lte: lastPrice },
      createdAt: { $ne: new Date(lastCreatedAt) },
    };
  } else if (sort === "latest" && lastCreatedAt) {
    return { createdAt: { $lt: new Date(lastCreatedAt) } };
  } else if (sort === "name" && lastName) {
    return { name: { $gt: lastName } };
  }
};

/**
 *
 * @param {string} sort
 * @returns {object}
 */
const composeSort = function (sort) {
  switch (sort) {
    case "name":
      return { sortField: "name", sortOrder: 1 };
    case "price":
      return { sortField: "price", sortOrder: -1 };
    default:
      return { sortField: "createdAt", sortOrder: -1 };
  }
};