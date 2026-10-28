import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./songForm.scss";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../../controllers/TokenController";
import { Helmet } from "react-helmet-async";
import GenreSelect from "../../components/GenreSelect/GenreSelect";
import { FieldSkeleton } from "../../components/Skeleton/Skeleton";

export default function EditSong() {
  const { id } = useParams();
  const { getDecodedToken } = useToken();
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [songTitle, setSongTitle] = useState("")
  const [songText, setSongText] = useState("")
  const [songArtist, setSongArtist] = useState("")
  const [loading, setLoading] = useState(true)
  const [genresLoading, setGenresLoading] = useState(true)


  const fetchGenres = async() => {
    try{
      const respone = await api.get('/genres')
      setGenres(respone.data.genres)
    }catch(err){
      console.log(err)
    }finally{
      setGenresLoading(false)
    }
  }
  
  const  fetchSong = async() => {
    try{
      const respone = await api.get('/songs/'+id)
      if(respone.data.success){
        console.log(respone.data.song)
        setSelectedGenres((respone.data.song.genres || []).filter(Boolean).map(genre => genre._id))

        setSongTitle(respone.data.song.title)
        setSongText(respone.data.song.text)
        setSongArtist(respone.data.song.artist)
      }
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }
  const addSong = async() => {
    formRef.current.querySelectorAll(".inputerror").forEach((error) => {
      error.innerText = "";
    })
    try{
      const response = await api.put('/songs/'+id+"/edit", {title: songTitle, text: songText, artist: songArtist, genres: selectedGenres})
      if(response.data.success){
        toast.success(response.data.message)
        navigate(`/songs/${id}`)
      }
      console.log(response)
    }catch(err){
      console.log(err)
        if(err.response?.data?.errors){
          toast.error(err.response.data.message)
          err.response.data.errors.forEach((error) => {
             const errorSpan = formRef.current.querySelector(`#${error.field}error`)
             if(errorSpan){
              errorSpan.innerText = `*${error.message}`
             }
          })
        }
    }
  }


  
  useEffect(() => {
    fetchGenres()
    fetchSong()
  }, [])

  return (
    <div className="registrationAddSong page pageContent">
      <Helmet>
        <title>Izmijeni pjesmu | Repertorify</title>
        <meta
          name="description"
          content="Izmijeni detalje svoje pjesme na Repertorify. Održi svoj digitalni repertoar uvijek svježim."
        />
        <meta property="og:title" content="Izmijeni pjesmu | Repertorify" />
        <meta
          property="og:description"
          content="Izmijeni detalje svoje pjesme na Repertorify. Održi svoj digitalni repertoar uvijek svježim."
        />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
      <div className="formDiv">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          ref={formRef}
        >
          <div className="header">
            <h1>Edit Song</h1>
          </div>
          <div className="input">
            <label htmlFor="title">Title <span className="inputerror" id="titleerror"></span></label>
            {loading ? <FieldSkeleton /> : <input defaultValue={songTitle} onChange={(e)=>{setSongTitle(e.target.value)}} type="text" id="title" name="title" />}
          </div>
          <div className="input">
            <label htmlFor="text">Text (with acords) <span className="inputerror" id="texterror"></span></label>
            {loading ? <FieldSkeleton height={240} /> : <textarea defaultValue={songText} height={5} onChange={(e) => {e.target.style.height = e.target.scrollHeight + "px" ; setSongText(e.target.value)}}  id="text" rows={5} name="text" />}
          </div>
          <div className="input">
            <label htmlFor="artist">Artist <span className="inputerror" id="artisterror"></span></label>
            {loading ? <FieldSkeleton /> : <input defaultValue={songArtist} onChange={(e)=>{setSongArtist(e.target.value)}} type="text" id="artist" name="artist" />}
          </div>
          <div className="input">
            <label>Genres <span className="inputerror" id="genreserror"></span></label>
            {loading || genresLoading ? <FieldSkeleton height={30} width="70%" /> : <GenreSelect genres={genres} selected={selectedGenres} setSelected={setSelectedGenres} />}
          </div>
          <button onClick={addSong} disabled={loading} className="formBtn">Edit song</button>
        </form>
      </div>
    </div>
  );
}
