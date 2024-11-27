import React, { useState } from 'react'
import "./playlistItem.scss"
import { faHeart,  } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getDecodedToken } from '../../controllers/TokenController'
import api from '../../api/api'
import { toast } from 'react-toastify'

export default function PlaylistItem({playlist, i}) {
    const navigate = useNavigate()
    const isMine = getDecodedToken()?.username === playlist.user.username
    const favourites = localStorage.getItem('favourites')?.split(',')
    const [isLiked, setIsLiked] = useState(favourites?.includes(playlist._id))

    const playlistClick = (e) => {
        if(e.target.tagName === "svg" || e.target.tagName === "path"){
            return;
        }
        navigate("/playlists/" + playlist._id)
    }

    const likePlaylist = async () => {
        if(isMine) return toast.error("You can't like your own playlist")
        try{
            const response = await api.put(`/playlists/${playlist._id}/like`);
            if(response.data.success){
                console.log(response.data)
                setIsLiked(true)
                playlist.likes++
                favourites.push(playlist._id)
                localStorage.setItem('favourites', favourites)
            }else{
                toast.error("Something went wrong")
            }
        }catch(err){
            toast.error("Something went wrong")
            console.log(err)
        }
    }
    const unLikePlaylists = async () => {
        if(isMine) return toast.error("You can't like your own playlist")
        try {
          const response = await api.put(`/playlists/${playlist._id}/unlike`);
          if (response.data.success) {
              setIsLiked(false)
              playlist.likes--
              favourites.splice(favourites.indexOf(playlist._id), 1)
              localStorage.setItem('favourites', favourites)
          } else {
            toast.error("Something went wrong");
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
