import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import SongItem from "../SongItem/SongItem";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function MySongs() {
  const [songs, setSongs] = useState([]);
  const [haveMore, setHaveMore] = useState(false);
  const [page, setPage] = useState(1);

  const fetchSongs = async () => {
    try {
      const respone = await api.get("/songs/my?page=" + page);
      console.log(respone.data);
      setSongs(respone.data.songs);
      setHaveMore(respone.data.hasMore);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [page]);

  return (
    <section className="songsHome">
      <div className="listSongs">
        {songs.length > 0 ? songs.map((song, i) => (
          <SongItem song={song} key={i} i={i} />
        )) : <p>No songs found - <Link to={"/add-song"} className="link linkcolor">Add a song</Link></p>}
      </div>
      {haveMore &&
      <button onClick={() => setPage(page + 1)} className="moreBtn">
       Show more...
      </button>
      }
    </section>
  );
}