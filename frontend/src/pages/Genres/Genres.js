import React from 'react'
import './genres.scss'
import { useState } from 'react'
import { useEffect } from 'react';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import AreYouSure from '../../components/AreYouSure/AreYouSure';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Genres() {
  const [genres, setGenres] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [genreId, setGenreId] = useState(null)

  const deleteGenre = async() => {
    console.log("deleting genre", genreId)
    if(genreId){
      try{
        const reponse = await api.delete('/genres/'+genreId)
        if(reponse.data.success){
          document.querySelector(`#a${genreId}`).remove()
          setGenreId(null)
          toast.success("Genre deleted")
        }
      }catch(err){
        console.log(err)
      }
    }
  }

  useEffect(() => {
    const fetchGenres = async() => {
      try{
        const reponse = await api.get('/genres')
        setGenres(reponse.data.genres)

      }catch(err){
        console.log(err)
      }
    }
    fetchGenres()
  }, [])
  return (  
    <div className='genres'>
      <Link to="/genre/create"><button>Add new genre</button></Link>
        <ul>
          {genres.map(genre => (
            <li id={"a"+genre._id} key={genre._id}>
              <p>{genre.name}</p>
              <div className="icons">
                <Link to={`/genre/edit/${genre._id}`} ><FontAwesomeIcon icon={faEdit} /></Link>
                <FontAwesomeIcon onClick={() => {setGenreId(genre._id); setModalOpen(true)}} icon={faTrash} />
              </div>
            </li>
          ))}
        </ul>
        {modalOpen && <AreYouSure onYes={deleteGenre} setModalOpen={setModalOpen} />}
    </div>
  )
}
