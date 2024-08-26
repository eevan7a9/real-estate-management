import { Activity } from "../models/activity.js";

/**
 * @typedef {Object} Activity
 * @property {string} action - The action taken (e.g., "ENQUIRY_NEW", "ENQUIRY_DELETE", etc).
 * @property {string} description - A description of the activity.
 * @property {string} user_id - The ID of the user who performed the activity.
 * @property {string} [property_id] - The ID of the user who performed the activity.
 * @property {string} [enquiry_id] - The ID of the user who performed the activity.
 *
 * @param {Activity} activity
 * @returns {Promise<Activity|null>}
 */
export const createActivity = async function (activity) {
  try {
    const newActivity = new Activity(activity);
    await newActivity.save();
    // console.log("\nHas Created Activity \n")
    return newActivity;
  } catch (error) {
    console.error(error);
    return error;
  }
};
