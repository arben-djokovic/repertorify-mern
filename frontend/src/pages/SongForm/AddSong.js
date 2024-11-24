import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "./songForm.scss";
import api from "../../api/api";

export default function AddSong() {
  const [genres, setGenres] = useState([])
  const formRef = useRef(null)

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
        genre: String(formData.get("genres")),
        // user: 
      };
      try{
        const response = await api.post('/songs/', songData)
        console.log(response)
      }catch(err){
        console.log(err)
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
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" />
          </div>
          <div className="input">
            <label htmlFor="text">Text (with acords)</label>
            <textarea  id="text" rows={5} name="text" />
          </div>
          <div className="input">
            <label htmlFor="artist">Artist</label>
            <input type="text" id="artist" name="artist" />
          </div>
          <div className="input">
            <div className="genres">
              <label htmlFor="genres">Genre:</label>
              <select name="genres" id="genres">
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
