import React from "react";
import "../../pages/Profile/profile.scss";
import { Link } from "react-router-dom";
import PlaylistItem from "../PlaylistItem/PlaylistItem";

export default function MyPlaylists() {
  return (
    <section className="myPlaylists">
      <div className="list">
        <Link to={"/create-playlist"} className="addItemBtn">
          <img src="/assets/plus.png" alt="" />
        </Link>
        {[1, 2, 3, 4, 5, 5 ,5 ,5,5,5,5,5].map((item, i) => (
          <PlaylistItem isMine={true} className={i} key={i} i={i} />
        ))}
      </div>
      <button className="moreBtn">
        Show more...
      </button>
    </section>
  );
}
