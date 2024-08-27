import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";
interface ErrorWithStatusCode extends Error {
    statusCode?: number;
  }
const globalErrorHandler = (err:ErrorWithStatusCode, req:Request, res:Response, next:NextFunction) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    code: statusCode,
    success: false,
    errorStack: config.get("env") === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;
