import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import api from "../../api/api";

export default function FavPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try{
      const response = await api.get("/playlists/my-favourite");
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
        {playlists.length > 0 ? playlists.map((playlist, i) => (
          <PlaylistItem playlist={playlist} className={i} key={i} i={i} />
        )) : <p className="noPlaylists">You don't have any favourite playlist</p>}
      </div>
    </section>
  );
}
