const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Endpoints.
const userPath = "/api/v1/users";

// Routes.
const userRoutes = require("./custom_modules/routes/userRoutes.js");

// Application.
app.use(userPath, userRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}${userPath}`);
});
