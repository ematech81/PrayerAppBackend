require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const connectDB = require("./config/db");

const verseRoutes = require("./routes/verse.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

// If you deploy behind a proxy/load balancer (Render, Vercel, Railway, Nginx, etc)
app.set("trust proxy", 1);

// --- DB ---
connectDB();

// --- Middlewares (global) ---
app.use(helmet()); // security headers
app.use(compression()); // gzip responses
app.use(express.json({ limit: "100kb" })); // avoid large JSON payloads

// CORS: allow only your frontend origin(s) if known
const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));

// Request logging (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// --- Routes ---
app.get("/healthz", (_, res) => res.status(200).json({ status: "ok" })); // liveness
app.get("/readyz", (_, res) => res.status(200).json({ ready: true })); // readiness

app.get("/", (_, res) => res.send("Bible backend running"));

app.use("/api/verses", verseRoutes);
app.use("/api/comments", commentRoutes);

// 404 handler (after routes)
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// --- Start server & graceful shutdown ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server on ${PORT} (${process.env.NODE_ENV || "dev"})`);
});

const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed");
    // If you export mongoose connection in connectDB, close here
    // e.g., mongoose.connection.close(false, () => process.exit(0));
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Centralized error handler (last)
app.use((err, req, res, next) => {
  console.error(err);
  // If an error already has a status (e.g., from validators), keep it
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ error: message });
});

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const verseRoutes = require("./routes/verse.routes");
// const commentRoutes = require("./routes/comment.routes");

// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());

// // mount routes
// app.use("/api/verses", verseRoutes);
// app.use("/api/comments", commentRoutes);

// app.get("/", (_, res) => res.send("Bible backend running"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀  Server on ${PORT}`));
