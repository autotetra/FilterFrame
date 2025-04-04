const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

// Route imports
const pingRoute = require("./routes/ping");

// Middleware
app.use(express.json());

// Routes
app.use("/", pingRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
