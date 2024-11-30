import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./songForm.scss";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import useToken from "../../controllers/TokenController";

export default function EditSong() {
  const { id } = useParams();
  const { getDecodedToken } = useToken();
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState("")
  const [songTitle, setSongTitle] = useState("")
  const [songText, setSongText] = useState("")
  const [songArtist, setSongArtist] = useState("")


  const fetchGenres = async() => {
    try{
      const respone = await api.get('/genres')
      setGenres(respone.data.genres)
    }catch(err){
      console.log(err)
    }
  }
  
  const  fetchSong = async() => {
    try{
      const respone = await api.get('/songs/'+id)
      if(respone.data.success){
        console.log(respone.data.song)
        setSelectedGenre(respone.data.song.genre._id)
        setSongTitle(respone.data.song.title)
        setSongText(respone.data.song.text)
        setSongArtist(respone.data.song.artist)
      }
    }catch(err){
      console.log(err)
    }
  }
  const addSong = async() => {
    formRef.current.querySelectorAll(".inputerror").forEach((error) => {
      error.innerText = "";
    })
    try{
      console.log(songTitle, songText, songArtist, selectedGenre)
      const response = await api.put('/songs/'+id+"/edit", {title: songTitle, text: songText, artist: songArtist, genre: selectedGenre})
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
            <input defaultValue={songTitle} onChange={(e)=>{setSongTitle(e.target.value)}} type="text" id="title" name="title" />
          </div>
          <div className="input">
            <label htmlFor="text">Text (with acords) <span className="inputerror" id="texterror"></span></label>
            <textarea defaultValue={songText} onChange={(e)=>{setSongText(e.target.value)}}  id="text" rows={5} name="text" />
          </div>
          <div className="input">
            <label htmlFor="artist">Artist <span className="inputerror" id="artisterror"></span></label>
            <input defaultValue={songArtist} onChange={(e)=>{setSongArtist(e.target.value)}} type="text" id="artist" name="artist" />
          </div>
          <div className="input">
              <span className="inputerror" id="genreerror"></span>
            <div className="genres">
              <label htmlFor="genre">Genre:  </label>
              <select onChange={(e)=>{setSelectedGenre(e.target.value)}} name="genre" id="genres">
                <option value=""></option>
                {genres.map((genre, i) => {
                  if(genre._id === selectedGenre){
                    return <option selected value={genre._id} key={genre._id}>{genre.name}</option>
                  }else{
                    return <option value={genre._id} key={genre._id}>{genre.name}</option>
                  }
                })}
              </select>
            </div>
          </div>
          <button onClick={addSong} className="formBtn">Edit song</button>
        </form>
      </div>
    </div>
  );
}
