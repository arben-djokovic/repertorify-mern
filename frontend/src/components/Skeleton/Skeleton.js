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

// Plain text bars, e.g. song text or a list of names; widths cycle so lines look natural
export function LinesSkeleton({ count = 5, height = 10, gap = 8, widths = [70, 55, 80, 45, 65, 50] }) {
  return (
    <div className="sk-lines" style={{ gap }} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <span className="skeleton" key={i} style={{ height, width: `${widths[i % widths.length]}%` }} />
      ))}
    </div>
  )
}

// Placeholder for a form field (input, textarea, image picker) while its value loads
export function FieldSkeleton({ height = 38, width = "100%", radius = 15 }) {
  return <span className="skeleton" aria-busy="true" style={{ height, width, borderRadius: radius }} />
}

// Small rows for the right sidebar
export function SidebarSkeleton({ count = 5 }) {
  return (
    <div className="sk-sidebar" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="sk-sidebarRow" key={i}>
          <span className="skeleton sk-sidebarIcon" />
          <span className="skeleton sk-sidebarLine" style={{ width: `${50 + (i * 17) % 35}%` }} />
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
