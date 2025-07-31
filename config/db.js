const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is not set");
    process.exit(1);
  }

  // Helps prevent operator injection in filters like Model.find({ ...userInput })
  mongoose.set("sanitizeFilter", true);

  // Enable mongoose debug logs in development if you want:
  if (process.env.MONGOOSE_DEBUG === "true") {
    mongoose.set("debug", true);
  }

  try {
    await mongoose.connect(uri, {
      // Tweak as needed for your traffic:
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // fail fast if cluster unreachable
      socketTimeoutMS: 45000, // drop slow sockets
      // The following are driver-level defaults on Atlas URIs, but fine to keep explicit:
      retryWrites: true,
      w: "majority",
    });

    isConnected = true;
    console.log("✅ MongoDB connected");

    // Helpful event listeners
    mongoose.connection.on("error", (err) => {
      console.error("🐛 MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
      isConnected = false;
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Optional: export a closer for graceful shutdown
const closeDB = async () => {
  try {
    await mongoose.connection.close(false);
    console.log("🛑 MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB:", err.message);
  }
};

module.exports = connectDB;
module.exports.closeDB = closeDB;
