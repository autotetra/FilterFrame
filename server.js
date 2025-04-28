const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const frontendRoutes = require("./routes/frontendRoutes");

dotenv.config();
connectDB();

const app = express();

// Allow requests from frontend (port 5500)

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"], // <-- Add both
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/frontend", frontendRoutes);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
