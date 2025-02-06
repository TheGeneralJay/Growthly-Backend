const mongoose = require("mongoose");
const UserTypes = require("../../utils/enums/userTypes.js");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  street_address: { type: String, required: true }, // Maybe make it's own object for address, province, postal.
  province: { type: String, required: true }, // Maybe make it's own object for address, province, postal.
  postal_code: { type: String, required: true }, // Maybe make it's own object for address, province, postal.
  phone_number: { type: String, required: true },
  username: { type: String, required: true },
  user_type: { type: String, enum: UserTypes, uppercase: true },
  sin_number: { type: String, required: true }, // To have it's own DB.
  email_verified: Boolean,
  payment_id: String,
  past_loans: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "PastLoan",
    default: [],
  },
  current_loans: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "CurrentLoan",
    default: [],
  },
  posted_loans: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Loan",
    default: [],
  },
  last_credit_score: { type: mongoose.Schema.Types.Double },
  user_banned: Boolean,
  user_banned_until: Date,
});

// Compare hashed password vs plaintext password.
// UserSchema.methods.comparePassword = async function comparePassword(pass) {
//   return bcrypt.compare(pass, this.password);
// };

const User = mongoose.model("User", UserSchema);
module.exports = User;
