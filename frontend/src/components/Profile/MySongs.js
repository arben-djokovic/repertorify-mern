import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import SongItem from "../SongItem/SongItem";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function MySongs() {
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const respone = await api.get("/songs/my");
      console.log(respone.data);
      setSongs(respone.data.songs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <section className="songsHome">
      <div className="listSongs">
      {songs.length > 0 && <Link to={"/add-song"} className="addItemBtn addItemBtnSong">
            <img src="/assets/plus.png" alt="" />
        </Link>}
        {songs.length > 0 ? songs.map((song, i) => (
          <SongItem song={song} key={i} i={i} />
        )) : <p>No songs found - <Link to={"/add-song"} className="link linkcolor">Add a song</Link></p>}
      </div>
    </section>
  );
}