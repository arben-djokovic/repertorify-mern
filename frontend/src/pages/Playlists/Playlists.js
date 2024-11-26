import React, { useEffect, useState } from 'react'
import "./playlists.scss"
import PlaylistItem from '../../components/PlaylistItem/PlaylistItem'
import { Link } from 'react-router-dom'
import api from '../../api/api'

export default function Playlists() {
  const [playlists, setPlaylists] = useState([])

  const fetchPlaylists = async () => {
    try{
      const response = await api.get("/playlists");
      if(response.data.success){
        setPlaylists(response.data.playlists)
        console.log(response.data.playlists)
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=> {
    fetchPlaylists()
  }, [])
  return (
    <div className='playlists page pageContent'>
        <h1>Playlists:</h1>
        <div className="playlistsContent">
        <Link to={"/create-playlist"} className="addItemBtn">
            <img src="/assets/plus.png" alt="" />
        </Link>
        {playlists.map((playlist, i) => (<PlaylistItem playlist={playlist} key={i} i={i} />))}
        </div>
        <button to="/songs" className="moreBtn">Show more...</button>
    </div>
  )
}
