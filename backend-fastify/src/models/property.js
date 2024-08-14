import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    property_id: { type: String, required: true },
    name: { type: String, minlength: 4, required: true },
    address: { type: String, required: true },
    description: { type: String, minlength: 10 },
    type: { type: String, required: true },
    transactionType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    position: { lat: Number, lng: Number },
    price: { type: Number },
    paymentFrequency: {
      type: String,
      enum: ["yearly", "quarterly", "monthly", "bi-weekly", "weekly", "daily"],
    },
    // enquiries: { type: Array },
    features: { type: Array },
    profileImage: { type: String },
    images: { type: Array },
    currency: { type: String },
    contactNumber: { type: String },
    contactEmail: { type: String },
    user_id: { type: String },
  },
  {
    timestamps: true,
  }
);
export const Property = mongoose.model("Property", propertySchema);
