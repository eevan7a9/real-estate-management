import dotenv from "dotenv";
import mongoose from "mongoose";
import { fastify } from '../index.js';
import { User } from "../models/user.js";
import { users } from "./dummy-data/users.js";

import { Property } from "../models/property.js";
import { properties } from "./dummy-data/properties.js";

import { Enquiry } from "../models/enquiry.js";
import { enquiries } from "./dummy-data/enquiries.js";

dotenv.config();

const seederUser = async () => {
  await User.deleteMany({});
  console.log("User document - is now empty!");

  await User.insertMany(users);
  console.log("User document - Seed Successful!");
};

const seederProperty = async () => {
  await Property.deleteMany({});
  console.log("Property document - is now empty!");

  await Property.insertMany(properties);
  console.log("Property document - Seed Successful!");
};

const seederEnquiry = async () => {
  await Enquiry.deleteMany({});
  console.log("Enquiry document - is now empty!");

  await Enquiry.insertMany(enquiries);
  console.log("Enquiry document - Seed Successful!");
};


mongoose.connect(process.env.DB_CONNECT, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(async (con) => {
  console.log("Mongo connection open for data seeding!!!");
  const db = async () => {
    /**
     * !!!WARNING!!!
     * We empty all documents & seed with dummy data
     */
    await seederUser();
    await seederProperty();
    await seederEnquiry();
    console.log("Database Seeder: Success!!!")
  };
  await db();
  await con.disconnect();
}).catch((e) => fastify.log.error(e));

mongoose.connection.on('disconnected', () => {
  console.log("Process: Exiting...")
  process.exit();
});