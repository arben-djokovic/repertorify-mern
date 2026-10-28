import "./playlistItem.scss"
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function PlaylistItem({playlist, i, isMobile}) {
    const navigate = useNavigate()

    const playlistClick = (e) => {
        if(e.target.tagName === "svg" || e.target.tagName === "path"){
            return;
        }
        navigate("/playlists/" + playlist._id)
    }

    const songCount = playlist.songs.length

  return (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }} className={isMobile ? "playlistItem playlistItemMobile link" : "playlistItem link"} onClick={playlistClick}>
    <div className="pi-cover">
        <img src={`/assets/${playlist.imageLocation}`} alt="" />
    </div>
    <div className="pi-info">
        <h3 className="pi-name" title={playlist.name}>{playlist.name}</h3>
        <p className="pi-count">{songCount} {songCount === 1 ? "song" : "songs"}</p>
    </div>
</motion.div>)
}
