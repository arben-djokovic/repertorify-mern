import React, { useRef, useState } from 'react'
import './genreForm.scss'
import api from '../../api/api'
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from 'react';
import { Helmet } from "react-helmet-async";

export default function EditGenre() {
  const [genre, setGenre] = useState('');
  const navigate = useNavigate();
  const formRef = useRef();
  const { id } = useParams();

  const getGenre = async() => {
    try{
      const respone = await api.get(`/genres/${id}`)
      setGenre(respone.data.genre.name)
    }catch(err){
      console.log(err)
    }
  }

  const editGenre = async() => {
    if(genre.length < 2 || genre.length > 20){
      document.getElementById('genreerror').innerText = 'Genre must be between 2 and 20 characters long.'
    }
    try{
      const respone = await api.put(`/genres/${id}/edit`, {name: genre})
      if(respone.data.success){
        toast.success("Genre edited")
        navigate("/genres")
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

  useEffect(() => {
    getGenre()
  }, [])

  return (
    <div className="registrationGenre page pageContent">
      <Helmet>
        <title>Edit Genre Details | Repertorify Admin</title>
        <meta
          name="description"
          content="Update existing music genre information on Repertorify. Keep genres accurate and organized for a seamless user experience."
        />
      </Helmet>
      <div className="formDiv">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          ref={formRef}
        >
          <div className="header">
            <h1>Edit genre</h1>
          </div>
          <div className="input">
            <label htmlFor="title">Genre: <span className="inputerror" id="genreerror"></span></label>
            <input onChange={(e) => setGenre(e.target.value)} value={genre} type="text" id="name" name="genre" />
          </div>
          <button onClick={editGenre} className="formBtn">Edit genre</button>
        </form>
      </div>
    </div>
  )
}
