import React from 'react';
import emailjs from '@emailjs/browser';
import "./Help.scss"
import FormInput from '../../components/re-usable/FormInput';
import { useDispatch } from 'react-redux';
import { updateRequestMessage } from '../../redux/requestReducer/requestMSlice';



const Help = () => {
    const [reportUser,setReportUser] = React.useState("");
const [reportEmail,setReportEmail] = React.useState("");
const [reportMessage, setReportMessage] = React.useState("");

const dispatch = useDispatch();

const form = React.useRef();

const sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm('service_je6ye8o', 'template_ddmtaj4', form.current, 'WPrA27g4X63-oUjTG')
    .then((result) => {
        
        dispatch(updateRequestMessage(`Thank you for your message! we will reply to you ASAP`))
    }, (error) => {
        dispatch(updateRequestMessage(error.text))
    });
    e.target.reset()
    setReportUser("");
    setReportEmail("");
    setReportMessage("")
};
  return (
    <div className="help-container">
        <div className="instructions">
            <h3><span>Note:</span> THIS APP USES FIREBASE AND GOOGLE CLOUD SERVICES THAT MIGHT BE BLOCKED <br /> IN YOUR COUNTRY! USE A VPN IF YOU FACED ISSUES REGARDING CHAT & ACCESS.</h3>
            <h2>How to use ?</h2>
            <ol className="instructions-list">
                <li>Sign up with your email and password or sign in with your Google account to create a new  <br /> account and start using the application.</li>
                <li>Once you have created your account successfully, chat page will open , look for the <br /> "search for users" field on the left side of the page.</li>
                <li>Type the name of the user you wish to start chatting with, then press Enter or click the <br /> search icon, 
                 "username should  be the display name a user entered when signing up". </li>
                <li>The user you searched for will appear on a list below the search field, click on this user.</li>
                <li>User is added to your chats now, select your chat with that user and start chatting! .</li>
            </ol>
        </div>
        <div className="support">
            <p className="support-title">If you are having any problems or you have any question  please contact us: </p>
            <form ref={form} onSubmit={sendEmail} className='support-form'>
                <div className="form-group">
                    <label className='form-label' htmlFor="name">Your Name</label>
                    <FormInput required  handleChange={(e) => setReportUser(e.target.value)} value={reportUser} type="text"  name='name' id='name' />
                </div>
                <div className="form-group">
                    <label className='form-label' htmlFor="email">Your Email</label>
                    <FormInput required handleChange={(e) => setReportEmail(e.target.value)}  value={reportEmail} type="email" name="email" id="email"  />
                </div>
                <div className="form-group">
                    <label className='form-label' htmlFor="message">Your Message</label>
                    <textarea required onChange={(e) => setReportMessage(e.target.value)} value={reportMessage} className='form-control' name="message" id="message" cols="30" rows="10"></textarea>
                </div>
                <div className="submit">
                    <button type="submit" className='submit-btn'>Submit</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Help