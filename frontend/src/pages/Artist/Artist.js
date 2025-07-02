import React, { useEffect, useState } from 'react'
import './artist.scss'
import { Link, useParams } from 'react-router-dom';
import api from '../../api/api'
import { Helmet } from "react-helmet-async";

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
        <Helmet>
            <title>Izvođači koji počinju sa slovom {letter.toUpperCase()} | Repertorify</title>
            <meta
                name="description"
                content={`Pregledaj izvođače čija imena počinju slovom ${letter.toUpperCase()} i pronađi njihove pjesme sa akordima i tekstovima na Repertorify.`}
            />
            <meta property="og:title" content={`Izvođači koji počinju sa slovom ${letter.toUpperCase()} | Repertorify`} />
            <meta
                property="og:description"
                content={`Pregledaj izvođače čija imena počinju slovom ${letter.toUpperCase()} i pronađi njihove pjesme sa akordima i tekstovima na Repertorify.`}
            />
            <meta property="og:url" content={`https://repertorify.com/artists/${letter}`} />
        </Helmet>
        <h1>{letter.toLocaleUpperCase()}</h1>
        <div className="artists">
            {artists.length ? artists.map(artist => (<Link to={`/songs?artist=${artist}`} className="artistItem">{artist}</Link>)) : "No artists found"}
        </div>
    </div>
  )
}
