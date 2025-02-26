import React, { useEffect, useState } from 'react'
import './artist.scss'
import { Link, useParams } from 'react-router-dom';
import api from '../../api/api'
export default function Artist() {
    const { letter } = useParams()
    const [artists, setArtists] = useState([])
    useEffect(() => {
        const getArtists = async () => {
            try{
                const response = await api.get(`/artists/${letter}`);
                setArtists(response.data.artists);
                console.log(response.data.artists);
            }catch(err){
                console.log(err)
            }
        }
        getArtists()
    }, [window.location.href])
  return (
    <div className='artist page pageContent'>
        <h1>{letter.toLocaleUpperCase()}</h1>
        <div className="artists">
            {artists.map(artist => (<Link to={`/songs?artist=${artist}`} className="artistItem">{artist}</Link>))}
        </div>
    </div>
  )
}
