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
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import useToken from "../../controllers/TokenController";

export default function Song() {
  const { isAuthenticated } = useToken()
  const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
  const {id} = useParams()
  let [song, setSong] = useState({
    title: "Loading...",
    text: "Loading...",
    artist: "Loading...",
  });

  const fetchSong = async() => {
    try{
      const respone = await api.get('/songs/'+id)
      console.log(respone)
      setSong(respone.data.song)
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
        localStorage.setItem("numberOfSongs", Number(localStorage.getItem("numberOfSongs")) - 1);
        return toast.success(respone.data.message)
      }
      toast.error('Something went wrong')
    }catch(err){
      toast.error('Something went wrong')
      console.log(err)
    }
  }

  useEffect(() => {
    fetchSong()
  }, [])

  return (
    <div className="song page pageContent">
      <div className="icons">
        <FontAwesomeIcon className="icon" icon={faFilePdf} />
        {isAuthenticated() && <>
        <FontAwesomeIcon
          id="icon"
          className="modalIcon"
          onClick={(e) => setIsEllipsisOpen(!isEllipsisOpen)}
          icon={faEllipsisV}
        />
        {isEllipsisOpen && (
          <Dropdown
            isEllipsisOpen={isEllipsisOpen}
            setIsEllipsisOpen={setIsEllipsisOpen}
          >
            <p id="ellipsisItem" className="ellipsisItem link">
              Add to playlist
            </p>
            <p id="ellipsisItem" className="ellipsisItem link">
              Edit
            </p>
            <p
              id="ellipsisItem"
              onClick={deleteSong}
              className="ellipsisItem link delete"
            >
              Delete
            </p>
          </Dropdown>
        )}
        </>}
      </div>
      <div className="songInfo">
        <h1 className="title">{song.title}</h1>
        <p>{song.artist}</p>
        <div className="songsBtns">
          <button>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p>0</p>
          <button>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <pre className="text">{song.text}</pre>
        <div className="arrows">
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowLeft} />
          <FontAwesomeIcon className="shuffle link" icon={faShuffle} />
          <FontAwesomeIcon className="arrow moreBtn link" icon={faArrowRight} />
        </div>
      </div>
    </div>
  );
}
