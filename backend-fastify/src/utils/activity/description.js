/**
 * @typedef {Object} Property
 * @property {string} property_id - unique identifier
 * @property {string} name - The action taken (e.g., "ENQUIRY_NEW", "ENQUIRY_DELETE", etc).
 * @property {string} description - A description of the activity.
 * @property {string} type - A type of property (eg. land, commercial)
 * @property {string} transactionType - for Sale or Rent
 * @property {string} price - property price
 * @property {string} currency - currency used for value
 */

/**
 * @typedef {Object} Enquiry
 * @property {string} enquiry_id - unique identifier
 * @property {string} content - the content
 * @property {string} email - email of the user who will received the Enquiry
 * @property {string} title - A title
 * @property {string} topic - the Enquiry topic
 * @property {Partial<Property>} property - property being enquired
 */

/**
 * @param {string} currency
 * @param {number} price
 * @param {string} transactionType
 * @returns {string}
 */
const propertyPrice = function (
  currency,
  price,
  transactionType,
  paymentFrequency
) {
  return `for ${transactionType} at ${currency} ${price}${
    transactionType === "sale" ? "." : " [" + paymentFrequency + "]"
  }`;
};

/**
 *
 * @param {string} name
 * @return {string}
 */
const propertyName = function (name) {
  return name.length > 10 ? name.slice(0, 10) + "..." : name;
};
/**
 * Description for creating Property
 * @param {Property} property
 * @returns {string}
 */
export const propertyDescriptionCreate = function (property) {
  const { name, transactionType, price, paymentFrequency, currency } = property;
  return `Created a Property named [${propertyName(name)}] ${propertyPrice(
    currency,
    price,
    transactionType,
    paymentFrequency
  )}`;
};

/**
 * Description for deleting Property
 * @param {Property} property
 * @returns {string}
 */
export const propertyDescriptionDelete = function (property) {
  const { transactionType, name } = property;
  return `Deleted a Property listed for ${transactionType} named [${propertyName(
    name
  )}].`;
};

/**
 * Description for updating Property
 * @param {Property} property
 * @returns {string}
 */
export const propertyDescriptionUpdate = function (property) {
  const { name, transactionType, price, paymentFrequency, currency } = property;
  return `Updated a Property listed for ${transactionType} named [${propertyName(
    name
  )}] ${propertyPrice(currency, price, transactionType, paymentFrequency)}.`;
};

/**
 * @param {Enquiry} enquiry
 */
export const enquiryDescriptionCreate = function (enquiry) {
  const { topic, property } = enquiry;
  return `Enquiry sent to property [${
    property.name ? propertyName(property.name) : property.property_id
  }] regarding a topic about ${topic}.`;
};

/**
 * @param {Enquiry} enquiry
 */
export const enquiryDescriptionDelete = function (enquiry) {
  const { topic, property } = enquiry;
  return `Deleted a Enquiry that was sent to property [${
    property.name ? propertyName(property.name) : property.property_id
  }] regarding a topic about ${topic}.`;
};
