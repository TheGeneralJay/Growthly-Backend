const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const loanBoardModel = require("../models/loanBoardModel");
const currentLoanModel = require("../models/currentLoanModel");
const pastLoanModel = require("../models/pastLoanModel");
const uri = "mongodb+srv://jayadmin:hiHf7f1KOFIzJT4V@users.ai1y6.mongodb.net/";

module.exports = {
  MongoClient,
  mongoose,
  userModel,
  loanBoardModel,
  currentLoanModel,
  pastLoanModel,
  uri,
};
