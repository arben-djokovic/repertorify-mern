import React, { useRef, useState } from 'react'
import "./profileHeader.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserPen } from '@fortawesome/free-solid-svg-icons'
import {  useNavigate } from 'react-router-dom'
import Modal from '../../Modal/Modal'
import '../../../pages/Registration/registration.scss'
import { useSelector } from 'react-redux'
import api from '../../../api/api'
import { toast } from 'react-toastify'

export default function ProfileHeader() {
  const navigate = useNavigate() 
  const formRef = useRef()
  const [modalOpen, setModalOpen] = useState(false)
  const [isChangePassword, setIsChangePassword] = useState(false)
  const favourites = useSelector(state => state.favourites.favourites)
  const openModal = () => {
    setModalOpen(true)
  }

  const changeMe = async() => {
    const data = new FormData(formRef.current);
    if(isChangePassword){
      const currentPassword = data.get("currentPassword")
      const newPassword = data.get("newpassword")
      const confirmNewPassword = data.get("confrimpassword")
      
      if(newPassword !== confirmNewPassword){
        return toast.error("Passwords don't match")
      }
      if(newPassword.length < 5 || newPassword.length > 20) return toast.error("Password must be between 5 and 20 characters")
      try{
        const response = await api.put("/users/change-password", { oldPassword: currentPassword, newPassword: newPassword })
        if(!response.data.success){
          toast.error(response.data.message)
          return
        }
        console.log(response)
        toast.success("Password changed")
        navigate("/profile")
      }catch(err){
        console.log(err)
      }
    }else{
      const username = data.get("username");
      if(username.length < 3 || username.length > 10) return toast.error("Username must be between 3 and 10 characters")
      try{
        const response = await api.put("/users/change-username", {username})
        if(!response.data.success) return
        
          toast.success("Username changed")
        localStorage.setItem("username", username)
        navigate("/profile")
      }catch(err){
        console.log(err)
        if(err.response?.data?.errors){
          toast.error(err.response.data.errors[0].message)
        }
      }
    }
  }

  return (<section className="profileHeader">
    <FontAwesomeIcon className='userIcon link' icon={faUser} onClick={()=>{navigate("/profile")}} />
    <div className="userInfo">
      <div className="username">
        <h1 onClick={()=>{navigate("/profile")}} className='link'>{localStorage.getItem("username")}</h1>
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
        <form ref={formRef} onSubmit={(e) => {e.preventDefault();}}>
         {isChangePassword ? <div><div className="header">
            <h1>Change password</h1>
            <p onClick={() => setIsChangePassword(false)}  className="link">Change username</p>
          </div>
          <div className="input">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" name="currentPassword" />
          </div> 
          <div className="input">
            <label htmlFor="newpassword">New Password</label>
            <input type="password" id="newpassword" name="newpassword" />
          </div>
          <div className="input">
            <label htmlFor="confrimpassword">Confirm Password</label>
            <input type="password" id="confrimpassword" name="confrimpassword" />
          </div></div> : <div><div className="header">
            <h1>Change username</h1>
            <p onClick={() => setIsChangePassword(true)} className="link">Change password</p>
          </div>
          <div className="input">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" />
          </div> </div>}
          <button onClick={changeMe} className="formBtn">Change</button>
        </form>
      </div>
      </div>
      </Modal>}
  </section>
  )
}
