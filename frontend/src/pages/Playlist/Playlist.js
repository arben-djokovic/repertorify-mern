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
import AreYouSure from "../../components/AreYouSure/AreYouSure";


export default function Playlist() {
    const { id } = useParams();
    const { favourites } = useSelector(state => state.favourites)
    const { isAuthenticated, getDecodedToken, isAdmin } = useToken();
    const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
          console.log(err)
          if(err.response.status === 400 && err.response.data.message === "Playlist already liked") {
            console.log(err.response.data)
            dispatch(addFavourite(playlist._id))
          }
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
        console.log(err);
        if(err.response.status === 400 && err.response.data.message === "Playlist not liked") {
          console.log(err.response.data)
          dispatch(removeFavourite(playlist._id))
        }
      }
  }

  const deletePlaylist = async() => {
    try{
      const response = await api.delete(`/playlists/${playlist._id}`)
      if(response.data.success){
        if(playlist.user.username === localStorage.getItem("username")){
          let myPlaylists = JSON.parse(localStorage.getItem("numberOfPlaylists"))
          myPlaylists = myPlaylists - 1
          localStorage.setItem("numberOfPlaylists", JSON.stringify(myPlaylists))
        }
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


  return (<>
    <section className="playlist page pageContent">
      <div className="icons">
        {!isMine && <div className="icon">
        {isLiked ? <FontAwesomeIcon onClick={unLikePlaylists} id='heart' className='heart' icon={faHeart} /> :
        <FontAwesomeIcon onClick={likePlaylist} id='heart' className='heart' icon={faRegularHeart} />}
        <p className="likes">{playlist.likes}</p>
        </div>}
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
              onClick={() => setDeleteModalOpen(true)}
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
          <SongItem inPlaylist={true} song={song} key={i} i={i} playlistUserId={playlist.user._id} playlistId={playlist._id} />
        )) : <p>No songs in playlist</p>}
      </div>
    </section>
    {deleteModalOpen && <AreYouSure onYes={deletePlaylist} setModalOpen={setDeleteModalOpen} />}
    </>
  );
}
