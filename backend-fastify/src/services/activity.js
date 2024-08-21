import { Activity } from "../models/activity.js";

/**
 *
 * @param {string} user_id
 * @param {string} action
 * @param {string} description
 * @returns {Activity}
 */
export const createActivity = async function (user_id, action, description) {
  try {
    const activity = new Activity({ user_id, action, description });
    await activity.save();
    return activity;
  } catch (error) {
    console.error(error);
  }
};
