import React from 'react'
import './skeleton.scss'

export function SongSkeleton({ count = 7 }) {
  return (
    <div className="songSkeletonList" aria-busy="true" aria-label="Loading songs">
      {Array.from({ length: count }).map((_, i) => (
        <div className="songSkeleton" key={i}>
          <div className="left">
            <span className="skeleton icon" />
            <div className="lines">
              <span className="skeleton title" style={{ width: `${45 + (i * 37) % 35}%` }} />
              <span className="skeleton artist" style={{ width: `${25 + (i * 23) % 20}%` }} />
            </div>
          </div>
          <span className="skeleton username" />
        </div>
      ))}
    </div>
  )
}

export function PlaylistSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div className="playlistSkeleton" key={i} aria-busy="true">
          <span className="skeleton img" />
          <span className="skeleton line" />
          <span className="skeleton line short" />
        </div>
      ))}
    </>
  )
}
