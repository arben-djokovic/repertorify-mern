import React from 'react'
import './genreSelect.scss'

export default function GenreSelect({ genres, selected, setSelected }) {
  const toggleGenre = (id) => {
    setSelected(selected.includes(id) ? selected.filter(g => g !== id) : [...selected, id])
  }

  return (
    <div className="genreSelect">
      {genres.map(genre => (
        <button
          type="button"
          key={genre._id}
          className={selected.includes(genre._id) ? "genreChip active" : "genreChip"}
          onClick={() => toggleGenre(genre._id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}
