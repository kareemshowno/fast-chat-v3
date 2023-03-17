import React from 'react'
import './Navbar.scss';
import { signOut } from 'firebase/auth';

import { Link } from 'react-router-dom';
import { auth } from '../../firebase/firebaseUtils';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/userReducer/userSelector';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const currentUser = useSelector(state => selectCurrentUser(state));
  const [hamToggled,setHamToggled] = React.useState(false);
  const location = useLocation();
  
 const logout = async () => await signOut(auth)

  return (
        <div className={`nav-container ${hamToggled ? "navToggled":""}`}>
          
          <div className="logo">
            <a href="/">
               
                <h1>fast chat</h1>
            </a>
          </div>
           
          <nav className="navbar">
          <button onClick={() => setHamToggled(!hamToggled)} className= {`ham-btn ${hamToggled ? 'isActive':''}`}>
             
              <span></span>
                <span></span>
                  <span></span>
            </button>
            <ul className="navlist">
              <li className="nav-item">
                {currentUser ? <Link className={`nav-link ${location.pathname === "/chat" ? "active":""}`} to="/chat">Chats</Link>:""}
              </li>
                  <li className="nav-item">
                    {currentUser ? <Link className='nav-link' onClick={logout}>Sign out</Link>:
                    <Link  to="/sign-up" className={`nav-link ${location.pathname === "/sign-up" ? "active":""}`}>Sign up</Link>
                    }
                
                </li>
                  <li className={`${currentUser ? "nav-item-hidden":"nav-item"}`}>
                <Link  to="/sign-in" className={`nav-link ${location.pathname === "/sign-in" ? "active":""}`}>Sign in</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/help" ? "active":""}`} to="/help">Help</Link>
                </li>
                
              
                
              
            </ul>
            
          </nav>
        </div>
  )
}

export default Navbar