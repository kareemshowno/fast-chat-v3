import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserFriend } from '../../redux/conversationReducer/conversationSelector'
import { changeConv, updateConvID } from '../../redux/conversationReducer/conversationSlice';
import userAvatar from "../userAvatar/userAvatar.png"

import "./Conversation.scss"
const ConversationHeader = () => {
  const user = useSelector(state => selectUserFriend(state));
const dispatch = useDispatch()
  return (
    <div className="conversation-header">
        <div className="conv-user">
            <img src={user?.photoURL ? user.photoURL:userAvatar} alt="fast-chat-user" />
            <p>{user? user.displayName : "select user"}</p>    
  
        </div>
        <div className="conv-nav">
        <button  onClick={() => dispatch(changeConv(null),dispatch(updateConvID("")))}  className='conv-close'>
              
             <span></span>
               <span></span>
                 <span></span>
           </button>
        </div>
    </div>
  )
}

export default ConversationHeader