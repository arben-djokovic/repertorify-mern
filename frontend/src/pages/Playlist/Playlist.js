import React, { useEffect, useState } from "react";
import SongItem from "../../components/SongItem/SongItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFilePdf, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import "./playlist.scss";
import Dropdown from "../../components/Dropdown/Dropdown";
import { isAuthenticated } from "../../controllers/TokenController";
import { useParams } from "react-router-dom";
import api from "../../api/api";

export default function Playlist() {
    const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [playlist, setPlaylist] = useState({
        name: "",
        songs: [], 
        likes: 0
    })
    const { id } = useParams();

    const fetchPlaylist = async() => {
        try{
            const respone = await api.get('/playlists/'+id)
            console.log(respone)
            setPlaylist(respone.data.playlist)  
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchPlaylist()
    }, [])

  return (
    <section className="playlist page pageContent">
      <div className="icons">
        <div className="icon">
        {isLiked ? <FontAwesomeIcon onClick={() => setIsLiked(!isLiked)} id='heart' className='heart' icon={faHeart} /> :
        <FontAwesomeIcon onClick={() => setIsLiked(!isLiked)} id='heart' className='heart' icon={faRegularHeart} />}
        <p className="likes">{playlist.likes}</p>
        </div>
        <FontAwesomeIcon className="icon" icon={faFilePdf} />
        {isAuthenticated() && <>
        <FontAwesomeIcon
          id="icon"
          className="modalIcon"
          onClick={(e) => setIsEllipsisOpen(!isEllipsisOpen)}
          icon={faEllipsisV}
        />
        {isEllipsisOpen && (
          <Dropdown
            isEllipsisOpen={isEllipsisOpen}
            setIsEllipsisOpen={setIsEllipsisOpen}
          >
            <p id="ellipsisItem" className="ellipsisItem link">
              Add to playlist
            </p>
            <p id="ellipsisItem" className="ellipsisItem link">
              Edit
            </p>
            <p
              id="ellipsisItem"
              onClick={() => {
                setIsEllipsisOpen(false);
              }}
              className="ellipsisItem link delete"
            >
              Delete
            </p>
          </Dropdown>
        )}
        </>}
      </div>
      <h1 className="playlistTitle">{playlist.name}</h1>
      <div className="songsList">
        {playlist.songs.length > 0 ? playlist.songs.map((song, i) => (
          <SongItem song={song} key={i} i={i} />
        )) : <p>No songs in playlist</p>}
      </div>
    </section>
  );
}
