import React from 'react';
import './Signup.scss'
import {AiFillGoogleCircle} from 'react-icons/ai'
import { Link } from 'react-router-dom';
import FormInput from '../../components/re-usable/FormInput';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, createUserProfileDocument, signInWithGoogle,storage } from '../../firebase/firebaseUtils';
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import RequsetAlert from '../../components/re-usable/request-alert/RequsetAlert';
import { useDispatch, useSelector } from 'react-redux';
import { updateRequestMessage } from '../../redux/requestReducer/requestMSlice';
import { selectCurrentUser } from '../../redux/userReducer/userSelector';
import Hint from '../../components/re-usable/hint/Hint';




const Signup =() =>  {
   
    const [userCredentials,setUserCredentials] = React.useState(
        {
            displayName:"",
            email:"",
            password:"",
            confirmpass:"",
            
        }
    )

    const {displayName,email,password,confirmpass} = userCredentials;
    const dispatch = useDispatch()
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const [formErrors,setFormErrors] = React.useState({});
    const [requestMessage,setRequestMessage] = React.useState(null);
   const currentUser = useSelector(state => selectCurrentUser(state))
    
    const validate =  (userCredentials) => {
        const errors = {};
        if(!userCredentials.displayName.length){
            errors.displayName = "Display Name is required !"
        }  
          else if (!userCredentials.email.length){
            errors.email = "Email is required !"
            
          }
          else if (!regex.test(userCredentials.email)) {
            errors.email = "Email format is not valid ! "
          }
          else if (!userCredentials.password.length) {
            errors.password = "Password is required !"
          }
          else if (!userCredentials.confirmpass.length) {
           errors.confirmpass = "Password confirmation is required !"
          }
          else if (userCredentials.password !== userCredentials.confirmpass) {
            errors.confirmpass = "Passwords do not match !"
          }
          else if (userCredentials.password.length < 6) {
            errors.password = "Password must be at least 6 charachters !"
          }
          return errors;
        
    }
 const handleChange = (e)=>{
    setUserCredentials({...userCredentials,[e.target.name]:e.target.value});
    
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validate(userCredentials);
        const photoURL = e.target[4].files[0]
        // check if there are any errors
        if (Object.keys(validation).length > 0 ) {
          setFormErrors(validation);
          return; // stop the function if there are errors
        }
        
        try {
          const {displayName,email,password} = userCredentials;
          const {user} = await createUserWithEmailAndPassword(auth,email,password);
          const storageRef = ref(storage, displayName);
        
const uploadTask =   uploadBytesResumable(storageRef, photoURL);


uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    console.log('Upload is ' + progress + '% done');
    dispatch(updateRequestMessage(`Please wait while your photo is being uploaded, ${progress}% done`))
    
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
    setFormErrors({photoURL:error.message})
  }, 
  () => {
    
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  
    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
      console.log("profile update began!" + downloadURL)
      await updateProfile(user,{
        displayName,
        photoURL:downloadURL
        
      })
      await createUserProfileDocument(user, downloadURL, {displayName});
      
    })
    })

          setUserCredentials({...userCredentials,displayName:"",email:"",password:"",confirmpass:""})
          setFormErrors({});
        } catch (error) {
          setRequestMessage(` there was an error with the sign up process ` +  error.message)
        }
      };
        return (
            <div className="sign-up-page">
              {currentUser ?"":<Hint /> }
               {requestMessage ? <RequsetAlert message={requestMessage} />:''}
                <div className="form-container">
                    <form onSubmit={handleSubmit} className='form'>
                        <div className="form-g">
                            <label htmlFor="displayName" className="form-label">Display Name</label>
                            <FormInput handleChange={handleChange} value={displayName}  type='text' name='displayName' id='displayName' />
                            <p className={`${formErrors.displayName ? 'form-input-error':'hide'}`}>{formErrors.displayName}</p>
                        </div>
                        <div className="form-g">
                            <label htmlFor="email" className="form-label">Email</label>
                            <FormInput handleChange={handleChange} value={email} type='email' name='email' id='email' />
                            <p className={`${formErrors.email ? 'form-input-error':'hide'}`}>{formErrors.email}</p>
                        </div>
                        <div className="form-g">
                            <label htmlFor="password" className="form-label">Password</label>
                            <FormInput handleChange={handleChange} value={password} type='password' name='password' id='password' />
                            <p className={`${formErrors.password ? 'form-input-error':'hide'}`}>{formErrors.password}</p>
                        </div>
                        <div className="form-g">
                            <label htmlFor="confirmpass" className="form-label">Confirm Password</label>
                            <FormInput handleChange={handleChange} value={confirmpass} type='password' name='confirmpass' id='confirmpass' />
                            <p className={`${formErrors.confirmpass ? 'form-input-error':'hide'}`}>{formErrors.confirmpass}</p>
                        </div>
                        <div className="form-g">
                        <label   htmlFor="photoUrl" className="form-label image-label">
                        
                          Profile photo
                          
                        </label>
                          <FormInput    type='file' name='photoUrl' id='photoUrl' placehlodaer='choose a profile photo' />
                          <p className={`${formErrors.photoURL ? 'form-input-error':"hide"}`}>{formErrors.photoURL}</p>
                        </div>
                        <div className="form-exis-account">
                            <Link className='exis-account-link' to={"/sign-in"} >Already have an account ?</Link>
                           
                        </div>
                        <div className="form-submit">
                            <button type="submit" className='form-btn'>Sign up</button>
                            <button onClick={signInWithGoogle} type="button"  className='form-btn-google'>
                       <AiFillGoogleCircle className='google-icon'/> Sign in with google</button>
                        </div>
                    </form>
                </div>
            </div>
          )
    

  
}

export default Signup