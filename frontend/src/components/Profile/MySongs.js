import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import SongItem from "../SongItem/SongItem";
import { Link } from "react-router-dom";
import api from "../../api/api";
import useToken from "../../controllers/TokenController";
import AreYouSure from "../AreYouSure/AreYouSure";

export default function MySongs({userId}) {
  const [songs, setSongs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useToken();

  const fetchSongs = async () => {
    try {
      const respone = await api.get("/songs/user/" + userId);
      console.log(respone.data);
      setSongs(respone.data.songs);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAllSongsFromUser = async () => {
    try {
      const response = await api.delete("/songs/user/" + userId);
      if (response.data.success) {
        setIsModalOpen(false);
        fetchSongs();
      }
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
      {songs.length > 0 && userId == localStorage.getItem("userid") ? <Link to={"/add-song"} className="addItemBtn addItemBtnSong">
            <img src="/assets/plus.png" alt="" />
        </Link> : (isAdmin() && <div>
            <button onClick={() => setIsModalOpen(true)} className="deleteBtn">Delete all songs from this user</button>
          </div>)}
        {songs.length > 0 ? songs.map((song, i) => (
          <SongItem song={song} key={i} i={i} />
        )) : <p>No songs found</p>}
      </div>

      {isModalOpen && <AreYouSure setModalOpen={setIsModalOpen} onYes={deleteAllSongsFromUser}/>}
    </section>
  );
}