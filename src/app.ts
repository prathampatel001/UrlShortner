import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cors from "cors";
import authPublicRoutes from "./auth/authPublicRoutes";
import authRoutes from "./auth/authRoutes";
import { authenticateToken } from "./middlewares/auth";
import UrlRoutes from "./URL/UrlRoutes";
const app = express();
app.use(express.json());
app.use(cors());


app.get(`/test`, (req, res, next) => {
  res.json({ message: "Hello World" });
});
const basePath = "/api";
app.use(basePath,authPublicRoutes)

app.use(authenticateToken)
app.use(basePath,authRoutes)
app.use(basePath,UrlRoutes)

app.use(globalErrorHandler);

export default app;
