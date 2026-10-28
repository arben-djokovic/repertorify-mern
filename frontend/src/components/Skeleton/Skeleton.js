import React from 'react'
import './skeleton.scss'

// Class names are prefixed with "sk-" so global page styles (e.g. .artist, .title) can't leak in
export function SongSkeleton({ count = 7 }) {
  return (
    <div className="sk-songList" aria-busy="true" aria-label="Loading songs">
      {Array.from({ length: count }).map((_, i) => (
        <div className="sk-song" key={i}>
          <div className="sk-songLeft">
            <span className="skeleton sk-songIcon" />
            <div className="sk-songLines">
              <span className="skeleton sk-songTitle" style={{ width: `${30 + (i * 37) % 25}%` }} />
              <span className="skeleton sk-songArtist" style={{ width: `${15 + (i * 23) % 12}%` }} />
            </div>
          </div>
          <span className="skeleton sk-songUser" />
        </div>
      ))}
    </div>
  )
}

export function PlaylistSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div className="sk-playlist" key={i} aria-busy="true">
          <span className="skeleton sk-playlistImg" />
          <span className="skeleton sk-playlistLine" />
          <span className="skeleton sk-playlistLine sk-short" />
        </div>
      ))}
    </>
  )
}
