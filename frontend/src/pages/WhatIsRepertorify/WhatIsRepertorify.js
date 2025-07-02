import { Link } from 'react-router-dom'
import './whatIsRepertorify.scss'
import { Helmet } from "react-helmet-async";

export default function WhatIsRepertorify() {
    return (<div className='whatIsRepertorify'>
        <Helmet>
            <title>Repertorify – Tvoj digitalni repertoar za gitaru</title>
            <meta
                name="description"
                content="Repertorify ti donosi pjesme sa akordima i tekstovima, jednostavno transponovanje i pravljenje plejliste."
            />
            <meta property="og:title" content="Repertorify – Tvoj digitalni repertoar za gitaru" />
            <meta
                property="og:description"
                content="Repertorify ti donosi pjesme sa akordima i tekstovima, jednostavno transponovanje i pravljenje plejliste."
            />
            <meta property="og:url" content={window.location.href} />
        </Helmet>
        <div className="about-container">
            <h1 className="about-title">🎸 Welcome to Repertorify</h1>

            <p className="about-text">
                <strong>Repertorify</strong> is built for everyone who loves playing the guitar. It helps you find songs with chords, transpose them easily, and organize your personal repertoire.
            </p>

            <h2 className="about-subtitle">🔍 What can you do on Repertorify?</h2>
            <ul className="about-list">
                <li><strong>Browse songs with chords</strong> – Find songs complete with lyrics and guitar chords.</li>
                <li><strong>Transpose chords with one click</strong> – Change the key instantly to match your voice or instrument.</li>
                <li><strong>Create custom playlists</strong> – Save and organize your favorite songs (for registered users).</li>
                <li><strong>Add your own songs</strong> – Share your music with others and grow the community.</li>
                <li><strong>Distraction-free design</strong> – Clean interface optimized for all devices.</li>
            </ul>

            <h2 className="about-subtitle">🚀 Get started now</h2>
            <p className="about-text">
                You can <Link to="/songs">browse songs </Link> without an account. To save playlists or add your own songs, simply <Link to="/signup">create a free account</Link>.
            </p>

            <p className="about-footer">
                🎶 <strong>Repertorify</strong> – your digital songbook for chords and lyrics. Everything you need to play, all in one place.
            </p>
        </div>
    </div>
    )
}
