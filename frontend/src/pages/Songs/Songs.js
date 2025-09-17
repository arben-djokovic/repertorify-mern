import React, { useEffect, useState } from "react";
import "./songs.scss";
import SongItem from "../../components/SongItem/SongItem";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { faArrowCircleLeft, faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Songs() {
  const searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]
  const genreFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('genre'))[0]?.split('=')[1]
  
  
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([])
  const [haveMore, setHaveMore] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState((searchFromUrl) ? searchFromUrl : '')
  const [genre, setGenre] = useState((genreFromUrl) ? genreFromUrl : '')
  const [songsPerPage, setSongsPerPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const navigate = useNavigate()

  const fetchGenres = async() => {
    try{
      const respone = await api.get('/genres')
      console.log(respone.data)
      setGenres(respone.data.genres)
    }catch(err){
      console.log(err)
    }
  }

  const fetchSongs = async () => {
    const searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]
    const genreFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('genre'))[0]?.split('=')[1]
    const artistFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('artist'))[0]?.split('=')[1]
    try {
      const respone = await api.get("/songs?page=" + page + '&search=' + (searchFromUrl ? searchFromUrl : '') + '&genre=' + (genreFromUrl ? genreFromUrl : '') + '&artist=' + (artistFromUrl ? artistFromUrl : ''));
      console.log(respone.data);
      setSongs(respone.data.songs);
      console.log(respone.data.songs.length);
      setHaveMore(respone.data.hasMore);
      console.log(respone.data.hasMore);
      setTotalPages(respone.data.totalPages)
      if(songsPerPage === 0){
        setSongsPerPage(respone.data.songs.length)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeGenre = (e) => {
    setGenre(e.target.value)
    setPage(1)
    navigate('/songs?search=' + search + '&genre=' + e.target.value)
  }

  const showMore = () => {
    setPage( (prevPage) => prevPage + 1)
    const searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]
    const genreFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('genre'))[0]?.split('=')[1]
    const artistFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('artist'))[0]?.split('=')[1]
    navigate("/songs?page=" + page + '&search=' + (searchFromUrl ? searchFromUrl : '') + '&genre=' + (genreFromUrl ? genreFromUrl : '') + '&artist=' + (artistFromUrl ? artistFromUrl : ''));
  }
  const showLess = () => {
    setPage( (prevPage) => prevPage - 1)
    const searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]
    const genreFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('genre'))[0]?.split('=')[1]
    const artistFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('artist'))[0]?.split('=')[1]
    navigate("/songs?page=" + page + '&search=' + (searchFromUrl ? searchFromUrl : '') + '&genre=' + (genreFromUrl ? genreFromUrl : '') + '&artist=' + (artistFromUrl ? artistFromUrl : ''));
  }

  useEffect(() => {
    const searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]
    const genreFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('genre'))[0]?.split('=')[1]

    setSearch((searchFromUrl) ? searchFromUrl : '')
    setGenre((genreFromUrl) ? genreFromUrl : '')

    fetchSongs()

    window.scrollTo(0, 0);

  }, [window.location.href, page])


  useEffect(() => {
    
    fetchGenres()
  }, [])
  return (
    <section className="songs page pageContent">
    <Helmet>
      <title>Pregledaj pjesme sa akordima | Repertorify</title>
      <meta
        name="description"
        content="Pronađi pjesme sa akordima i tekstom, lako transponuj i prilagodi ton svom glasu na Repertorify."
      />
      <meta property="og:title" content="Pregledaj pjesme sa akordima | Repertorify" />
      <meta
        property="og:description"
        content="Pronađi pjesme sa akordima i tekstom, lako transponuj i prilagodi ton svom glasu na Repertorify."
      />
      <meta property="og:url" content={window.location.href} />
    </Helmet>
      <div className="songsHeader">
        <h1>Songs:</h1>
        <div className="genres">
          <label htmlFor="genres">Genre:</label>
          <select onChange={changeGenre} name="genres" id="genres">
            <option value=""></option>
            {genres.map((genre, i) => {
              if (genre._id === genreFromUrl) return <option value={genre._id} key={genre._id} selected>{genre.name}</option>
              return <option value={genre._id} key={genre._id}>{genre.name}</option>
              }
            )}
          </select>
        </div>
      </div>
      <div className="songsList">
        {songs.length > 0 && <Link to={"/add-song"} className="addItemBtn">
            <img src="/assets/plus.png" alt="" />
        </Link>}
        {songs.length > 0 ? songs.map((song, i) => {
          let i2 = i
          if(page > 1 && i > songsPerPage - 1) {
            i2 = Math.round(i - songsPerPage * (page - 1)) 
            console.log(i)
            console.log(i2)
          }
          return(
          <SongItem song={song} key={i} i={i2} />
        )}) : <p>No songs found - <Link to={"/add-song"} className="link linkcolor">Add a song</Link></p>}
      </div>
      <div className="icons">
        <button disabled={page === 1} onClick={showLess}><FontAwesomeIcon className="icon" icon={faArrowCircleLeft} /></button>
        <p className="pageNo">{page} / {totalPages}</p>
        <button disabled={!haveMore} onClick={showMore}><FontAwesomeIcon className="icon" icon={faArrowCircleRight} /></button>
      </div>
    </section>
  );
}
