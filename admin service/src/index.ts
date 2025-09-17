import express from "express";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
import adminRoutes from "./routes.js";
dotenv.config();

const app = express();
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(express.json());
// /app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;

app.use("/api/v1", adminRoutes);

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title  VARCHAR(255) NOT NULL,
            description  VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

    await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title  VARCHAR(255) NOT NULL,
            description  VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255)  ,
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

    console.log("DB initialise successfully ");
  } catch (error) {
    console.log("Error in intialising the database", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
  });
});
