import React from 'react'
import './SignIn.scss'

import { Link } from 'react-router-dom';
import FormInput from '../../components/re-usable/FormInput';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth,firestore } from '../../firebase/firebaseUtils';
import {doc, getDoc} from 'firebase/firestore'
import RequsetAlert from '../../components/re-usable/request-alert/RequsetAlert'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/userReducer/userSelector';
import Hint from '../../components/re-usable/hint/Hint';
const SignIn = () => {
     const [userCredentials,setUserCredentials] = React.useState({
        email:"",
        password:""
     });
     const {email,password} = userCredentials;
     const [formErrors,setFormErrors] = React.useState({});
     const [requestMessage,setRequestMessage] = React.useState(null);
     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     const currentUser = useSelector(state => selectCurrentUser(state))
   const  handleChange = (e) => {
        setUserCredentials({...userCredentials,[e.target.name]:e.target.value})
    }
    const validate = (email,password) => {
        const errors = {};
        if(!email.length){
            errors.email = "Email is required !"
        }
        if(!regex.test(email)) {
            errors.email = "Email format is unvalid !"
        }
        if(!password.length) {
            errors.password = "Password is required"
        }
        if(password.length < 6) {
            errors.password = "Password is too short"
        }
        return errors;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validate(email,password)
        if(Object.keys(validation).length > 0) {
            setFormErrors(validation);
            return;
        }
        try {
           const {user} =  await signInWithEmailAndPassword(auth,email,password);
            const userRef =  doc(firestore,'users',`${user.uid}`)
            const userSnap = await  getDoc(userRef);
            const dName = userSnap.data();
            setRequestMessage("Signed in successful ! welcome " + dName)
            setUserCredentials({email:"",password:""});
            setFormErrors({})
            
        } catch (error) {
            setRequestMessage("There was a problem signing in " + error.message)
            console.log(error)
        }
        
    }
 
        return (
            <div className="sign-in-page">
                 {currentUser ?"":<Hint /> }
                {requestMessage ? <RequsetAlert message={requestMessage} />:''}
                  <div className="form-container-signin">
                    <form onSubmit={handleSubmit}  className='form'>
                       
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
                        
                        <div className="form-exis-account">
                            <Link className='exis-account-link' to={"/sign-up"} >You don't have an account ?</Link>
                        </div>
                        <div className="form-submit">
                            <button type="submit" className='form-btn'>Sign In</button>
                            
                        </div>
                    </form>
                </div>
            </div>
          )
    
 
}

export default SignIn