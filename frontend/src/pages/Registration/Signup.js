import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./registration.scss";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="registration page pageContent">
      <div className="formDiv">
        <FontAwesomeIcon className="icon" icon={faUser} />
        <form onSubmit={(e) => {e.preventDefault();}}>
          <div className="header">
            <h1>Sign up</h1>
            <Link to="/login" className="link">Log in</Link>
          </div>
          <div className="input">
            <label htmlFor="username">Username/Email</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className="input">
            <label htmlFor="repeatpassword">Repeat Password</label>
            <input type="password" id="repeatpassword" name="repeatpassword" />
          </div>
          <p className="terms"> <input type="checkbox" id="checkbox" /> <label htmlFor="checkbox">I agree to <span className="blue link">Teams of Use</span>  and <span className="blue link">Privacy Policy</span></label> </p>
          <button className="formBtn">Sign up</button> 
        </form>
      </div>
    </div>
  );
}
