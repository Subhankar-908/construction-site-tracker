require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/materials", require("./routes/materials"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/audit", require("./routes/audit"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || (err.name === "ValidationError" || err.name === "CastError" ? 400 : 500);
  res.status(status).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((e) => { console.error("Failed to start:", e.message); process.exit(1); });
