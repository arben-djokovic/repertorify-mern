import React, { useState } from "react";
import "./sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretRight,
  faList,
  faMusic,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { isAuthenticated, logout } from "../../controllers/TokenController";

export default function Sidebar() {
  let [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const navigate = useNavigate()

  const logOut = () => logout(navigate);

  return (
    <nav className="sidebar">
      <Link onClick={() => setIsEllipsisOpen(false)} to="/songs" className="navlink link">
        <FontAwesomeIcon icon={faMusic} />
        <p>Songs</p>
      </Link>

      <Link onClick={() => setIsEllipsisOpen(false)} to="/playlists" className="navlink link">
        <FontAwesomeIcon icon={faList} />
        <p>Playlists</p>
      </Link>
      {!isAuthenticated() ? <Link onClick={() => setIsEllipsisOpen(false)} to="/login" className="navlink link">
        <FontAwesomeIcon icon={faUser} />
        <p>Log in</p>
      </Link> :
      <div className="openDropdown">
        <div
          onClick={() => setIsEllipsisOpen(!isEllipsisOpen)}
          className="navlink link"
          id="dropdownLink"
        >
          <FontAwesomeIcon className="userIcon link" icon={faUser} />
          <p className="usernameCarpet link">
            <span className="username link">Lazo123</span>
            {isEllipsisOpen ? (
              <FontAwesomeIcon className="userIcon link" icon={faCaretDown} />
            ) : (
              <FontAwesomeIcon className="userIcon link" icon={faCaretRight} />
            )}
          </p>
        </div>
        <Dropdown isEllipsisOpen={isEllipsisOpen} setIsEllipsisOpen={setIsEllipsisOpen}>
            <Link to="/profile" className="ellipsisItem link">Profile</Link>
            <Link to="/add-song" className="ellipsisItem link">Add Song</Link>
            <Link to="/create-playlist" className="ellipsisItem link">Create Playlist</Link>
            <Link onClick={logOut} className="ellipsisItem link delete" >Log out</Link>
        </Dropdown>
      </div>}
    </nav>
  );
}
