import React, { useRef, useState } from 'react'
import './genreForm.scss'
import api from '../../api/api'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function CreateGenre() {
  const [genre, setGenre] = useState('');
  const navigate = useNavigate();
  const formRef = useRef();

  const createGenre = async() => {
    if(genre.length < 2 || genre.length > 20){
      document.getElementById('genreerror').innerText = 'Genre must be between 2 and 20 characters long.'
    }
    try{
      const respone = await api.post('/genres', {name: genre})
      if(respone.data.success){
        toast.success("Genre created")
        navigate("/songs")
      }
      console.log(respone)
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

  return (
    <div className="registrationGenre page pageContent">
      <div className="formDiv">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          ref={formRef}
        >
          <div className="header">
            <h1>Create genre</h1>
          </div>
          <div className="input">
            <label htmlFor="title">Genre: <span className="inputerror" id="nameerror"></span></label>
            <input onChange={(e) => setGenre(e.target.value)} value={genre} type="text" id="name" name="genre" />
          </div>
          <button onClick={createGenre} className="formBtn">Create genre</button>
        </form>
      </div>
    </div>
  )
}
