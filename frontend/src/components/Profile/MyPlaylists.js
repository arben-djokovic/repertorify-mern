import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import { Link } from "react-router-dom";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import api from "../../api/api";

export default function MyPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try{
      const response = await api.get("/playlists/my");
      if(response.data.success){
        setPlaylists(response.data.playlists)
        console.log(response.data.playlists)
      }
    }catch(err){
      console.log(err)
    }
  }
  
  useEffect(() => {
    fetchPlaylists()
  }, [])
  return (
    <section className="myPlaylists">
      <div className="list">
        {playlists.length > 0 && <Link to={"/create-playlist"} className="addItemBtn">
          <img src="/assets/plus.png" alt="" />
        </Link>}
        {playlists.length > 0 ? playlists.map((playlist, i) => (
          <PlaylistItem playlist={playlist} isMine={true} className={i} key={i} i={i} />
        )) : <p className="noPlaylists">No playlists found - <Link to={"/create-playlist"} className="link linkcolor">Create a playlist</Link></p>}
      </div>
    </section>
  );
}
