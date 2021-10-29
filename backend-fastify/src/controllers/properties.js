import { properties } from "../dummy-data/properties.js";

export const getProperties = function (_, res) {
  res.status(200).send(properties);
};

export const getProperty = function (req, res) {
  const findProperty = properties.find(
    (property) => property.id == req.params.id
  );
  if (findProperty) {
    res.status(200).send(findProperty);
  }
};
