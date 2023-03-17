import React from "react";
import "./Chats.scss";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../../firebase/firebaseUtils";
import { useDispatch, useSelector } from "react-redux";
import { updateChats } from "../../redux/chatsReducer/chatsSlice";
import {
  changeConv,
  updateConvID,
} from "../../redux/conversationReducer/conversationSlice";
import { selectChats } from "../../redux/chatsReducer/chatSelector";
import { selectCurrentUser } from "../../redux/userReducer/userSelector";
import { updateRequestMessage } from "../../redux/requestReducer/requestMSlice";
import { BiChat } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import userAvatar from "../userAvatar/userAvatar.png";

const Chats = () => {
  const [searchField, setSearchField] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [searchErr, setSearchErr] = React.useState(false);
  const [chatMenu, setChatMenu] = React.useState(false);

  const currentUser = useSelector((state) => selectCurrentUser(state));
  const chats = useSelector((state) => selectChats(state));

  const dispatch = useDispatch();

  React.useEffect(() => {
    let unSubFromChats = null;
    if (currentUser) {
      unSubFromChats = onSnapshot(
        doc(firestore, "userChats", currentUser.uid),
        (doc) => {
          const data = doc.data();
          dispatch(updateChats(data));
        }
      );
    }
    return () => unSubFromChats();
  }, [dispatch,currentUser, currentUser.uid]);

  const searchForUsers = async () => {
    const q = query(
      collection(firestore, "users"),
      where("displayName", "==", searchField)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((user) => {
        setUser(user.data());
      });
    } catch (error) {
      dispatch(updateRequestMessage(`an error occurred: ${error.message}`));
    }
  };
  const handleClick = async (e) => {
    if (e.code === "Enter") {
      try {
        await searchForUsers();
      } catch (error) {
        setSearchErr(error.message)
      }
    }
  };

  const handleSelect = async () => {
    //check if there is a conversation between the two if not start a new one (new document)
    const combinedID =
      currentUser.id > user.uid
        ? currentUser.id + user.uid
        : user.uid + currentUser.id;

    const conversationRef = doc(firestore, "conversations", combinedID);
    const res = await getDoc(conversationRef);

    try {
      if (!res.exists()) {
        await setDoc(conversationRef, { messages: [] });

        // creating a new chat between two users
        //1 first creating our end for the cha

        await updateDoc(doc(firestore, "userChats", currentUser.uid), {
          [`${combinedID}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedID}.date`]: serverTimestamp(),
        });

        //2 creating the other user end of the chat
        await updateDoc(doc(firestore, "userChats", user.uid), {
          [`${combinedID}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedID}.date`]: serverTimestamp(),
        });
      }
    } catch (error) {
      dispatch(updateRequestMessage(`an error occurred:  ${error.text}`));
    }
    setUser(null);
    setSearchField("");
  };

  return (
    <div
      className={`chats-container ${chatMenu ? "chats-container-mobile" : ""} `}
    >
      

      {/* {user ? console.log(user):console.log("not yet fetched user")} */}
      <div className="chat-nav">
        <div className="user-info">
          <img
            src={currentUser.photoURL ? currentUser.photoURL : userAvatar}
            alt={`fast-chat-${currentUser?.displayName}`}
          />
          <p className="user-name">{currentUser?.displayName}</p>
        </div>
        <div className="chat-menu">
          <BiChat onClick={() => setChatMenu(!chatMenu)} />
        </div>
      </div>
      <div
        className={`chats-container-body ${
          chatMenu ? "chats-container-body-mobile" : ""
        }`}
      >
        <div className="chat-search">
          <div className="search-container">
            <input
              className="search-control"
              value={searchField}
              onKeyDown={handleClick}
              onChange={(e) => setSearchField(e.target.value)}
              placeholder="Search for users"
              type="search"
              name="search"
              id="search"
            />
            <FaSearch onClick={handleClick} className="searchIcon" />
          </div>
          <p className={`${searchErr ? "" : "hide"}`}>{searchErr}</p>
        </div>
        <div
          className={`searchedChats ${chatMenu ? "searchedChatsMobile" : ""}`}
        >
          {user ? (
            <div className="chatUser" onClick={handleSelect}>
              <img src={user.photoURL} alt="fast-chat-user" />
              <p>{user.displayName}</p>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className={`chats ${chatMenu ? "chatsMobile" : ""}`}>
          {chats
            ? chats.map((chat) => {
                return (
                  <div
                    key={chat[0]}
                    className="chat"
                    onClick={() =>
                      dispatch(
                        changeConv(chat[1].userInfo),
                        dispatch(
                          updateConvID(
                            currentUser.uid > chat[1].userInfo.uid
                              ? currentUser.uid + chat[1].userInfo.uid
                              : chat[1].userInfo.uid + currentUser.uid
                          )
                        )
                      )
                    }
                  >
                    <img
                      src={
                        chat[1].userInfo.photoURL
                          ? chat[1].userInfo.photoURL
                          : userAvatar
                      }
                      alt="user-fast-chat"
                    />

                    <div className="dm">
                      <p>{chat[1].userInfo.displayName}</p>
                      <span>- {chat[1].lastMessage?.text}</span>
                    </div>
                  </div>
                );
              })
            : "there is no chats right now"}
        </div>
      </div>
    </div>
  );
};

export default Chats;
