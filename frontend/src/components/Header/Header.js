import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./header.scss"
import { isAuthenticated, logout } from '../../controllers/TokenController';

export default function Header() {
    const searchFromUrl = window.location.search.slice(1).split(/[&?]/).filter(el => el.includes('search'))[0]?.split('=')[1]
    const navigate = useNavigate()
    const formRef = useRef();
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    const searchSongs = async () => {
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData);
        navigate(`/songs?search=${data["input"]}`)
    }

  return (
    <header className='header '>
        <section className="top">
            <Link to="/about-us">What is Repertorify? </Link>
            {isAuthenticated() ? <div className="sign">
                <Link to="/profile">lazo123</Link>
                <span> | </span>
                <Link onClick={()=>{logout(navigate)}} className='delete'>Log out</Link>
            </div> :<div className="sign">
                <Link to="/login">Log In</Link>
                <span> | </span>
                <Link to="/signup">Sign Up</Link>
            </div>}
        </section>
        <section className="mainHeader">
            <img className='logo' onClick={()=>{navigate("/")}} src="/assets/logo.png" alt="" />
            <form ref={formRef} onSubmit={(e) => {e.preventDefault();}} className="search">
                <input defaultValue={(searchFromUrl) ? searchFromUrl : ''} onChange={(e) => (e.target.value)} type="text" name='input' placeholder='Search for songs...' />
                <button onClick={searchSongs} className='searchBtn'>Search</button>
            </form>
        </section>
        <section className="abc">
            <div className="letters" >
                {letters.map((letter, index) => (
                    <p key={index} className="letter">
                        {letter}
                    </p>
                ))}
            </div>
        </section>
    </header>
  )
}
