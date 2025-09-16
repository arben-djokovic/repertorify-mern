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

    // const likePlaylist = async () => {
    //     if(isMine) return toast.error("You can't like your own playlist")
    //     if(!isAuthenticated()) return navigate("/login")
    //     try{
    //         const response = await api.put(`/playlists/${playlist._id}/like`);
    //         if(response.data.success){
    //             dispatch(addFavourite(playlist._id))
    //             playlist.likes++;
    //         }
    //     }catch(err){
    //         console.log(err)
    //         if(err.response.status === 400 && err.response.data.message === "Playlist already liked") {
    //             console.log(err.response.data)
    //             dispatch(addFavourite(playlist._id))
    //           }
    //     }
    // }
    // const unLikePlaylists = async () => {
    //     if(isMine) return toast.error("You can't like your own playlist")
    //     if(!isAuthenticated()) return navigate("/login")
    //     try {
    //       const response = await api.put(`/playlists/${playlist._id}/unlike`);
    //       console.log(response)
    //       if (response.data.success) {
    //         dispatch(removeFavourite(playlist._id))
    //         playlist.likes--;
    //       }
    //     } catch (err) {
    //       console.log(err);
    //       if(err.response.status === 400 && err.response.data.message === "Playlist not liked") {
    //         console.log(err.response.data)
    //         dispatch(removeFavourite(playlist._id))
    //       }
    //     }
    // }

  return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1, duration: 0.3 }} className={isMobile ? "playlistItem playlistItemMobile link" : "playlistItem link"} onClick={playlistClick}>
    <div className="img">
        <img src={`/assets/${playlist.imageLocation}`} alt="" />
    </div>
    <div className="user">
        <div className="userInfo">
            <h3 className='playlistName'>{playlist.name}</h3>
            <p className='username'>{playlist.user.username} - {playlist.songs.length} songs</p>
        </div>
        <div className='greaterThan'>
            {/* <FontAwesomeIcon  icon={faGreaterThan} />  */}
        </div>
    </div>
</motion.div>)
}
