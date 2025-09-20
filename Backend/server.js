import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import analytics from "./routes/analytics.js";
dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: ["http://localhost:3000"] })); // Next dev URL
app.use(express.json());
app.get("/api/health", (_req,res)=>res.json({ok:true}));
app.use("/api", analytics);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
