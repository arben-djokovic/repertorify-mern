import React, { useEffect, useState } from "react";
import SongItem from "../../components/SongItem/SongItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFilePdf, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import "./playlist.scss";
import Dropdown from "../../components/Dropdown/Dropdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import useToken from "../../controllers/TokenController";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addFavourite, removeFavourite } from "../../redux/favourites";


export default function Playlist() {
    const { id } = useParams();
    const { favourites } = useSelector(state => state.favourites)
    const { isAuthenticated, getDecodedToken, isAdmin } = useToken();
    const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
    const [playlist, setPlaylist] = useState({
      name: "",
      songs: [], 
      likes: 0,
      user: { 
        username: ""
      },
    })
    const [isMine, setIsMine] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isLiked = favourites.includes(id)

    const fetchPlaylist = async() => {
        try{
            const respone = await api.get('/playlists/'+id)
            console.log(respone)
            setPlaylist(respone.data.playlist)  
            if(getDecodedToken()?.username === respone.data.playlist.user.username){
              setIsMine(true)
            }
        }catch(err){
            console.log(err)
        }
    }


    const likePlaylist = async () => {
      if(isMine) return toast.error("You can't like your own playlist")
      if(!isAuthenticated()) return navigate("/login")
      try{
          const response = await api.put(`/playlists/${playlist._id}/like`);
          if(response.data.success){
              dispatch(addFavourite(playlist._id))
              playlist.likes++;
          }
      }catch(err){
          toast.error("Something went wrong")
          console.log(err)
      }
  }
  const unLikePlaylists = async () => {
      if(isMine) return toast.error("You can't like your own playlist")
      if(!isAuthenticated()) return navigate("/login")
      try {
        const response = await api.put(`/playlists/${playlist._id}/unlike`);
        console.log(response)
        if (response.data.success) {
          dispatch(removeFavourite(playlist._id))
          playlist.likes--;
        }
      } catch (err) {
        toast.error("Something went wrong");
        console.log(err);
      }
  }

  const deletePlaylist = async() => {
    try{
      const response = await api.delete(`/playlists/${playlist._id}`)
      if(response.data.success){
        toast.success("Playlist deleted")
        navigate("/playlists")
      }
      console.log(response)
    }catch(err){
      console.log(err)
    }
  }

    useEffect(() => {
        fetchPlaylist()
    }, [])


  return (
    <section className="playlist page pageContent">
      <div className="icons">
        <div className="icon">
        {isLiked ? <FontAwesomeIcon onClick={unLikePlaylists} id='heart' className='heart' icon={faHeart} /> :
        <FontAwesomeIcon onClick={likePlaylist} id='heart' className='heart' icon={faRegularHeart} />}
        <p className="likes">{playlist.likes}</p>
        </div>
        <FontAwesomeIcon className="icon" icon={faFilePdf} />
        {isAuthenticated() && (isAdmin() || playlist.user.username === localStorage.getItem("username")) && <>
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
            <Link to={`/playlists/${playlist._id}/edit`} id="ellipsisItem" className="ellipsisItem link">
              Edit
            </Link>
            <p
              id="ellipsisItem"
              onClick={deletePlaylist}
              className="ellipsisItem link delete"
            >
              Delete
            </p>
          </Dropdown>
        )}
        </>}
      </div>
      <h1 className="playlistTitle">{playlist.name}</h1>
      <div className="songsList">
        {playlist.songs.length > 0 ? playlist.songs.map((song, i) => (
          <SongItem song={song} key={i} i={i} />
        )) : <p>No songs in playlist</p>}
      </div>
    </section>
  );
}
