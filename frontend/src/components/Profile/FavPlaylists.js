import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { setFavourites } from "../../redux/favourites";

export default function FavPlaylists() {
  const dispatch = useDispatch()
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = async () => {
    try{
      const response = await api.get("/playlists/my-favourite");
      if(response.data.success){
        setPlaylists(response.data.playlists)
        const FavPlaylistsIds = response.data.playlists.map(playlist => playlist._id)
        setTimeout(() => {
          console.log(FavPlaylistsIds)
          dispatch(setFavourites(FavPlaylistsIds))
        }, 200);
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
