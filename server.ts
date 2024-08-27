import { config } from "./src/config/config";
import connectDB from "./src/config/db";
import app from "./src/app";

const startServer = async (): Promise<void> => {
  await connectDB();
  const port = config.get("port") || 8081;
  app.listen(port, () => {
    console.log(`server is running on => http://localhost:${port}`);
  });
};

startServer();
