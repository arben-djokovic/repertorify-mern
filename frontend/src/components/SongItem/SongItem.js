import React, { useEffect, useRef, useState } from "react";
import "./songItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../api/api";
import useToken from "../../controllers/TokenController";
import Modal from "../Modal/Modal";
import { get, set } from "mongoose";
import AreYouSure from "../AreYouSure/AreYouSure";

export default function SongItem({ song, i, inPlaylist, playlistUserId, playlistId }) {
  const { isAuthenticated, isAdmin, getDecodedToken } = useToken();
  const navigate = useNavigate();
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [removeFromPlaylistModal, setRemoveFromPlaylistModal] = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const songRef = useRef(null)

  const songClick = (e) => {
    if (
      e.target.id === "icon" ||
      e.target.id === "ellipsisItem" ||
      e.target.id === "ellipsisOpen" ||
      e.target.tagName === "path"
    )
      return;
    navigate("/songs/" + song._id);
  };

  const deleteSong = async () => {
    try {
      const respone = await api.delete("/songs/" + song._id);
      console.log(respone);
      if (respone.data.success) {
        if (song.user.username === localStorage.getItem("username")) {
          localStorage.setItem(
            "numberOfSongs",
            Number(localStorage.getItem("numberOfSongs")) - 1
          );
        }
        songRef.current.style.display = "none";
        return toast.success(respone.data.message);
      }
      toast.error("Something went wrong");
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };
  
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

  const removeFromPlaylist = async() => {
    try{
      const response = await api.post("/remove-from-playlist", {songId: song._id, playlistId: playlistId});
      if(response.data.success){
        toast.success(response.data.message);
        songRef.current.style.display = "none";
      }
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05, duration: 0.3 }}
        onClick={songClick}
        ref={songRef}
        className={`${i % 2 !== 0 ? "songitem" : "songitem2"} ${
          isEllipsisOpen ? "active " : "link"
        }`}
      >
        <p className="title">
          <span>{song.title}</span> <span className="line">-</span>{" "}
          <span>{song.artist}</span>{" "}
        </p>
        <div className="right">
          <p className="username">({song.user.username})</p>
          {isAuthenticated() && (
            <>
              <FontAwesomeIcon
                id="icon"
                className={`${i}`}
                onClick={(e) => setIsEllipsisOpen(!isEllipsisOpen)}
                icon={faEllipsis}
              />
              {isEllipsisOpen && (
                <Dropdown
                  i={i}
                  isEllipsisOpen={isEllipsisOpen}
                  setIsEllipsisOpen={setIsEllipsisOpen}
                >
                  <p
                    onClick={() => {
                      setAddToPlaylistOpen(true);
                    }}
                    id="ellipsisItem"
                    className="ellipsisItem link"
                  >
                    Add to playlist
                  </p>
                  { playlistUserId && inPlaylist && (isAdmin() || playlistUserId === getDecodedToken()?._id) && (
                    <p id="ellipsisItem" className="ellipsisItem link delete" onClick={()=>{setRemoveFromPlaylistModal(true)}}>Remove from playlist</p>
                  )}
                  {(isAdmin() ||
                    song.user.username ===
                      localStorage.getItem("username")) && (
                    <>
                      <Link
                        to={"/songs/" + song._id + "/edit"}
                        id="ellipsisItem"
                        className="ellipsisItem link"
                      >
                        Edit
                      </Link>
                      <p
                        id="ellipsisItem"
                        onClick={()=>{setDeleteModalOpen(true)}}
                        className="ellipsisItem link delete"
                      >
                        Delete
                      </p>
                    </>
                  )}
                </Dropdown>
              )}
            </>
          )}
        </div>
      </motion.div>
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
      {removeFromPlaylistModal && <AreYouSure onYes={removeFromPlaylist} setModalOpen={setRemoveFromPlaylistModal} />}
    </>
  );
}
