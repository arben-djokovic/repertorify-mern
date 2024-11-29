import React from 'react'
import "./playlistItem.scss"
import { faHeart,  } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { addFavourite, removeFavourite } from '../../redux/favourites'
import useToken from '../../controllers/TokenController';

export default function PlaylistItem({playlist, i}) {
    const { getDecodedToken, isAuthenticated } = useToken();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isMine = getDecodedToken()?.username === playlist.user.username
    const { favourites } = useSelector(state => state.favourites)
    let isLiked = favourites.includes(playlist._id)
    

    const playlistClick = (e) => {
        if(e.target.tagName === "svg" || e.target.tagName === "path"){
            return;
        }
        navigate("/playlists/" + playlist._id)
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

  return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="playlistItem link" onClick={playlistClick}>
    <div className="img">
        <img src={`/assets/${playlist.imageLocation}`} alt="" />
    </div>
    <div className="user">
        <div className="userInfo">
            <h3 className='playlistName'>{playlist.name}</h3>
            <p className='username'>{playlist.user.username} - {playlist.songs.length} songs</p>
        </div>
        <div className="heartDiv">
            {!isMine && <>
        {isLiked ? <FontAwesomeIcon onClick={unLikePlaylists} id='heart' className='heart' icon={faHeart} /> :
        <FontAwesomeIcon onClick={likePlaylist} id='heart' className='heart' icon={faRegularHeart} />}
        <div className="likes">{playlist.likes}</div>
            </>}
        </div>
    </div>
</motion.div>)
}
