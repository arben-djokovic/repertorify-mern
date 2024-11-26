import React, { useState } from "react";
import "./songItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { motion } from "framer-motion";
import { isAuthenticated } from "../../controllers/TokenController";
import { toast } from "react-toastify";
import api from "../../api/api";

export default function SongItem({ song, i }) {
  const navigate = useNavigate();
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);

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

  const deleteSong = async() => {
    try{
      const respone = await api.delete('/songs/'+song._id)
      console.log(respone)
      if(respone.data.success){
        return toast.success(respone.data.message)
      }
    }catch(err){
      console.error(err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.3 }}
      onClick={songClick}
      className={`${i % 2 === 0 ? "songitem" : "songitem2"} ${
        isEllipsisOpen ? "active " : "link"
      }`}
    >
      <p className="title">{song.title} - {song.artist}</p>
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
                <p id="ellipsisItem" className="ellipsisItem link">
                  Add to playlist
                </p>
                <p id="ellipsisItem" className="ellipsisItem link">
                  Edit
                </p>
                <p
                  id="ellipsisItem"
                  onClick={deleteSong}
                  className="ellipsisItem link delete"
                >
                  Delete
                </p>
              </Dropdown>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
