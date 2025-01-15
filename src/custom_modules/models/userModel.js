const mongoose = require("mongoose");

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
  user_type: String, // enum -- lender/borrower
  sin_number: String, // To have it's own DB.
  email_verified: Boolean,
  payment_id: String,
  past_loans: String, // Placeholder - to be its own class.
  current_loans: String, // Placeholder - to be its own class.
  last_credit_score: Number,
  user_banned: Boolean,
  user_banned_until: Date,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
