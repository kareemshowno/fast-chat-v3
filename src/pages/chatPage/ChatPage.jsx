import React from 'react'
import { useSelector } from 'react-redux'
import Chats from '../../components/chats/Chats'
import Conversation from '../../components/conversation/Conversation'

import "./ChatPage.scss"
const ChatPage = () => {
 
  return (
    <div className="chat-page-container">
       
       <>       <Chats  />
       <Conversation  /></> 

    </div>
  )
}

export default ChatPage