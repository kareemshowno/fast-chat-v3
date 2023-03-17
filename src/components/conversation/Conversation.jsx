import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserFriend } from '../../redux/conversationReducer/conversationSelector'
import ChatInput from './ChatInput'
import "./Conversation.scss"
import ConversationHeader from './ConversationHeader'
import Messages from './Messages'
import SelectUserUi from './selectUserUi/SelectUserUi'
const Conversation = () => {
  const user = useSelector(state => selectUserFriend(state));
  
  return (
    <div className="conversation-container">
     {user ?
     <>
     <ConversationHeader />
     <Messages />
     <ChatInput /></>  :
       <SelectUserUi />}
    </div>
  )
}

export default Conversation