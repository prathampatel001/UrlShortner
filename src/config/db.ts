import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  let startTime = new Date();
  try {
    mongoose.connection.on("connected", () => {
      let endTime = new Date();
      console.log(
        `Connected to database successfully in ${Number(
          (endTime?.getTime() - startTime.getTime()) / 1000
        ).toFixed(2)} seconds`
      );
    });
    mongoose.connection.on("error", (er) => {
      console.log("Error in connecting to database.", er);
    });
    await mongoose.connect(config.get("mongooseConnection"));
  } catch (error) {
    console.log("Failed to connect to database", error);
    process.exit();
  }
};

export default connectDB;
