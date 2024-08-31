import { ActivityType } from "../enums/activity.js";
import { User } from "../models/user.js";

/**
 * @typedef {Object} Activity
 * @property {string} action - The action taken (e.g., "ENQUIRY_NEW", "ENQUIRY_DELETE", etc).
 * @property {string} description - A description of the activity.
 * @property {string} user_id - The ID of the user who performed the activity.
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
 */

/**
 * @param {Activity} activity
 * @param {Array} properties
 */
function updateUserProperties(activity, properties) {
  if (!activity.property_id) {
    throw new Error("Error: Missing property_id for updating User properties.");
  }
  switch (activity.action) {
    case ActivityType.property.new:
      properties.push(activity.property_id);
      return properties;

    case ActivityType.property.delete:
      properties = properties.filter((i) => i !== activity.property_id);
      return properties;

    default:
      break;
  }
}

/**
 * @param {Activity} activity
 * @returns {Promise<Activity|null>}
 */
export const createActivity = async function (activity) {
  try {
    const user = await User.findOne({ user_id: activity.user_id });

    if (!user) {
      throw new Error("Error: User not found");
    }
    // If Action is about properties
    if (
      activity.action === ActivityType.property.delete ||
      activity.action === ActivityType.property.new
    ) {
      // Update users properties
      user.properties = updateUserProperties(activity, user.properties || []);
    }
    // We check users activities to prevent from exceeding the limit
    if (user.activities.length >= (process.env.USER_ACTIVITIES_MAX || 20)) {
      user.activities.pop();
    }
    user.activities.unshift(activity);
    await user.save();
  
    return activity;
  } catch (error) {
    console.error(error);
    return error;
  }
};
