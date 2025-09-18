import React, { useEffect, useState } from "react";
import "./profile.scss";
import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import MySongs from "../../components/Profile/MySongs";
import MyPlaylists from "../../components/Profile/MyPlaylists";
import FavPlaylists from "../../components/Profile/FavPlaylists";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function Profile() {

  const [user, setUser] = useState({ favouritePlaylists: []});
  const [selected, setSelected] = useState("mySongs");
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        console.log(response.data);
        setUser(response.data.user);
      } catch (err) {
        console.log(err);
        navigate("/404")
      }
    }
    getUser()
  }, [id]);

  return (
    <div className="page profile pageContent">
      <Helmet>
        <title>Profil | Repertorify</title>
        <meta
          name="description"
          content="Repertorify profil"
        />
        <meta property="og:title" content="Profil | Repertorify" />
        <meta
          property="og:description"
          content="Repertorify profil"
        />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <ProfileHeader setUser={setUser} user={user} />
      <div className="profileMain">
        <nav className="profileNav">
          <ul>
            <li onClick={() => setSelected("mySongs")} className={selected === "mySongs" ? "active" : ""}>
              <p>Songs</p> </li>
            <li onClick={() => setSelected("myPlaylists")} className={selected === "myPlaylists" ? "active" : ""}><p>Playlists</p></li>
            {id === localStorage.getItem("userid") && <>
              <li onClick={() => setSelected("favPlaylists")} className={selected === "favPlaylists" ? "active" : ""}><p>Favourites</p></li>
            </>}
          </ul>
        </nav>
        {selected === "mySongs" && <MySongs userId={id} />}
        {selected === "myPlaylists" && <MyPlaylists userId={id} />}
        {id == localStorage.getItem("userid") && selected === "favPlaylists" && <FavPlaylists user={user} />}
        </div>
    </div>
  );
}
