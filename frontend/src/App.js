import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import RightSidebar from "./components/RightSidebar/RightSidebar";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Songs from "./pages/Songs/Songs";
import Playlists from "./pages/Playlists/Playlists";
import { useEffect, useRef } from "react";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Registration/Login";
import Signup from "./pages/Registration/Signup";
import CreatePlaylist from "./pages/PlaylistForm/CreatePlaylist";
import AddSong from "./pages/SongForm/AddSong";
import Song from "./pages/Song/Song";
import Playlist from "./pages/Playlist/Playlist";
import 'react-toastify/dist/ReactToastify.css';
import { GuestRoute, UserRoute } from "./controllers/RoutesController";
import EditPlaylist from "./pages/PlaylistForm/EditPlaylist";
import EditSong from "./pages/SongForm/EditSong";

function App() {
  const location = useLocation();
  const formRef = useRef();
  const navigate = useNavigate();

  const searchSongs = async () => {
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    console.log(data["input"])
    navigate(`/songs?search=${data["input"]}`)
}


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Sidebar />
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="mobile-search">
            <input type="text" name="input" placeholder='Search for songs...' />
            <button onClick={searchSongs} className='searchBtn'>Search</button>
        </form>
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
            <Route path="/create-playlist" element={<UserRoute><CreatePlaylist /></UserRoute>} />
            <Route path="/add-song" element={<UserRoute><AddSong /></UserRoute>} />
            <Route path="/songs/:id" element={<Song />} />
            <Route path="/playlists/:id" element={<Playlist />} />
            <Route path="/playlists/:id/edit" element={<UserRoute><EditPlaylist /></UserRoute>} />
            <Route path="/songs/:id/edit" element={<UserRoute><EditSong /></UserRoute>} />
            <Route path="/*" element={<>404</>} />
          </Routes>
        </div>
        <RightSidebar />
      </main>
      <Footer />
    </div>
  );
}

export default App;
