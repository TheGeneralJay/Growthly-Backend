const express = require("express");
const db = require("./custom_modules/database/dbConnection.js");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  const origin = "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(express.json());

// Endpoints.
const userPath = "/api/v1/users";
const loginPath = "/api/v1/login";
const lenderLoanPath = "/api/v1/lender/loan";
const borrowerLoanPath = "/api/v1/borrower/loan";
const pastLoanPath = "/api/v1/loans/past";

// Routes.
const userRoutes = require("./custom_modules/routes/userRoutes.js");
const loginRoutes = require("./custom_modules/routes/loginRoutes.js");
const lenderLoanRoutes = require("./custom_modules/routes/lenderLoanRoutes.js");
const borrowerLoanRoutes = require("./custom_modules/routes/currentLoanRoutes.js");
const pastLoanRoutes = require("./custom_modules/routes/pastLoanRoutes.js");

// Application.
app.use(userPath, userRoutes);
app.use(loginPath, loginRoutes);
app.use(lenderLoanPath, lenderLoanRoutes);
app.use(borrowerLoanPath, borrowerLoanRoutes);
app.use(pastLoanPath, pastLoanRoutes);

app.listen(port, () => {
  db.connectToMongo();
  console.log("-------------------------------------------");
  console.log(`INFO: App listening at port ${port}.`);
  console.log("-------------------------------------------");
});
