// console.log("🟢 Server file loaded!");

// 1. Import required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// import routes for user auth
const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");

// 2. Load .env variables
dotenv.config();

// 3. Initialize app
const app = express();

// 4. Add middleware
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());
// mount the route user auth API
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);

// 5. Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 6. Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
