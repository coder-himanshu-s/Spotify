import { useEffect } from "react";
import { useSongData } from "../context/SongContext";

const Player = () => {
  const {
    song,
    selectedSong,
    fetchSingleSong,
    isPlaying,
    setIsPlaying,
    prevSong,
    nextSong,
  } = useSongData();

  useEffect(()=>{
    fetchSingleSong();
  },[selectedSong])

  console.log(`song from player ${song}`)
  console.log(song?.song);
  return (
    <div>
      {song && (
        <div className="h-[10%] bg-black flex text-white px-4 justify-between items-center">
          <div className="lg:flex items-center gap-4">
            <img
              src={(song.thumbnail) ? (song?.song.thumbnail) : "/stack.png"}
              className="w-12"
              alt="This is player "
            />
            <div className="hidden md:block">
                <p>{song?.song.title}</p>
                <p>{song?.song.description?.slice(0,20)}...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
