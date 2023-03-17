import React from 'react'
import "./Landing.scss"
import { useNavigate } from 'react-router-dom'



const Landing = () => {

  const navigate = useNavigate();
  return (
    <div className='landing-page'>
      <div className="hero-text-col">
        <h3 > <span>Fast Chat -</span> where speed meets simplicity. <br /> Start a conversation
           and experience fast, efficient communication.  with friends, family,
            and colleagues from anywhere in the world.</h3>
       
        <button onClick={()=>navigate("/sign-up")} className='hero-text-btn'>Start Chatting</button>
      </div>
      <div className="hero-img-col">
        
        <img src="smartphone.svg" alt="" />
       
       
      </div>
    </div>
  )
}

export default Landing