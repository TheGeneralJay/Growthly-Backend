const express = require("express");
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

// Routes.
const userRoutes = require("./custom_modules/routes/userRoutes.js");
const loginRoutes = require("./custom_modules/routes/loginRoutes.js");
const lenderLoanRoutes = require("./custom_modules/routes/lenderLoanRoutes.js");

// Application.
app.use(userPath, userRoutes);
app.use(loginPath, loginRoutes);
app.use(lenderLoanPath, lenderLoanRoutes);

app.listen(port, () => {
  console.log(`App listening at port ${port}.`);
});
