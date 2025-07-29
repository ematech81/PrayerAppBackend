require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const verseRoutes = require("./routes/verse.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/verses", verseRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (_, res) => res.send("Bible backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  Server on ${PORT}`));
