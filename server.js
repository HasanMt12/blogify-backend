import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./handlers/errorHandler.js";

// Routes
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express()
connectDB();
app.use(cors())
app.use(express.json())



app.get("/", (req, res) => {
    res.send("server id running")
})


app.use("/api/users", userRoutes);
app.use(invalidPathHandler);
app.use(errorResponserHandler);
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log(`server is running in port 5000 ${PORT}`))