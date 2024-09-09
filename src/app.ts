import express, { Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cors from "cors";
import authPublicRoutes from "./auth/authPublicRoutes";
import authRoutes from "./auth/authRoutes";
import { authenticateToken } from "./middlewares/auth";
import UrlRoutes from "./URL/UrlRoutes";
import sessionRoutes from "./session/sessionRoutes";
import analyticsRoutes from "./analytics/analyticsRoutes";
import { Url } from "./URL/UrlModel";
import { appendQueryParamsToUrl } from "./middlewares/helper";
import { redirectToWebsite } from "./URL/UrlController";
const app = express();
app.use(express.json());
app.use(cors());


app.get(`/test`, (req, res, next) => {
  res.json({ message: "Hello World" });
});
const basePath = "/api";

app.get("/:shortCode",redirectToWebsite)

app.use(basePath,authPublicRoutes)

app.use(authenticateToken)
app.use(basePath,authRoutes)
app.use(basePath,UrlRoutes)
app.use(basePath,sessionRoutes)
app.use(basePath,analyticsRoutes)


app.use(globalErrorHandler);

export default app;
