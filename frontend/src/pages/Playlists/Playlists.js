import React, { useEffect, useState } from 'react'
import "./playlists.scss"
import PlaylistItem from '../../components/PlaylistItem/PlaylistItem'
import { Link } from 'react-router-dom'
import api from '../../api/api'
import { Helmet } from "react-helmet-async";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  let searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]

  const fetchPlaylists = async () => {
    try {
      const response = await api.get(`/playlists?page=${page}&search=${searchFromUrl}`);
      if (response.data.success) {
        setPlaylists(response.data.playlists)
        setHasMore(response.data.hasMore)
        console.log(response.data.playlists)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const showMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  useEffect(() => {
    searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]
    fetchPlaylists()
  }, [window.location.href, page])
  return (
    <div className='playlists page pageContent'>
      <Helmet>
        <title>Top Guitar Playlists from Repertorify Users</title>
        <meta
          name="description"
          content="Discover the most popular guitar playlists created by Repertorify users. Explore, play, and get inspired by curated collections of your favorite songs with chords and lyrics."
        />
      </Helmet>
      <h1>Playlists:</h1>
      <div className="playlistsContent">
        {playlists.length > 0 && <Link to={"/create-playlist"} className="addItemBtn">
          <img src="/assets/plus.png" alt="" />
        </Link>}
        {playlists.length > 0 ? playlists.map((playlist, i) => (<PlaylistItem playlist={playlist} key={i} i={i} />)) : <p className="noPlaylists">No playlists found - <Link to={"/create-playlist"} className="link linkcolor">Create a playlist</Link></p>}
      </div>
      {hasMore && <button onClick={showMore} to="/songs" className="moreBtn">Show more...</button>}
    </div>
  )
}
