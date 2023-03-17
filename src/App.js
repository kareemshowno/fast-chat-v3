import React from 'react';
import Navbar from './components/navbar/Navbar';
import './App.scss';
import Landing from './pages/landingPage/Landing';
import { Navigate, Route, Routes } from 'react-router-dom';
import {onAuthStateChanged} from 'firebase/auth';
import { auth, createUserProfileDocument } from './firebase/firebaseUtils';
import { onSnapshot } from 'firebase/firestore';
import Spinner from './components/re-usable/spinner/Spinner';
import RequsetAlert from './components/re-usable/request-alert/RequsetAlert';

import { updateUser } from './redux/userReducer/userSlice';
import { useSelector,useDispatch } from 'react-redux';
import { selectCurrentUser } from './redux/userReducer/userSelector';



const Signup = React.lazy(() => import ('./pages/register/Signup'))
const SignIn = React.lazy(() => import ('./pages/sign-in/SignIn'));
const ChatPage = React.lazy(() => import ('./pages/chatPage/ChatPage'));
const Help = React.lazy(() => import("./pages/help/Help"))
function App() {
  const currentUser = useSelector(state => selectCurrentUser(state));
  const dispatch = useDispatch();

  

  React.useEffect( () => {
    let unSubscribeFromAuth = null;
      unSubscribeFromAuth =  onAuthStateChanged( auth, async user => {
        if(user ) {
         
          
        const userRef =  await createUserProfileDocument(user);
        onSnapshot(userRef, snapshot => {
        
         
          dispatch(updateUser({
            id:snapshot.id,
            ...snapshot.data()
          }))
        })
       
        }
        else{
          dispatch(updateUser(user));
        }

      })
      return () => unSubscribeFromAuth();
  },[dispatch])
  return (
 <>
 
 <Navbar  />
<RequsetAlert />
 <React.Suspense fallback={<Spinner />}>
 <Routes>
  <Route index path='/'  element={<Landing />} />
  <Route path='/sign-up' element={currentUser ?<Navigate to='/chat' replace />:<Signup />} />
  <Route path='/sign-in' element={currentUser ?<Navigate to='/chat' replace />:<SignIn currentUser={currentUser} />} />
  <Route path='/chat' element={currentUser ?<ChatPage currentUser={currentUser} />:<Navigate to='/sign-in' />}  />
  <Route path="/help" element={<Help />} />
 </Routes>
 </React.Suspense>
    

 
 </>
  );
}

export default App;
