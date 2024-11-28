import React, { useState } from 'react'
import "./profileHeader.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserPen } from '@fortawesome/free-solid-svg-icons'
import {  useNavigate } from 'react-router-dom'
import Modal from '../../Modal/Modal'
import '../../../pages/Registration/registration.scss'
import useToken from '../../../controllers/TokenController'
import { useSelector } from 'react-redux'

export default function ProfileHeader() {
  const navigate = useNavigate() 
  const [modalOpen, setModalOpen] = useState(false)
  const [isChangePassword, setIsChangePassword] = useState(false)
  const { getDecodedToken } = useToken()
  const favourites = useSelector(state => state.favourites.favourites)
  const openModal = () => {
    setModalOpen(true)
  }

  return (<section className="profileHeader">
    <FontAwesomeIcon className='userIcon link' icon={faUser} onClick={()=>{navigate("/profile")}} />
    <div className="userInfo">
      <div className="username">
        <h1 onClick={()=>{navigate("/profile")}} className='link'>{getDecodedToken()?.username}</h1>
      </div>
      <div className="info">
        <p>{localStorage.getItem("numberOfSongs") || "?"} songs</p>
        <span>-</span>
        <p>{localStorage.getItem("numberOfPlaylists") || "?"} playlists</p>
        <span>-</span>
        <p>{favourites.length} favourites</p>
      </div>
    </div>
       <FontAwesomeIcon onClick={openModal} className='userPenIcon link' icon={faUserPen} />

    {modalOpen && <Modal setModalOpen={setModalOpen}>
      <div className="modalChangeProfile registration">
      <div className="formDiv">
        <FontAwesomeIcon className="icon" icon={faUser} />
        <form onSubmit={(e) => {e.preventDefault();}}>
         {isChangePassword ? <div><div className="header">
            <h1>Change password</h1>
            <p onClick={() => setIsChangePassword(false)}  className="link">Change username</p>
          </div>
          <div className="input">
            <label htmlFor="username">Current Password</label>
            <input type="password" id="password" name="password" />
          </div> 
          <div className="input">
            <label htmlFor="username">New Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className="input">
            <label htmlFor="username">Confirm Password</label>
            <input type="password" id="password" name="password" />
          </div></div> : <div><div className="header">
            <h1>Change username</h1>
            <p onClick={() => setIsChangePassword(true)} className="link">Change password</p>
          </div>
          <div className="input">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div> </div>}
          <button className="formBtn">Change</button>
        </form>
      </div>
      </div>
      </Modal>}
  </section>
  )
}
