import React from 'react'
import {BiBell} from 'react-icons/bi'
import "./Hint.scss"

const Hint = () => {
   
    const [hint,setHint] = React.useState(true);

  return (
    <div className={`${hint ? "hint-modal":"hide"}`}>
    <div className="hint-alert-box">
    <span onClick={() => setHint(false)} className={`${hint ? "close":"hide"}`}>&#10006;</span>

    <div className="hint-alert-box-body">
    <div className="msg-icon">
        <BiBell />
     </div>
     <div className="msg-text">
        <h5><span>Attention:</span> <br /> <br /> This application uses firebase and google cloud which  might be blocked in some countries! <br />
        you should use a VPN if you had problems regarding sign up , sign in or chatting. </h5>
     </div>
    </div>

     <div className="modal-btn">
        <button onClick={() => setHint(false)} className='modal-close-btn'>Close</button>
     </div>
    </div>
 </div>
  )
}

export default Hint