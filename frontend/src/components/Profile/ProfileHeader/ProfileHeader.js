import React, { useState } from 'react'
import "./profileHeader.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserPen } from '@fortawesome/free-solid-svg-icons'
import {  useNavigate } from 'react-router-dom'
import Modal from '../../Modal/Modal'
import '../../../pages/Registration/registration.scss'

export default function ProfileHeader() {
  const navigate = useNavigate() 
  const [modalOpen, setModalOpen] = useState(false)
  const [isChangePassword, setIsChangePassword] = useState(false)
  const openModal = () => {
    setModalOpen(true)
  }

  return (<section className="profileHeader">
    <FontAwesomeIcon className='userIcon link' icon={faUser} onClick={()=>{navigate("/profile")}} />
    <div className="userInfo">
      <div className="username">
        <h1 onClick={()=>{navigate("/profile")}} className='link'>lazov123</h1>
        <FontAwesomeIcon onClick={openModal} className='userPenIcon link' icon={faUserPen} />
      </div>
      <div className="info">
        <p>8 playlists</p>
        <span>-</span>
        <p>3 songs</p>
        <span>-</span>
        <p>12 favourites</p>
      </div>
    </div>

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
