import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import pkg from "../package.json";
import { authJwt } from "./middlewares";

import quizRoutes from "./routes/quiz.routes";
import authRoutes from "./routes/auth.routes";
import resultRoutes from "./routes/result.routes";

const app = express();

app.set("pkg", pkg);
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Middlewares
const corsOptions = {
  // origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quiz", authJwt.verifyToken, quizRoutes);
app.use("/api/v1/result", authJwt.verifyToken, resultRoutes);

export default app;
