const mongoose = require("mongoose");
const UserTypes = require("../../utils/enums/userTypes.js");

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  street_address: String, // Maybe make it's own object for address, province, postal.
  province: String, // Maybe make it's own object for address, province, postal.
  postal_code: String, // Maybe make it's own object for address, province, postal.
  phone_number: String,
  username: String,
  user_type: { type: String, enum: UserTypes, uppercase: true },
  sin_number: String, // To have it's own DB.
  email_verified: Boolean,
  payment_id: String,
  past_loans: { type: mongoose.Schema.Types.ObjectId, ref: "PastLoan" },
  current_loans: { type: mongoose.Schema.Types.ObjectId, ref: "CurrentLoan" },
  last_credit_score: Number,
  user_banned: Boolean,
  user_banned_until: Date,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
