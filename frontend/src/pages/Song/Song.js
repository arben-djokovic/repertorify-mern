import { useEffect, useRef, useState } from "react";
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
import { isAuthenticated } from "../../controllers/TokenController";

export default function Song() {
  const { isAuthenticated, isAdmin } = useToken()
  const upButtonRef = useRef();
  const downButtonRef = useRef();
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const navigate = useNavigate()
  const {id, playlistId} = useParams()
  let [song, setSong] = useState({
    title: "Loading...",
    text: "Loading...",
    artist: "Loading...",
  });
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nextSong, setNextSong] = useState(null);
  const [prevSong, setPrevSong] = useState(null);
  const [randomSong, setRandomSong] = useState(null);
  const [transposeSteps, setTransposeSteps] = useState(0);
  const [playlistName, setPlaylistName] = useState(null);

  const chordRegex = /(?<!\S)([A-GH](#|b)?(?:maj|min|m|m7|maj7|dim|dim7|aug|sus2|sus4|add9|add11|7|6|9|11|13)?(?:\/[A-GH](#|b)?)?)(?!\S)/g;
  const chordMap = {
    "C": 0,
    'C#': 1,
    'D': 2,
    'D#': 3,
    'E': 4,
    'F': 5,
    'F#': 6,
    'G': 7,
    'G#': 8,
    'A': 9,
    'B': 10,
    'H': 11
  };

  const reverseChordMap = Object.fromEntries(
    Object.entries(chordMap).map(([chord, value]) => [value, chord])
  );

  const transposeChord = (chord, semitones) => {
    const rootMatch = chord.match(/^([A-GH](#|b)?)/);
    if (!rootMatch) return chord; 

    const root = rootMatch[0]; 
    const suffix = chord.substring(root.length); 
    const currentVal = chordMap[root];

    if (currentVal === undefined) return chord; 

    const transposedVal = (currentVal + semitones + 12) % 12;
    const transposedRoot = reverseChordMap[transposedVal];

    return transposedRoot + suffix;
};
const transposeSong = async(semitones) => {
  let transposeStepsTest = transposeSteps + semitones
  let songText = song.text;
  songText = songText.replace(chordRegex, (match) => transposeChord(match, semitones));
  setSong((prevSong) => ({ ...prevSong, text: songText }));
  if(!isAuthenticated()) return checkStepenDisableButtons(transposeStepsTest)
  try{
    const response = await api.put(`/songs/${id}/step`, {step: transposeStepsTest})
    console.log(response.data)
    checkStepenDisableButtons(transposeStepsTest)
  }catch(err){
    console.log(err)
    checkStepenDisableButtons(transposeStepsTest)
  }
};

  const handleTranspose = (direction) => {
      downButtonRef.current.disabled = true;
      upButtonRef.current.disabled = true;
    if (direction === "up" && transposeSteps < 5) {
      setTransposeSteps((prev) => prev + 1);
      transposeSong(1);
    } else if (direction === "down" && transposeSteps > -5) {
      setTransposeSteps((prev) => prev - 1);
      transposeSong(-1);
    }
  };

  const checkStepenDisableButtons = (step) => {
    if (step === 5) {
      downButtonRef.current.disabled = false;
      upButtonRef.current.disabled = true;
    } else if (step === -5) {
      upButtonRef.current.disabled = false;
      downButtonRef.current.disabled = true;
    }else {
      upButtonRef.current.disabled = false;
      downButtonRef.current.disabled = false;
    }
  };

  const fetchSong = async() => {
    let songText = song.text
    try{
      let url = '/songs/'+id
      if(playlistId) url = `/playlists/${playlistId}/songs/${id}`
      const response = await api.get(url)
      console.log(response)
      if(!response.data.success) return navigate('/songs')
        setSong(response.data.song);
        setNextSong(response.data.nextSong)
        setPrevSong(response.data.prevSong)
        setRandomSong(response.data.randomSong)
        setPlaylistName(response.data.playlistName)
        if(response.data.step){
          setTransposeSteps(response.data.step)
          songText = response.data.song.text.replace(chordRegex, (match) => transposeChord(match, response.data.step));
          setSong({...response.data.song, text: songText})
          checkStepenDisableButtons(response.data.step)
        }
    }catch(err){
      toast.error('Something went wrong')
      console.log(err)
    }
  }

  const deleteSong = async() => {
    try{
      const respone = await api.delete('/songs/'+id)
      console.log(respone)
      if(respone.data.success){
        toast.success("Song deleted")
        if(song.user.username === localStorage.getItem("username")){
          localStorage.setItem("numberOfSongs", Number(localStorage.getItem("numberOfSongs")) - 1);
        }
      }
    }catch(err){
      toast.error('Sometahing went wrong')
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

  const downloadSong = async () => {
    try {
      const response = await api.get(`/download/songs/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `song_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log(err);
    }
  }

  const highlightChords = (text) => {
    return text.replace(chordRegex, (match) => `<span class="akord">${match.replace("#", "&#35;")}</span>`);
};


  const goToNextSong = () => {
    if(!nextSong) return
    let url = '/songs/'+nextSong._id
    if(playlistId) url = `/playlists/${playlistId}/songs/${nextSong._id}`
    navigate(url)
  }
  const goToPrevSong = () => {
    if(!prevSong) return
    let url = '/songs/'+prevSong._id
    if(playlistId) url = `/playlists/${playlistId}/songs/${prevSong._id}`
    navigate(url)
  }
  const goToRandomSong = () => {
    if(!randomSong) return
    let url = '/songs/'+randomSong._id
    if(playlistId) url = `/playlists/${playlistId}/songs/${randomSong._id}`
    navigate(url)
  }
  useEffect(() => {
    if (playlists.length == 0 && addToPlaylistOpen) {
      fetchPlaylists();
    }
  }, [addToPlaylistOpen]);

  useEffect(() => {
    fetchSong()
    setTransposeSteps(0);
  }, [window.location.href])

  return (<>
    <div className="song page pageContent">
      <div className="icons">
        <FontAwesomeIcon onClick={downloadSong} className="icon" icon={faFilePdf} />
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
        <p className="artistName" onClick={() => navigate(`/songs?artist=${song.artist}`)}>{song.artist}</p>
        <div className="songsBtns">
          <button ref={downButtonRef} onClick={() => {handleTranspose("down");}}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p className="transpose">{transposeSteps}</p>
          <button ref={upButtonRef} onClick={() => {handleTranspose("up");}}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <pre
            className="text"
            dangerouslySetInnerHTML={{ __html: highlightChords(song.text) }}
          ></pre>
        <div className="arrows">
          <FontAwesomeIcon onClick={goToPrevSong} className="arrow moreBtn link" icon={faArrowLeft} />
          <FontAwesomeIcon onClick={goToRandomSong} className="shuffle link" icon={faShuffle} />
          <FontAwesomeIcon onClick={goToNextSong} className="arrow moreBtn link" icon={faArrowRight} />
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
