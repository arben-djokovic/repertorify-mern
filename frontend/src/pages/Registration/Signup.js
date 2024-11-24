import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./registration.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";

export default function Signup() {
  const formRef = React.createRef();
  const navigate = useNavigate();


  const signupValidation = ({username, password, repeatpassword, checkbox}) => {
    
    formRef.current.querySelector(`#usernameerror`).innerText = "";
    formRef.current.querySelector(`#passworderror`).innerText = "";
    formRef.current.querySelector(`#repeatpassworderror`).innerText = "";

    let isGood = true
    if(username.length < 3 || username.length > 20){
      formRef.current.querySelector(`#usernameerror`).innerText = "*Username must be between 3 and 20 characters";
      isGood = false
    }

    if(password.length < 5 || password.length > 20){
      formRef.current.querySelector(`#passworderror`).innerText = "*Password must be between 5 and 20 characters";
      isGood = false
    }
    if (password !== repeatpassword) {
      formRef.current.querySelector(`#repeatpassworderror`).innerText = "*Passwords do not match";
      isGood = false
    } 
    if(checkbox !== "on"){
      toast.error("You must accept the terms and conditions")
      isGood = false
    }
    return isGood
  }
  const signUp = async() => {
    const data = new FormData(formRef.current);
    const username = data.get("username");
    const password = data.get("password");
    const repeatpassword = data.get("repeatpassword");
    const checkbox = data.get("checkbox");


    if(!signupValidation({username, password, repeatpassword, checkbox})) return
    
    try{
      const response = await api.post('/signup/', {username, password});
      if(response.data.success){
        toast.success(response.data.message);
        navigate("/login")
      }
      console.log(response)
    }catch(err){
      console.log(err)
      if(err.response?.data?.errors){
        toast.error(err.response.data.message)
        err.response.data.errors.forEach((error) => {
           const errorSpan = formRef.current.querySelector(`#${error.field}error`)
           if(errorSpan){
            errorSpan.innerText = `*${error.message}`
           }
        })
      }
    }
  }

  return (
    <div className="registration page pageContent">
      <div className="formDiv">
        <FontAwesomeIcon className="icon" icon={faUser} />
        <form ref={formRef} onSubmit={(e) => {e.preventDefault();}}>
          <div className="header">
            <h1>Sign up</h1>
            <Link to="/login" className="link">Log in</Link>
          </div>
          <div className="input">
            <label htmlFor="username">Username <span className="inputerror" id="usernameerror"></span></label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input">
            <label htmlFor="password">Password <span className="inputerror" id="passworderror"></span></label>
            <input type="password" id="password" name="password" />
          </div>
          <div className="input">
            <label htmlFor="repeatpassword">Repeat Password <span className="inputerror" id="repeatpassworderror"></span></label>
            <input type="password" id="repeatpassword" name="repeatpassword" />
          </div>
          <p className="terms"> <input type="checkbox" id="checkbox" name="checkbox" /> <label htmlFor="checkbox">I agree to <span className="blue link">Teams of Use</span>  and <span className="blue link">Privacy Policy</span></label> </p>
          <button onClick={signUp} className="formBtn">Sign up</button> 
        </form>
      </div>
    </div>
  );
}
