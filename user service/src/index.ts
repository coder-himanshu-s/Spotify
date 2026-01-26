import { configDotenv } from 'dotenv';
import express from 'express';
configDotenv();
import { connectDb } from './utils/db.js';
import userRoutes from './routes.js';
import cors from 'cors';
const app = express()

app.use(express.json());
app.use(cors())
app.use("/api/v1", userRoutes);

app.get("/", (req, res) => {
    res.send(" Server is working ");
})

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
    console.log(`Server is runnig on ${PORT}`);
    connectDb();
})