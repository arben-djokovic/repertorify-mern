import React, { useState } from "react";
import SongItem from "../../components/SongItem/SongItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFilePdf, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import "./playlist.scss";
import Dropdown from "../../components/Dropdown/Dropdown";
import { isAuthenticated } from "../../controllers/TokenController";

export default function Playlist() {
    const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
  return (
    <section className="playlist page pageContent">
      <div className="icons">
        {isLiked ? <FontAwesomeIcon onClick={() => setIsLiked(!isLiked)} id='heart' className='heart' icon={faHeart} /> :
        <FontAwesomeIcon onClick={() => setIsLiked(!isLiked)} id='heart' className='heart' icon={faRegularHeart} />}
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
      <h1 className="playlistTitle">ExYu hitovi</h1>
      <div className="songsList">
        {[
          1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
          11,
        ].map((song, i) => (
          <SongItem song={song} key={i} i={i} />
        ))}
      </div>
      <button to="/songs" className="moreBtn">Show more...</button>
    </section>
  );
}
