const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const uri = "mongodb+srv://jayadmin:hiHf7f1KOFIzJT4V@users.ai1y6.mongodb.net/";

module.exports = { MongoClient, mongoose, userModel, uri };
