const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone_number: String,
  street_address: String,
  email: String,
  email_verified: Boolean,
  username: String,
  password: String,
  user_type: String, // enum -- lender/borrower
  payment_id: String,
  past_loans: String, // Placeholder - to be its own class.
  current_loans: String, // Placeholder - to be its own class.
  last_credit_score: Number,
  user_banned: Boolean,
  user_banned_until: Date,
  insurance_number: String, // To have its own DB as well.
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
