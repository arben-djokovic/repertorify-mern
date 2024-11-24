import React from "react";
import "../../pages/Profile/profile.scss";
import PlaylistItem from "../PlaylistItem/PlaylistItem";

export default function FavPlaylists() {
  return (
    <section className="myPlaylists">
      <div className="list">
        {[1, 2, 3, 4, 5, 5 ,5 ,5,5,5,5,5,5].map((item, i) => (
          <PlaylistItem className={i} key={i} i={i} />
        ))}
      </div>
      <button className="moreBtn">
        Show more...
      </button>
    </section>
  );
}
