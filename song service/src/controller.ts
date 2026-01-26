import { sql } from "./config/db.js";
import TryCatch from "./config/TryCatch.js";
import { redisClient } from "./index.js";
export const getAllAlbum = TryCatch(async (req, res) => {
  let albums;

  const CACHE_EXPIRY = 1800;
  if (redisClient.isReady) {
    albums = await redisClient.get("albums");
  }

  if (albums) {
    console.log("Cache hit");
    return res.json(JSON.parse(albums));
  } else {
    albums = await sql`SELECT *FROM albums`;
    console.log("Cache hit");
    if (redisClient.isReady) {
      await redisClient.set("albums", JSON.stringify(albums), {
        EX: CACHE_EXPIRY,
      });
    }
  }

  res.json({
    success: true,
    albums,
  });
});

export const getAllSongs = TryCatch(async (req, res) => {
  let songs;
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    songs = await redisClient.get("songs");
  }

  if (songs) {
    console.log("Cache hit");
    return res.json(JSON.parse(songs));
  } else {
    songs = await sql`SELECT *FROM songs`;
    console.log("Cache hit");
    if (redisClient.isReady) {
      await redisClient.set("albums", JSON.stringify(songs), {
        EX: CACHE_EXPIRY,
      });
    }
  }

  res.json({
    success: true,
    songs,
  });
});

export const getAllSongsOfAlbums = TryCatch(async (req, res) => {
  const { id } = req.params;
  let album, songs;
  const CACHE_EXPIRY = 1800;

  if (redisClient.isReady) {
    const cacheData = await redisClient.get(`album_songs_${id}`);
    if (cacheData) {
      console.log("cache hit");
      return res.json(JSON.parse(cacheData));
    }
  }

  album = await sql`SELECT * FROM albums WHERE id = ${id}`;
  if (album.length === 0) {
    return res.status(404).json({
      message: "No album with this id",
    });
  }

  songs = await sql`SELECT *FROM songs WHERE album_id = ${id}`;
  const response = { songs, album: album[0] };

  if (redisClient.isReady) {
    await redisClient.set(`album_songs_${id}`, JSON.stringify(response), {
      EX: CACHE_EXPIRY, 
    });
  }
  res.json({
    success: true,
    response,
  });
});

export const getSingleSong = TryCatch(async (req, res) => {
  const song = await sql`SELECT *FROM songs WHERE id = ${req.params.id}`;

  res.json({
    success: true,
    song: song[0],
  });
});
