import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import "./registration.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { setFavourites } from "../../redux/favourites";
import useToken from "../../controllers/TokenController";


export default function Login() {
  const { login } = useToken()
  const navigate = useNavigate()
  const formRef = useRef();
  const dispatch = useDispatch();

  const logIn = async() => {
    const data = new FormData(formRef.current);
    const username = data.get("username");
    const password = data.get("password");

    if(!username || !password || username.length < 3 || username.length > 20 || password.length < 5 || password.length > 20) return toast.error("Wrong username or password not")
    try{
      const response = await api.post('/login', {username, password})
      console.log(response)
      if(response.data.success) {
        dispatch(setFavourites(response.data.favouritePlaylists || []))
        login(response.data.accessToken, response.data.numberOfSongs, response.data.numberOfPlaylists)
        navigate("/")
      }else{
        toast.error("Wrong username or password")
      }
    }catch(err){
      console.log(err)
      toast.error("Something went wrong")
    }
  };
  return (
    <div className="registration page pageContent">
      <div className="formDiv">
        <FontAwesomeIcon className="icon" icon={faUser} />
        <form ref={formRef} onSubmit={(e) => {e.preventDefault();}}>
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
