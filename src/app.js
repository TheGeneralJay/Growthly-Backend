const express = require("express");
const app = express();
const port = 3000;

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
