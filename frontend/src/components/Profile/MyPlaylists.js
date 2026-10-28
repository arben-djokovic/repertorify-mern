import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import { Link } from "react-router-dom";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import { PlaylistSkeleton } from "../Skeleton/Skeleton";
import api from "../../api/api";

export default function MyPlaylists({ userId}) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = async () => {
    try{
      const response = await api.get("/playlists/user/" + userId);
      if(response.data.success){
        setPlaylists(response.data.playlists)
        console.log(response.data.playlists)
      }
    }catch(err){
      console.log(err)
    }
  }
    const fetchMyPlaylists = async () => {
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
    const load = userId == localStorage.getItem("userid") ? fetchMyPlaylists : fetchPlaylists
    load().finally(() => setLoading(false))
  }, [])
  return (
    <section className="myPlaylists">
      <div className="list">
        {loading ? <PlaylistSkeleton count={4} /> : <>
        {playlists.length > 0 && userId == localStorage.getItem("userid") && <Link to={"/create-playlist"} className="playlistItem addPlaylistTile link">
          <span className="pi-cover pi-plus">+</span>
          <span className="pi-name">New playlist</span>
        </Link>}
        {playlists.length > 0 ? playlists.map((playlist, i) => (
          <PlaylistItem playlist={playlist} isMine={true} className={i} key={i} i={i} />
        )) : <p className="noPlaylists">No playlists found</p>}
        </>}
      </div>
    </section>
  );
}
