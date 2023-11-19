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
  const [isDropdown, setIsDropdown] = useState(false);
  let [count, setCount] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.displayName!);
      } else {
        navigate(PageRoutes.Signin);
      }
    });
  }, [])

  const logOut = () => {
    auth.signOut();
  }

  const handleDropdown = () => {
    console.log(isDropdown);
    setIsDropdown(!isDropdown);
  } 

  return (
    <div className='main-container'>
      {/* extract these as different components */}
      <div className='topbar-container'>
        <div>Lost and Found TM</div>
        <div className='topbar-right' onClick={handleDropdown}>{user}</div>
      </div>
      {isDropdown ? <div className='dropdown-bg' onClick={handleDropdown}>
        <div className='dropdown'>
          <button className='btn-dropdown'  onClick={() => navigate(PageRoutes.CreateLost)}>
              I lost something {sign}
            </button>
          <button className='btn-dropdown' onClick={() => navigate(PageRoutes.CreateFind)}>
            I found something {sign}
          </button>
          <div className='btn-dropdown' onClick={logOut}>Logout</div>

        </div>
      </div> : <div></div>}
      <div className='content-container'>
        <PostsContainer />
      </div>
    </div>
  );
}

export default MainPage;

