import {initializeApp} from 'firebase/app';
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import {getFirestore,doc,getDoc, setDoc} from 'firebase/firestore'
import {getStorage} from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNr1w_arMwV6vVqFtS2lC8r_12WBMDt-M",
    authDomain: "fast-chat-97cdb.firebaseapp.com",
    projectId: "fast-chat-97cdb",
    storageBucket: "fast-chat-97cdb.appspot.com",
    messagingSenderId: "821879220331",
    appId: "1:821879220331:web:f9a534490d044c7391e92e"
  };
  
  // Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 export const firestore = getFirestore(app)
 export const storage = getStorage(app)


 //custom async function for grabbing userauth data and creating user document in the database
 export const createUserProfileDocument = async (userAuth,downloadURL,additionalData) => {
                if(!userAuth  ) return;
             
                
                 const user =  doc(firestore,'users',`${userAuth.uid}`)
                  const userSnap = await getDoc(user)
                  if(!userSnap.exists()){
                    const {displayName,email,uid} = userAuth;
                    
                    
                    const createdAt = new Date();
                    try {
                      
                     
                      await setDoc(user,{
                        uid,
                        displayName,
                        email,
                        createdAt,
                        photoURL: downloadURL ? downloadURL: null ,
                        ...additionalData
                      });
                      await setDoc(doc(firestore,"userChats",`${userAuth.uid}`),{})
                      
                    } catch (error) {
                      console.log(error)
                    }
                  }
                 
                 return user;
                 

 }
 // oAuth - signing in with google
const provider = new GoogleAuthProvider();
provider.setCustomParameters({prompt:"select_account"});
 export const signInWithGoogle = () => signInWithPopup(auth,provider)
