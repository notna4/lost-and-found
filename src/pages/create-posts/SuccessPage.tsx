import React from 'react';
import '../../styles.css';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/routes';
import Lottie from 'react-lottie';
import done from '../../assets/done.json'

const SuccessPage = () => {
  const navigate = useNavigate();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: done,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return(
    <div className='success-page'>
      <Lottie options={defaultOptions} height={200} width={200} />
      <h2>Lost item added</h2>
      <h3>We will get back to you when someone finds it</h3>
      <button className='btn' id='shadow-btn' onClick={() => navigate(PageRoutes.Main)}>Done</button>
    </div>
  );
}

export default SuccessPage;