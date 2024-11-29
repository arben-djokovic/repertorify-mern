import React, { useState } from "react";
import "./songItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../../api/api";
import useToken from "../../controllers/TokenController";

export default function SongItem({ song, i }) {
  const { isAuthenticated, isAdmin} = useToken()
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
        if(song.user.username === localStorage.getItem("username")){
          localStorage.setItem("numberOfSongs", Number(localStorage.getItem("numberOfSongs")) - 1);
        }
        return toast.success(respone.data.message)
      }
      toast.error('Something went wrong')
    }catch(err){
      toast.error('Something went wrong')
      console.log(err)
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
      <p className="title"><span>{song.title}</span> <span className="line">-</span> <span>{song.artist}</span> </p>
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
                {(isAdmin() || song.user.username === localStorage.getItem("username")) && (<>
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
                </>)}
              </Dropdown>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
