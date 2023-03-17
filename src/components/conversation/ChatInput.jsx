import { arrayUnion,doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React from 'react';
import {IoSend} from 'react-icons/io5'
import { useSelector } from 'react-redux';
import { firestore,storage } from '../../firebase/firebaseUtils';
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {v4 as uuid} from 'uuid';
import {BiImage} from 'react-icons/bi'
import { selectCurrentUser } from '../../redux/userReducer/userSelector';
import { selectConversationID, selectUserFriend } from '../../redux/conversationReducer/conversationSelector';


const ChatInput = () => {
  const combinedID = useSelector(state => selectConversationID(state));
  const currentUser = useSelector(state => selectCurrentUser(state));
  const userFriend = useSelector(state => selectUserFriend(state))
  const [text,setText] = React.useState("");
  const  [img,setImg] = React.useState(null);

  const handleSend = async () => {
    
    try {
      if(img) {
        const storageRef = ref(storage, uuid());
          
        const uploadTask = uploadBytesResumable(storageRef, img);
        
        
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
              
                break;
            }
          }, 
          (error) => {
            // setFormErrors({photoURL:error.message})
          }, 
          () => {
            
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log("UPDATING PROFILE BEGAN")
            
              await updateDoc(doc(firestore,"conversations",combinedID),{
                messages:arrayUnion({
                  id:uuid(),
                  text,
                  img:downloadURL,
                  senderID:currentUser.uid,
                  date:Timestamp.now(),
                  
                })
              })
        
        
              
            })
        
            
          }
        );
      }else{
        await updateDoc(doc(firestore,"conversations",combinedID),{
          messages:arrayUnion({
            id:uuid(),
            text,
            senderID:currentUser.uid,
            date:Timestamp.now()
          })
        })
      }
    } catch (error) {
      console.log(error)
    }
    await updateDoc(doc(firestore,"userChats",currentUser.uid),{
      [combinedID +".lastMessage"]:{text},
      [combinedID +".date"]:serverTimestamp()

    })
    await updateDoc(doc(firestore,"userChats",userFriend.uid),{
      [combinedID +".lastMessage"]:{text},
      [combinedID +".date"]:serverTimestamp()

    })
    setText("");
    setImg(null)
   
 
  }
  const handleEnter = async (e) => {
    if(e.code === "Enter"){
      try {
        if(img) {
          const storageRef = ref(storage, uuid());
            
          const uploadTask = uploadBytesResumable(storageRef, img);
          
          
          uploadTask.on('state_changed', 
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                
                  break;
              }
            }, 
            (error) => {
              // setFormErrors({photoURL:error.message})
            }, 
            () => {
              
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log("UPDATING PROFILE BEGAN")
              
                await updateDoc(doc(firestore,"conversations",combinedID),{
                  messages:arrayUnion({
                    id:uuid(),
                    text,
                    img:downloadURL,
                    senderID:currentUser.uid,
                    date:Timestamp.now(),
                    
                  })
                })
          
          
                
              })
          
              
            }
          );
        }else{
          await updateDoc(doc(firestore,"conversations",combinedID),{
            messages:arrayUnion({
              id:uuid(),
              text,
              senderID:currentUser.uid,
              date:Timestamp.now()
            })
          })
        }
      } catch (error) {
        console.log(error)
      }
      await updateDoc(doc(firestore,"userChats",currentUser.uid),{
        [combinedID +".lastMessage"]:{text},
        [combinedID +".date"]:serverTimestamp()
  
      })
      await updateDoc(doc(firestore,"userChats",userFriend.uid),{
        [combinedID +".lastMessage"]:{text},
        [combinedID +".date"]:serverTimestamp()
  
      })
      setText("");
      setImg(null)
    }
  }

  return (
    <div className="chat-input">
      <input onKeyDown={handleEnter} value={text} onChange={e => setText(e.target.value)} type="text" name="chat-input" id="chat-input" className="chat-input-control" placeholder='Type Something ....' >
        </input>
        <label className='img-label' htmlFor="img"><BiImage /></label>
        <input style={{"display":"none"}} onChange={e => setImg(e.target.files[0])} type="file" name="img" id="img" />
        <button  onClick={handleSend} className='send-msg-btn'><IoSend  /></button>
        
    </div>
  )
}

export default ChatInput;