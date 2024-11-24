import React, { useEffect, useState } from "react";
import "./songs.scss";
import SongItem from "../../components/SongItem/SongItem";
import api from "../../api/api";

export default function Songs() {
  const [genres, setGenres] = useState([])

  const fetchGenres = async() => {
    try{
      const respone = await api.get('/genres')
      setGenres(respone.data.genres)
    }catch(err){
      console.log(err)
    }
  }

  
  useEffect(() => {
    fetchGenres()
  })

  return (
    <section className="songs page pageContent">
      <div className="songsHeader">
        <h1>Songs:</h1>
        <div className="genres">
          <label htmlFor="genres">Genre:</label>
          <select name="genres" id="genres">
            <option value=""></option>
            {genres.map((genre, i) => (
              <option value={genre} key={genre._id}>{genre.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="songsList">
        {[
          1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        ].map((song, i) => (
          <SongItem song={song} key={i} i={i} />
        ))}
      </div>
      <button to="/songs" className="moreBtn">Show more...</button>
    </section>
  );
}
