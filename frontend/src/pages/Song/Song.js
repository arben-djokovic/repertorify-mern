import React, { useEffect, useState } from "react";
import "./song.scss";
import {
    faArrowLeft,
    faArrowRight,
  faEllipsisV,
  faFilePdf,
  faMinus,
  faPlus,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../../components/Dropdown/Dropdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import useToken from "../../controllers/TokenController";
import Modal from "../../components/Modal/Modal";
import AreYouSure from "../../components/AreYouSure/AreYouSure";

const CHORDS = [
  "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "H", "Cm", "C#m", "Dbm", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m", "Gbm", "Gm", "G#m", "Abm", "Am", "A#m", "Bbm", "Hm", "C7", "C#7", "Db7", "D7", "D#7", "Eb7", "E7", "F7", "F#7", "Gb7", "G7", "G#7", "Ab7", "A7", "A#7", "Bb7", "H7", "Cm7", "C#m7", "Dbm7", "Dm7", "D#m7", "Ebm7", "Em7", "Fm7", "F#m7", "Gbm7", "Gm7", "G#m7", "Abm7", "Am7", "A#m7", "Bbm7", "Hm7", "Cmaj7", "C#maj7", "Dbmaj7", "Dmaj7", "D#maj7", "Ebmaj7", "Emaj7", "Fmaj7", "F#maj7", "Gbmaj7", "Gmaj7", "G#maj7", "Abmaj7", "Amaj7", "A#maj7", "Bbmaj7", "Hmaj7", "Csus4", "C#sus4", "Dbsus4", "Dsus4", "D#sus4", "Ebsus4", "Esus4", "Fsus4", "F#sus4", "Gbsus4", "Gsus4", "G#sus4", "Absus4", "Asus4", "A#sus4", "Bbsus4", "Hsus4", "Csus2", "C#sus2", "Dbsus2", "Dsus2", "D#sus2", "Ebsus2", "Esus2", "Fsus2", "F#sus2", "Gbsus2", "Gsus2", "G#sus2", "Absus2", "Asus2", "A#sus2", "Bbsus2", "Hsus2"
];

export default function Song() {
  const { isAuthenticated, isAdmin } = useToken()
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const navigate = useNavigate()
  const {id} = useParams()
  let [song, setSong] = useState({
    title: "Loading...",
    text: "Loading...",
    artist: "Loading...",
  });
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [removeFromPlaylistModal, setRemoveFromPlaylistModal] = useState(false);

  const fetchSong = async() => {
    try{
      const response = await api.get('/songs/'+id)
      console.log(response)
      if(!response.data.success) return navigate('/songs')
        setSong({
          ...response.data.song,
          text: wrapChords(response.data.song.text),
        });
    }catch(err){
      toast.error('Something went wrong')
      console.log(err)
    }
  }
  const wrapChords = (text) => {
    const chordsRegex = new RegExp(`\\b(${CHORDS.join("|")})\\b`, "g");
    return text.replace(chordsRegex, (match) => {
      return `<span class=\"akord\">${match}</span>`;
    });
  };

  const transposeChord = (chord, step) => {
    const baseChord = chord.replace(/m|7|maj7|sus4|sus2/g, "");
    const modifier = chord.replace(baseChord, "");
    const index = CHORDS.indexOf(baseChord);
    if (index === -1) return chord;
    const newIndex = (index + step + CHORDS.length) % CHORDS.length;
    return CHORDS[newIndex] + modifier;
  };

  const transposeText = (step) => {
    setSong((prevSong) => {
      const newText = prevSong.text.replace(/<span class=\"akord\">(.*?)<\/span>/g, (match, p1) => {
        return `<span class=\"akord\">${transposeChord(p1, step)}</span>`;
      });
      return { ...prevSong, text: newText };
    });
  };

  const deleteSong = async() => {
    try{
      const respone = await api.delete('/songs/'+id)
      console.log(respone)
      if(respone.data.success){
        if(song.user.username === localStorage.getItem("username")){
          localStorage.setItem("numberOfSongs", Number(localStorage.getItem("numberOfSongs")) - 1);
        }
      }
    }catch(err){
      toast.error('Something went wrong')
      console.log(err)
    }
  }

  const selectPlaylist = (e) => {
    const newPlaylists = [...selectedPlaylists];
    if (e.target.checked) {
      if (!newPlaylists.includes(e.target.name)) {
        newPlaylists.push(e.target.name);
      }
    } else {
      const index = newPlaylists.indexOf(e.target.name);
      if (index > -1) {
        newPlaylists.splice(index, 1);
      }
    }
    setSelectedPlaylists(newPlaylists);
    console.log(newPlaylists);
  };


  const addSongToPlaylists = async () => {
    try{
      const response = await api.post("/add-to-playlist", {songId: song._id, playlistIds: selectedPlaylists});
      if(response.data.success){
        toast.success(response.data.message);
        setAddToPlaylistOpen(false);
        setTimeout(() => {
          fetchPlaylists();
        }, 100);
      }
      console.log(response)
    }catch(err){
      console.log(err)
    }
  }

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/playlists/my");
      console.log(response);
      if (response.data.success) {
        setPlaylists(response.data.playlists);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (playlists.length == 0 && addToPlaylistOpen) {
      fetchPlaylists();
    }
  }, [addToPlaylistOpen]);
  useEffect(() => {
    fetchSong()
  }, [])

  return (<>
    <div className="song page pageContent">
      <div className="icons">
        <FontAwesomeIcon className="icon" icon={faFilePdf} />
        {isAuthenticated() && (
          <>
            <FontAwesomeIcon
              id="icon"
              onClick={(e) => setIsEllipsisOpen(!isEllipsisOpen)}
              icon={faEllipsisV}
            />
            {isEllipsisOpen && (
              <Dropdown
                isEllipsisOpen={isEllipsisOpen}
                setIsEllipsisOpen={setIsEllipsisOpen}
              >
                <p onClick={() => setAddToPlaylistOpen(true)} id="ellipsisItem" className="ellipsisItem link">
                  Add to playlist
                </p>
                {(isAdmin() || song.user.username === localStorage.getItem("username")) && (<>
                <Link to={`/songs/${id}/edit`} id="ellipsisItem" className="ellipsisItem link">
                  Edit
                </Link>
                <p
                  id="ellipsisItem"
                  onClick={()=>{setDeleteModalOpen(true)}}
                  className="ellipsisItem link delete"
                >
                  Delete
                </p>
                </>)}
              </Dropdown>
            )}
          </>
        )}
      </div>
      <div className="songInfo">
        <h1 className="title">{song.title}</h1>
        <p>{song.artist}</p>
        <div className="songsBtns">
          <button onClick={() => transposeText(-1)}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p>0</p>
          <button onClick={() => transposeText(1)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <pre
            className="text"
            dangerouslySetInnerHTML={{ __html: song.text }}
          ></pre>
        <div className="arrows">
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowLeft} />
          <FontAwesomeIcon className="shuffle link" icon={faShuffle} />
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowRight} />
        </div>
      </div>
    </div>
    {addToPlaylistOpen && (
        <Modal setModalOpen={setAddToPlaylistOpen}>
          <div className="modalSong">
            <div className="inputs">
              {playlists.length === 0 && <p>No playlists found</p>}
              {playlists.length > 0 && playlists.map((playlist, i) => {
                let songIds = playlist.songs.map(song => song._id);
                if(songIds.includes(song._id)) {
                  return(
                    <div key={i} className="input">
                      <input disabled checked type="checkbox" name={playlist._id} id={i} />
                      <label htmlFor={i}>{playlist.name}</label>
                    </div>
                  )
                }
                return(
                <div key={i} className="input">
                  <input onChange={selectPlaylist} type="checkbox" name={playlist._id} id={i} />
                  <label htmlFor={i}>{playlist.name}</label>
                </div>
              )})}
            </div>
            <button onClick={addSongToPlaylists} className="addBtn">Add to playlist</button>
          </div>
        </Modal>
      )}
      {deleteModalOpen && <AreYouSure onYes={deleteSong} setModalOpen={setDeleteModalOpen} />}    
    </>
  );
}
