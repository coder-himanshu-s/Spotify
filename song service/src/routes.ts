import express from "express";
import {
  getAllAlbum,
  getAllSongs,
  getAllSongsOfAlbums,
  getSingleSong,
} from "./controller.js";

const router = express.Router();

router.get("/album/all", getAllAlbum);
router.get("/song/all", getAllSongs);
router.get("/album/:id", getAllSongsOfAlbums);
router.get("/song/:id", getSingleSong);

export default router;
