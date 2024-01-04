import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../routes/routes';
import '../../src/styles.css';

const MakeDecison: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const sign = "->";
  const backSign = "<-";

  const [user, setUser] = useState("");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user.displayName!);
    } else {
      navigate(PageRoutes.Signin);
    }
  });

  return (
    <div className='divide-page'>
      <div className='left-side'>
        <div className='register-box'>
          <h1 className='register-header-back' onClick={() => navigate(PageRoutes.Main)}>{backSign} Main</h1>
          <h1 className='register-header'>Let's get you started, {user}</h1>
          <h2 className='register-subheader'>What happened?</h2>
          <form className='input-form-box'>
            <div className="column-container">
              <button className='btn' onClick={() => navigate(PageRoutes.CreateLost)}>
                I lost something {sign}
              </button>
              <button className='btn' onClick={() => navigate(PageRoutes.CreateFind)}>
                I found something {sign}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='right-side'>
        {/* Content for the right side (empty on desktop) */}
      </div>
    </div>
  );
};

export default MakeDecison;

