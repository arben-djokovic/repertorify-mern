import React, { useEffect, useState } from "react";
import "../../pages/Profile/profile.scss";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { setFavourites } from "../../redux/favourites";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function FavPlaylists({ user }) {
  return (
    <section className="myPlaylists">
      <div className="list">
        {user.favouritePlaylists.length > 0 ? user.favouritePlaylists.map((playlist, i) => (
          <PlaylistItem playlist={playlist} className={i} key={i} i={i} />
        )) : <p className="noPlaylists">{user._id !== localStorage.getItem("userid") ? "Private information" : "You don't have any favourite playlist"}</p>}
      </div>
    </section>
  );
}
