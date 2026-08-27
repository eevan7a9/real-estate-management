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
    limit = 8,
    lastCreatedAt,
    lastPrice,
    lastName,
    last_id,
  } = req.query;

  const { sortOrder, sortField } = composeSort(sort);
  const rangeQuery = composeRangeQuery(sort, {
    lastCreatedAt,
    lastPrice,
    lastName,
    last_id,
  });

  const filterQuery = composeFilterQuery(filter, search);
  const query = { isActive: true, ...filterQuery, ...rangeQuery };

  const properties = await Property.find(query)
    .limit(parseInt(limit))
    .sort({ [sortField]: sortOrder, _id: sortOrder })
    .collation({ locale: "en", strength: 2 });

  const { price, name, createdAt, _id } =
    properties[properties.length - 1] || {};

  const hasMore = !!(price || name || createdAt);

  return res.status(200).send({
    data: {
      items: properties,
      lastPrice: price,
      lastName: name,
      lastCreatedAt: createdAt,
      last_id: _id,
      hasMore,
    },
  });
};

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getPropertiesMap = async function (req, res) {
  try {
    const properties = await Property.find({ isActive: true }).select({
      property_id: 1,
      name: 1,
      type: 1,
      position: 1,
    });
    return res.status(200).send({ data: properties });
  } catch (error) {
    let message = error.message || "Error: Something went wrong";
    console.error("getPropertiesMap\n", error);
    return res.status(500).send({ message });
  }
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
    console.error("getMyProperties\n", error);
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
  const validPropertyTypes = new Set(["residential", "commercial", "industrial", "land"]);
  const validTransactionTypes = new Set(["sale", "rent"]);
  if (filter) {
    const transactionType = []; // ex. transactionTypes [ 'sale' ]
    const propertyTypes = []; // ex. propertyTypes [ 'industrial', 'land' ]

    filter
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((t) => {
        if (validTransactionTypes.has(t)) transactionType.push(t);
        if (validPropertyTypes.has(t)) propertyTypes.push(t);
      });

    if (propertyTypes.length) {
      filterQuery.type = { $in: propertyTypes };
    }
    if (transactionType.length) {
      filterQuery.transactionType = { $in: transactionType };
    }
  }
  const searchText = search?.trim();
  if (searchText) {
    const escapedSearch = searchText.replace(/[.*+?^\x24{}()|[\]\\]/g, (match) => "\\" + match);
    filterQuery.$or = [
      { name: { $regex: escapedSearch, $options: "i" } }, // Case-insensitive search on name
      { address: { $regex: escapedSearch, $options: "i" } }, // Assuming there's a description field
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
  { lastCreatedAt, lastPrice, lastName, last_id } = {},
) {
  if (sort === "price" && lastPrice) {
    if (last_id) {
      return {
        $or: [
          { price: { $lt: lastPrice } },
          { price: lastPrice, _id: { $lt: last_id } },
        ],
      };
    }
    return { price: { $lt: lastPrice } };
  } else if (sort === "latest" && lastCreatedAt) {
    if (last_id) {
      return {
        $or: [
          { createdAt: { $lt: new Date(lastCreatedAt) } },
          { createdAt: new Date(lastCreatedAt), _id: { $lt: last_id } },
        ],
      };
    }
    return { createdAt: { $lt: new Date(lastCreatedAt) } };
  } else if (sort === "name" && lastName) {
    if (last_id) {
      return {
        $or: [
          { name: { $gt: lastName } },
          { name: lastName, _id: { $gt: last_id } },
        ],
      };
    }
    return { name: { $gt: lastName } };
  }

  return {};
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
