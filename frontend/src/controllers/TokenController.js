import { jwtDecode } from "jwt-decode";
import { setFavourites } from "../redux/favourites";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from '../api/api'

export default function useToken() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const getToken = () => localStorage.getItem("token");
  const login = (token, numberOfSongs, numberOfPlaylists) => {
    localStorage.setItem("token", token);
    if(numberOfSongs !== undefined && numberOfSongs !== null){
        localStorage.setItem("numberOfSongs", numberOfSongs);
    }
    if(numberOfPlaylists !== undefined && numberOfPlaylists !== null){
        localStorage.setItem("numberOfPlaylists", numberOfPlaylists);
    }
    localStorage.setItem("username", getDecodedToken().username);
  };
  const logout = async() => {
    localStorage.removeItem("token");
    localStorage.clear("persist:root");
    dispatch(setFavourites([]));
    try{
      const response = await api.post('/logout')
      console.log(response)
    }catch(err){
      console.log(err)
    }
    navigate("/login");
  };
  const isAuthenticated = () => {
    return !!getDecodedToken();
  };
  const isAdmin = () => getDecodedToken()?.role === "admin";

  const getDecodedToken = () => {
    let token = getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        refreshToken()
        setTimeout(() => { 
          token = getToken();
          if (!token) return null;
          const decoded = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < now) {
            return null
          }
          return decoded
        }, 500);
      }
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const refreshToken = async() => {
    try{
        const response = await api.post('/auth/refresh');
        console.log(response.data)
        if(response.data.success){
          localStorage.setItem("token", response.data.accessToken);
        }else{
          logout()
        }
        return response.data.success
    }catch(err){
      console.log(err)
      logout()
      return false
    }
  }

  return { getToken, login, logout, isAuthenticated, isAdmin, getDecodedToken, refreshToken };
}
