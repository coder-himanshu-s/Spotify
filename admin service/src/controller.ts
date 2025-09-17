import { Request } from "express";
import TryCatch from "./config/TryCatch.js";
import getBuffer from "./config/dataUri.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }

  const { title, description } = req.body;

  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "File not provided",
    });
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate file buffer",
    });
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });

  const result = await sql`
  INSERT INTO albums (title , description,thumbnail) VALUES (${title},${description},${cloud.secure_url}) RETURNING * 
  `;

  return res.json({
    success: true,
    messsage: "Album created",
    album: result[0],
  });
});

export const addSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }

  const { title, description, album } = req.body;
  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;
  if (isAlbum.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No album with the given id",
    });
  }
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "File not provided",
    });
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate file buffer",
    });
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });

  const result =
    await sql`INSERT INTO songs (title,description,audio,album_id) VALUES (${title},${description},${cloud.secure_url},${album})`;

  res.json({
    sucess: true,
    message: "Song added successfully",
  });
});

export const addThumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: " You are not admin",
    });
  }

  const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;
  if (song.length === 0) {
    return res.status(500).json({
      success: false,
      message: "No song with this id",
    });
  }

  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "File not provided",
    });
  }

  const fileBuffer = getBuffer(file);

  if (!fileBuffer || !fileBuffer.content) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate file buffer",
    });
  }

  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

  const result =
    await sql`UPDATE songs SET thumbnail = ${cloud.secure_url} where id = ${req.params.id} RETURNING * `;

  res.json({
    messaage: "thumbnail added",
    song: result[0],
  });
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }

  const { id } = req.params;

  const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (isAlbum.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No album with the given id",
    });
  }

  await sql`DELETE FROM songs WHERE album_id = ${id}`;
  await sql`DELETE FROM albums WHERE id = ${id}`;
  res.json({
    message: "Album deleted successfully",
  });
});

export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      success: false,
      message: "You are not admin",
    });
  }

  const { id } = req.params;
  const song = await sql`SELECT * FROM songs WHERE id = ${id}`;
  if (song.length === 0) {
    return res.status(500).json({
      success: false,
      message: "No song with this id",
    });
  }

  await sql`DELETE FROM songs WHERE id = ${id}`;
  res.json({
    message: "Song deleted successfully",
  });
});
