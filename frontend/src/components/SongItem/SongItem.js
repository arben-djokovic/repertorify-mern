import React, { useState } from "react";
import "./songItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { motion } from "framer-motion";
import { isAuthenticated } from "../../controllers/TokenController";

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
    navigate("/songs/" + i);
  };

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
      <p className="title">Golub - Perper</p>
      <div className="right">
        <p className="username">(lazo123)</p>
        {isAuthenticated() && (
          <>
            <FontAwesomeIcon
              id="icon"
              onClick={(e) => setIsEllipsisOpen(!isEllipsisOpen)}
              icon={faEllipsis}
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
          </>
        )}
      </div>
    </motion.div>
  );
}
