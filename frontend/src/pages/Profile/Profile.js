import React, { useState } from "react";
import "./profile.scss";
import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import MySongs from "../../components/Profile/MySongs";
import MyPlaylists from "../../components/Profile/MyPlaylists";
import FavPlaylists from "../../components/Profile/FavPlaylists";
import { Helmet } from "react-helmet-async";

export default function Profile() {

  const [selected, setSelected] = useState("mySongs");

  return (
    <div className="page profile pageContent">
      <Helmet>
        <title>Tvoj Profil | Repertorify</title>
        <meta
          name="description"
          content="Upravljaj svojim Repertorify profilom, uređuj plejliste i prati svoju ličnu kolekciju pjesama lako i brzo."
        />
        <meta property="og:title" content="Tvoj Profil | Repertorify" />
        <meta
          property="og:description"
          content="Upravljaj svojim Repertorify profilom, uređuj plejliste i prati svoju ličnu kolekciju pjesama lako i brzo."
        />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <ProfileHeader />
      <div className="profileMain">
        <nav className="profileNav">
          <ul>
            <li onClick={() => setSelected("mySongs")} className={selected === "mySongs" ? "active" : ""}>
              <p>My songs</p> </li>
            <li onClick={() => setSelected("myPlaylists")} className={selected === "myPlaylists" ? "active" : ""}><p>My playlists</p></li>
            <li onClick={() => setSelected("favPlaylists")} className={selected === "favPlaylists" ? "active" : ""}><p>Favourites</p></li>
          </ul>
        </nav>
        {selected === "mySongs" && <MySongs />}
        {selected === "myPlaylists" && <MyPlaylists />}
        {selected === "favPlaylists" && <FavPlaylists />}
        </div>
    </div>
  );
}
