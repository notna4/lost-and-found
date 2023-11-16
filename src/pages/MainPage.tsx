import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../routes/routes';
import PostsContainer from '../components/PostsContainer';

const MainPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const sign = "->";

  const [user, setUser] = useState("");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user.displayName!);
    } else {
      navigate(PageRoutes.Signin);
    }
  });

  const logOut = () => {
    auth.signOut();
  }

  return (
    <div className='main-container'>
      {/* extract these as different components */}
      <div className='topbar-container'>
        <div>Lost and Found TM</div>
        <div className='mobile-menu'>
          <div className='btn-container-main'>
            <button className='btn' id='shadow-btn' onClick={() => navigate(PageRoutes.CreateLost)}>
              I lost something {sign}
            </button>
          </div>
          <div className='btn-container-main'>
            <button className='btn' id='shadow-btn' onClick={() => navigate(PageRoutes.CreateFind)}>
              I found something {sign}
            </button>
          </div>
          <div className='topbar-right'>
            {/* poate facem dropdown cu numele si acolo sa fie logout */}
            {/* <div>{user}</div> */}
            <button className='logout-button' id='shadow-btn' onClick={logOut}>Logout</button>
          </div>
        </div>
      </div>
      <div className='content-container'>
        <PostsContainer />
      </div>
    </div>
  );
}

export default MainPage;

