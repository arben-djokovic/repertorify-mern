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
import AreYouSure from '../../AreYouSure/AreYouSure'
import useToken from "../../../controllers/TokenController";

export default function ProfileHeader({ user, setUser }) {
  const { isAdmin } = useToken();
  const navigate = useNavigate() 
  const formRef = useRef()
  const [modalOpen, setModalOpen] = useState(false)
  const [isChangePassword, setIsChangePassword] = useState(false)
  const [areYouSure, setAreYouSure] = useState(false)
  const [areYouSure2, setAreYouSure2] = useState(false)
  const favourites = useSelector(state => state.favourites.favourites)
  const openModal = () => {
    setModalOpen(true)
  }

  const blockUser = async() => {
    try{
      const response = await api.put("/users/block/" + user._id)
      if(response.data.success){
        setUser(response.data.user)
      }
    }catch(err){
      console.log(err)
    }
  }

  const unblockUser = async() => {
    try{
      const response = await api.put("/users/unblock/" + user._id)
      if(response.data.success){
        setUser(response.data.user)
      }
    }catch(err){
      console.log(err)
    }
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
        <h1 onClick={()=>{navigate("/profile")}} className='link'>{user.username}</h1>
      </div>
      {user._id === localStorage.getItem("userid") && 
      <div className="info">
        <p>{localStorage.getItem("numberOfSongs") || "?"} songs</p>
        <span>-</span>
        <p>{localStorage.getItem("numberOfPlaylists") || "?"} playlists</p>
        <span>-</span>
        <p>{favourites.length} favourites</p>
      </div>}
    </div>
    {user._id === localStorage.getItem("userid") ? <FontAwesomeIcon onClick={openModal} className='userPenIcon link' icon={faUserPen} /> : (isAdmin() ? (user?.isBlocked ? <div onClick={()=> setAreYouSure2(true)} className='unblock'>unblock</div> : <div onClick={()=> setAreYouSure(true)} className='block'>block</div>) : <></>)}

    {user._id === localStorage.getItem("userid") && modalOpen && <Modal setModalOpen={setModalOpen}>
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

    {isAdmin() && user._id !== localStorage.getItem("userid") && areYouSure && <AreYouSure setModalOpen={setAreYouSure} onYes={blockUser}/>}
    {isAdmin() && user._id !== localStorage.getItem("userid") && areYouSure2 && <AreYouSure setModalOpen={setAreYouSure2} onYes={unblockUser}/>}
  </section>
  )
}
