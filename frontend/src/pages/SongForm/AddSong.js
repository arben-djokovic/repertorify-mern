import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./songForm.scss";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useToken from "../../controllers/TokenController";

export default function AddSong() {
  const { getDecodedToken } = useToken();
  const [genres, setGenres] = useState([])
  const formRef = useRef(null)
  const navigate = useNavigate()

  const fetchGenres = async() => {
    try{
      const respone = await api.get('/genres')
      setGenres(respone.data.genres)
    }catch(err){
      console.log(err)
    }
  }

  const addSong = async() => {
    const formData = new FormData(formRef.current);
    if (formRef.current) {
      if (!formRef.current.reportValidity()) return;
      const songData = {
        title: String(formData.get("title")),
        text: String(formData.get("text")),
        artist: String(formData.get("artist")),
        genre: String(formData.get("genre")),
        user: getDecodedToken()._id
      };
      console.log(getDecodedToken()._id)
      formRef.current.querySelectorAll(".inputerror").forEach((error) => {
        error.innerText = "";
      })
      try{
        const response = await api.post('/songs/', songData)
        console.log(response)
        if(response.data.success){
          localStorage.setItem("numberOfSongs", Number(localStorage.getItem("numberOfSongs")) + 1);
          toast.success(response.data.message)
          navigate(`/songs/${response.data.song._id}`)
        }
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
  }

  
  useEffect(() => {
    fetchGenres()
  })

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
            <h1>Add Song</h1>
          </div>
          <div className="input">
            <label htmlFor="title">Title <span className="inputerror" id="titleerror"></span></label>
            <input type="text" id="title" name="title" />
          </div>
          <div className="input">
            <label htmlFor="text">Text (with acords) <span className="inputerror" id="texterror"></span></label>
            <textarea onChange={(e) => e.target.style.height = e.target.scrollHeight + "px"} id="text" rows={5} name="text" />
          </div>
          <div className="input">
            <label htmlFor="artist">Artist <span className="inputerror" id="artisterror"></span></label>
            <input type="text" id="artist" name="artist" />
          </div>
          <div className="input">
              <span className="inputerror" id="genreerror"></span>
            <div className="genres">
              <label htmlFor="genre">Genre:  </label>
              <select name="genre" id="genres">
                <option value=""></option>
                {genres.map((genre, i) => (
                  <option value={genre._id} key={genre._id}>{genre.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={addSong} className="formBtn">Add song</button>
        </form>
      </div>
    </div>
  );
}
