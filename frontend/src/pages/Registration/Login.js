import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./registration.scss";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate()
  const logIn = () => {
    localStorage.setItem("token", "token");
    navigate("/")
  };
  return (
    <div className="registration page pageContent">
      <div className="formDiv">
        <FontAwesomeIcon className="icon" icon={faUser} />
        <form onSubmit={(e) => {e.preventDefault();}}>
          <div className="header">
            <h1>Login</h1>
            <Link to="/signup" className="link">Sign up</Link>
          </div>
          <div className="input">
            <label htmlFor="username">Username/Email</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <button onClick={logIn} className="formBtn">Log in</button>
        </form>
      </div>
    </div>
  );
}
