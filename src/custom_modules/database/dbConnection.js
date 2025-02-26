const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const loanBoardModel = require("../models/loanBoardModel");
const currentLoanModel = require("../models/currentLoanModel");
const pastLoanModel = require("../models/pastLoanModel");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.URI;

const connectToMongo = () => {
  mongoose.connect(MONGO_URI);

  console.log("-------------------------------------------");
  console.log(`INFO: Successfully connected to MongoDB.`);
  console.log("-------------------------------------------");
};

module.exports = {
  MongoClient,
  mongoose,
  connectToMongo,
  userModel,
  loanBoardModel,
  currentLoanModel,
  pastLoanModel,
};
