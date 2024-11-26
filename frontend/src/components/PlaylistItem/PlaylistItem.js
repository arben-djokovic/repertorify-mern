import React from 'react'
import "./playlistItem.scss"
import { faHeart,  } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getDecodedToken } from '../../controllers/TokenController'

export default function PlaylistItem({playlist, i, isMine}) {
    let [isLiked, setIsLiked] = React.useState(false);
    const navigate = useNavigate()

    const playlistClick = (e) => {
        if(e.target.tagName === "svg" || e.target.tagName === "path"){
            return;
        }
        navigate("/playlists/" + playlist._id)
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
        {isLiked ? <FontAwesomeIcon onClick={() => setIsLiked(!isLiked)} id='heart' className='heart' icon={faHeart} /> :
        <FontAwesomeIcon onClick={() => setIsLiked(!isLiked)} id='heart' className='heart' icon={faRegularHeart} />}
        <div className="likes">23</div>
            </>}
        </div>
    </div>
</motion.div>)
}
