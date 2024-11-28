import { jwtDecode } from "jwt-decode";
import { setFavourites } from "../redux/favourites";
import { useDispatch } from "react-redux";

export default function useToken() {
  const dispatch = useDispatch();

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
  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.clear("persist:root");
    dispatch(setFavourites([]));
    if (navigate) {
      navigate("/login");
    }
  };
  const isAuthenticated = () => {
    if(!getToken()){
        logout();
    }
    return !!getDecodedToken();
  };
  const isAdmin = () => getDecodedToken()?.role === "admin";

  const getDecodedToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        logout();
        return null;
      }
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  return { getToken, login, logout, isAuthenticated, isAdmin, getDecodedToken };
}
