import { User } from "../models/user.js";

/**
 * @typedef {Object} Activity
 * @property {string} action - The action taken (e.g., "ENQUIRY_NEW", "ENQUIRY_DELETE", etc).
 * @property {string} description - A description of the activity.
 * @property {string} [property_id] - The ID of the Property.
 * @property {string} [enquiry_id] - The ID of the Enquiry.
 */

/**
 * @typedef {Object} User
 * @property {string} user_id
 * @property {string} fullName
 * @property {string} email
 * @property {Array} [properties]
 * @property {Array} [activities]
 * @property {Array} [notifications]
 */

/**
 * @param {Activity} activity
 * @param {User} user
 * @returns {Activity}
 */
export const addActivity = function (user, activity) {
  if (!user) {
    throw new Error("Error: User not found");
  }
  try {
    // We check users activities to prevent from exceeding the limit
    if (user.activities.length >= (Number(process.env.USER_ACTIVITIES_MAX) || 20)) {
      user.activities.pop();
    }
    user.activities.unshift(activity);

    return activity;
  } catch (error) {
    console.error(error);
    return error;
  }
};
