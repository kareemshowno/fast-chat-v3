import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserFriend } from '../../redux/conversationReducer/conversationSelector';
import { selectCurrentUser } from '../../redux/userReducer/userSelector';
import "./Conversation.scss"
const Message = ({messageType,content,time,contentImg}) => {
  const currentUser= useSelector(state => selectCurrentUser(state));
  const userFriend = useSelector(state => selectUserFriend(state))
  const timeInHours = Number(new Date(time*1000).getHours()) ;
  const timeInMinutes = Number(new Date(time*1000).getMinutes())

  const ref = React.useRef();
  React.useEffect(() => {
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[messageType])


  return (
    <div ref={ref} className={`message ${messageType === "sender" ? 'message-owner':""}`}>
      
        <div className="message-sender">
            <img src={messageType === "sender" ? currentUser.photoURL : userFriend.photoURL} alt="" />
            <span className="message-time">
              {timeInHours  <=  12 ? timeInHours  + `:${timeInMinutes} AM`: timeInHours  + `:${timeInMinutes} PM`}</span>
        </div>
        <div className="message-content">
     <p>{content}</p>  
     {contentImg ? <img src={contentImg} alt="fast-chat-random" />:""}
        </div>
    </div>
  )
}

export default Message