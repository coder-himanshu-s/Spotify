import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

 export const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "Spotify",
        });
        console.log("Connected to DB")
    } catch (error) {
        console.log(error);
    }
}