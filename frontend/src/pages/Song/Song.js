import React, { useEffect, useState } from "react";
import "./song.scss";
import {
    faArrowLeft,
    faArrowRight,
  faEllipsisV,
  faFilePdf,
  faMinus,
  faPlus,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../../components/Dropdown/Dropdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import useToken from "../../controllers/TokenController";
import Modal from "../../components/Modal/Modal";
import AreYouSure from "../../components/AreYouSure/AreYouSure";

export default function Song() {
  const { isAuthenticated, isAdmin } = useToken()
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const navigate = useNavigate()
  const {id} = useParams()
  let [song, setSong] = useState({
    title: "Loading...",
    text: "Loading...",
    artist: "Loading...",
  });
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [removeFromPlaylistModal, setRemoveFromPlaylistModal] = useState(false);

  const fetchSong = async() => {
    try{
      const respone = await api.get('/songs/'+id)
      console.log(respone)
      if(!respone.data.success) return navigate('/songs')
      setSong(respone.data.song)
    }catch(err){
      toast.error('Something went wrong')
      console.log(err)
    }
  }

  const deleteSong = async() => {
    try{
      const respone = await api.delete('/songs/'+id)
      console.log(respone)
      if(respone.data.success){
        if(song.user.username === localStorage.getItem("username")){
          localStorage.setItem("numberOfSongs", Number(localStorage.getItem("numberOfSongs")) - 1);
        }
      }
    }catch(err){
      toast.error('Something went wrong')
      console.log(err)
    }
  }

  const selectPlaylist = (e) => {
    const newPlaylists = [...selectedPlaylists];
    if (e.target.checked) {
      if (!newPlaylists.includes(e.target.name)) {
        newPlaylists.push(e.target.name);
      }
    } else {
      const index = newPlaylists.indexOf(e.target.name);
      if (index > -1) {
        newPlaylists.splice(index, 1);
      }
    }
    setSelectedPlaylists(newPlaylists);
    console.log(newPlaylists);
  };


  const addSongToPlaylists = async () => {
    try{
      const response = await api.post("/add-to-playlist", {songId: song._id, playlistIds: selectedPlaylists});
      if(response.data.success){
        toast.success(response.data.message);
        setAddToPlaylistOpen(false);
        setTimeout(() => {
          fetchPlaylists();
        }, 100);
      }
      console.log(response)
    }catch(err){
      console.log(err)
    }
  }

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/playlists/my");
      console.log(response);
      if (response.data.success) {
        setPlaylists(response.data.playlists);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (playlists.length == 0 && addToPlaylistOpen) {
      fetchPlaylists();
    }
  }, [addToPlaylistOpen]);
  useEffect(() => {
    fetchSong()
  }, [])

  return (<>
    <div className="song page pageContent">
      <div className="icons">
        <FontAwesomeIcon className="icon" icon={faFilePdf} />
        {isAuthenticated() && (
          <>
            <FontAwesomeIcon
              id="icon"
              onClick={(e) => setIsEllipsisOpen(!isEllipsisOpen)}
              icon={faEllipsisV}
            />
            {isEllipsisOpen && (
              <Dropdown
                isEllipsisOpen={isEllipsisOpen}
                setIsEllipsisOpen={setIsEllipsisOpen}
              >
                <p onClick={() => setAddToPlaylistOpen(true)} id="ellipsisItem" className="ellipsisItem link">
                  Add to playlist
                </p>
                {(isAdmin() || song.user.username === localStorage.getItem("username")) && (<>
                <Link to={`/songs/${id}/edit`} id="ellipsisItem" className="ellipsisItem link">
                  Edit
                </Link>
                <p
                  id="ellipsisItem"
                  onClick={()=>{setDeleteModalOpen(true)}}
                  className="ellipsisItem link delete"
                >
                  Delete
                </p>
                </>)}
              </Dropdown>
            )}
          </>
        )}
      </div>
      <div className="songInfo">
        <h1 className="title">{song.title}</h1>
        <p>{song.artist}</p>
        <div className="songsBtns">
          <button>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p>0</p>
          <button>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <pre className="text">{song.text}</pre>
        <div className="arrows">
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowLeft} />
          <FontAwesomeIcon className="shuffle link" icon={faShuffle} />
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowRight} />
        </div>
      </div>
    </div>
    {addToPlaylistOpen && (
        <Modal setModalOpen={setAddToPlaylistOpen}>
          <div className="modalSong">
            <div className="inputs">
              {playlists.length === 0 && <p>No playlists found</p>}
              {playlists.length > 0 && playlists.map((playlist, i) => {
                let songIds = playlist.songs.map(song => song._id);
                if(songIds.includes(song._id)) {
                  return(
                    <div key={i} className="input">
                      <input disabled checked type="checkbox" name={playlist._id} id={i} />
                      <label htmlFor={i}>{playlist.name}</label>
                    </div>
                  )
                }
                return(
                <div key={i} className="input">
                  <input onChange={selectPlaylist} type="checkbox" name={playlist._id} id={i} />
                  <label htmlFor={i}>{playlist.name}</label>
                </div>
              )})}
            </div>
            <button onClick={addSongToPlaylists} className="addBtn">Add to playlist</button>
          </div>
        </Modal>
      )}
      {deleteModalOpen && <AreYouSure onYes={deleteSong} setModalOpen={setDeleteModalOpen} />}    
    </>
  );
}
