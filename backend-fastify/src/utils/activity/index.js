import { ActivityType } from "../../enums/activity.js";

import {
  enquiryDescriptionCreate,
  enquiryDescriptionDelete,
  propertyDescriptionCreate,
  propertyDescriptionDelete,
  propertyDescriptionUpdate,
} from "./description.js";

/**
 * @typedef {Object} User
 * @property {string} fullName - name
 * @property {string} email - email of the user who will received the Enquiry
 */

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
 *
 * @param {string} action
 * @param {Enquiry} enquiry
 * @returns {string}
 */
export const activityEnquiryDescription = function (action, enquiry) {
  switch (action) {
    case ActivityType.enquiry.new:
      return enquiryDescriptionCreate(enquiry);

    case ActivityType.enquiry.delete:
      return enquiryDescriptionDelete(enquiry);

    default:
      break;
  }
  return msg;
};

/**
 *
 * @param {string} action
 * @param {Property} property
 * @returns {string}
 */
export const activityPropertyDescription = function (
  action,
  property = {
    name: "",
    transactionType: "sale",
    price: 0,
    paymentFrequency: "",
    currency: "",
  }
) {
  switch (action) {
    case ActivityType.property.new:
      return propertyDescriptionCreate(property);

    case ActivityType.property.delete:
      return propertyDescriptionDelete(property);

    case ActivityType.property.update:
      return propertyDescriptionUpdate(property);
    default:
      break;
  }
  return msg;
};

/**
 * 
 * @param {User} user 
 * @returns {string}
 */
export const activitySigninDescription = function(user) {
  return `User ${user.email} signed in.`
}