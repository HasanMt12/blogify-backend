import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./handlers/errorHandler.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import blogCategoriesRoutes from "./routes/BlogCategoriesRoutes.js";

dotenv.config();
const app = express()
connectDB();

app.use(cors())
app.use(express.json())

const { url } = import.meta;
const __dirname = path.dirname(url);


app.get("/", (req, res) => {
    res.send("server id running")
})


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post-categories", blogCategoriesRoutes);

// static assets
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/uploads", (req, res, next) => {
  console.log("Received request for:", path.join("/uploads", req.url));
  next();
}, express.static("uploads"));

app.use(cors({
  origin: 'https://mind-space02.netlify.app',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log(`server is running in port 5000 ${PORT}`))