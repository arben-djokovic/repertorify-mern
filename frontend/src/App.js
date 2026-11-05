import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import "./App.scss";
import Sidebar from "./components/Sidebar/Sidebar";
import RightSidebar from "./components/RightSidebar/RightSidebar";
import Footer from "./components/Footer/Footer";
import Songs from "./pages/Songs/Songs";
import Playlists from "./pages/Playlists/Playlists";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Song from "./pages/Song/Song";
import 'react-toastify/dist/ReactToastify.css';
import { AdminRoute, GuestRoute, UserRoute } from "./controllers/RoutesController";

// Pages most visitors never open (forms, admin, profile...) are split out of the main
// bundle, so song pages download and start faster
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Login = lazy(() => import("./pages/Registration/Login"));
const Signup = lazy(() => import("./pages/Registration/Signup"));
const CreatePlaylist = lazy(() => import("./pages/PlaylistForm/CreatePlaylist"));
const AddSong = lazy(() => import("./pages/SongForm/AddSong"));
const Playlist = lazy(() => import("./pages/Playlist/Playlist"));
const EditPlaylist = lazy(() => import("./pages/PlaylistForm/EditPlaylist"));
const EditSong = lazy(() => import("./pages/SongForm/EditSong"));
const Artist = lazy(() => import("./pages/Artist/Artist"));
const CreateGenre = lazy(() => import("./pages/GenreForm/CreateGenre"));
const Genres = lazy(() => import("./pages/Genres/Genres"));
const EditGenre = lazy(() => import("./pages/GenreForm/EditGenre"));
const WhatIsRepertorify = lazy(() => import("./pages/WhatIsRepertorify/WhatIsRepertorify"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));

function App() {
  const location = useLocation();
  const formRef = useRef();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("songs")

    const searchSelected = async () => {
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData);
        console.log(data["input"])
        if(selected === "playlists"){
            navigate(`/playlists?search=${data["input"]}`)
        }else{
            navigate(`/songs?search=${data["input"]}`)
        }
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
            <input type="text" name="input" placeholder='Search...' />
            <select defaultValue={selected} onChange={(e) => setSelected(e.target.value)} className="selectWhatis" name="" id="">
                <option value="songs">Songs</option>
                <option value="playlists">Playlists</option>
            </select>
            <button onClick={searchSelected} className='searchBtn'>Search</button>
        </form>
        <div className="mainContent">
          <Suspense fallback={null}>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Songs />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/user/:id" element={<Profile />} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
            <Route path="/create-playlist" element={<UserRoute><CreatePlaylist /></UserRoute>} />
            <Route path="/add-song" element={<UserRoute><AddSong /></UserRoute>} />
            <Route path="/songs/:id" element={<Song />} />
            <Route path="/playlists/:playlistId/songs/:id" element={<Song />} />
            <Route path="/playlists/:id" element={<Playlist />} />
            <Route path="/playlists/:id/edit" element={<UserRoute><EditPlaylist /></UserRoute>} />
            <Route path="/songs/:id/edit" element={<UserRoute><EditSong /></UserRoute>} />
            <Route path="/artists/:letter" element={<Artist />} />
            <Route path="/genre/create" element={<AdminRoute><CreateGenre /></AdminRoute>} />
            <Route path="/genre/edit/:id" element={<AdminRoute><EditGenre /></AdminRoute>} />
            <Route path="/genres" element={<AdminRoute><Genres /></AdminRoute>} />
            <Route path="/about-us" element={<WhatIsRepertorify />} />
            <Route path="/404" element={<PageNotFound />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
          </Suspense>
        </div>
        <RightSidebar />
      </main>
      <Footer />
    </div>
  );
}

export default App;
