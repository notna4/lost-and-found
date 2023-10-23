import React from 'react';
import '../../styles.css';
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/routes';

const SuccessPage = () => {
    const navigate = useNavigate();

    return(
        <div className='success-page'>
            <h2>🎉🎉🎉🎉🎉 ahah, congrats 🎉🎉🎉🎉🎉</h2>
            <button className='btn' id='shadow-btn' onClick={() => navigate(PageRoutes.Main)}>Go to main</button>
        </div>
    );
}

export default SuccessPage;