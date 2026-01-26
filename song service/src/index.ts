import { configDotenv } from "dotenv";
import express from "express";
import songRoutes from "./routes.js";
import redis from "redis";
import cors from 'cors'
configDotenv();

export const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-19364.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 19364,
  },
});

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use("/api/v1", songRoutes);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
