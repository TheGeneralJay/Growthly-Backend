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
  mongoose.connect(
    "mongodb+srv://jayadmin:hiHf7f1KOFIzJT4V@users.ai1y6.mongodb.net/"
  );

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
