import React from 'react'
import './RequestAlert.scss'
import {BiBell} from 'react-icons/bi'
import { useSelector,useDispatch } from 'react-redux'
import { updateRequestMessage } from '../../../redux/requestReducer/requestMSlice'
const RequsetAlert = () => {
const requestMessage = useSelector(state => state.requestM.requestMessage);
const dispatch = useDispatch()
  return (
     <div className={`${requestMessage ? "request-modal":"hide"}`}>
        <div className="request-alert-box">
        <span onClick={() => dispatch(updateRequestMessage(null))} className={`${requestMessage ? "close":"hide"}`}>&#10006;</span>

        <div className="request-alert-box-body">
        <div className="msg-icon">
            <BiBell />
         </div>
         <div className="msg-text">
            <h5>{requestMessage}</h5>
         </div>
        </div>
   
         <div className="modal-btn">
            <button onClick={() => dispatch(updateRequestMessage(null))} className='modal-close-btn'>Close</button>
         </div>
        </div>
     </div>
  )
}

export default RequsetAlert