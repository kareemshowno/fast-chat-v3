import { doc, onSnapshot } from 'firebase/firestore';
import React from 'react'
import { useSelector } from 'react-redux';
import { firestore } from '../../firebase/firebaseUtils';
import { selectConversationID, selectUserFriend } from '../../redux/conversationReducer/conversationSelector';
import { selectCurrentUser } from '../../redux/userReducer/userSelector';
import Message from './Message'

const Messages = () => {
  const [messages,setMessages] = React.useState([]);
  const currentUser = useSelector(state => selectCurrentUser(state))
  const combinedID = useSelector(state => selectConversationID(state));
  const userFriend = useSelector(state => selectUserFriend(state))

  React.useEffect(() => {
    
    if(combinedID ){
      const unSubFromMessages  = onSnapshot(doc(firestore,"conversations",combinedID), (doc) => {
    doc.exists() && setMessages(doc.data().messages)
    return () => unSubFromMessages();
  })}
  
  },[combinedID])
  return (
  
    <div className="messages">
      {userFriend ?  messages.map(m => {
        
        return  <Message key={m.id} messageType={m.senderID === currentUser.uid ? "sender":"reciever"} time={m.date.seconds} contentImg={m.img} content={m.text} />
        
      }) :<></>}
     
        
       
        
    </div>
  
    

  )
}

export default Messages