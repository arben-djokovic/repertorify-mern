import React, { useEffect } from "react";
import "./rightSidebar.scss";
import api from '../../api/api'
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMatch } from "react-router-dom";

export default function RightSidebar() {
  const [topFivePlaylists, setTopFivePlaylists] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const location = useLocation();
  const matchSongId = useMatch("/songs/:id")
  const matchSonginPlaylistId = useMatch("/playlists/:id/songs/:id")
  let isSongView = matchSongId || matchSonginPlaylistId

  
  const getTopFive = async() => {
    try{
      const response = await api.get('/playlists/top-five');
      setTopFivePlaylists(response.data.playlists)
    }catch(err){
      console.log(err)
    }
  }

  const getTopSongs = async() => {
    try{
      const id = matchSongId ? matchSongId.params.id : matchSonginPlaylistId.params.id
      const response = await api.get(`/songs/top-five/${id}`);
      setTopSongs(response.data.songs)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    if(window.innerWidth <= 1000) return
    isSongView = matchSongId || matchSonginPlaylistId
    if(isSongView){
      getTopSongs()
    }else{
      getTopFive()
    }
  }, [location.pathname])

  return (
    <div className="rightSidebar">
      <div className="rightSidebarFilter">
        <ul className="custom-list">
          {!isSongView && topFivePlaylists.map((playlist, i) => {
            return <Link to={`/playlists/${playlist._id}`} key={i}><li className="playlist-item" key={i}>{playlist.name}</li></Link>
          })}
          {isSongView && topSongs.map((song, i) => {
            return <Link to={`/songs/${song._id}`} key={i}><li className="song-item" key={i}>{song.title}</li></Link>
          })}
        </ul>
      </div>
    </div>
  );
}
