const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Syntecxhub Blog API is running",
  });
});

app.use("/api/posts", postRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});