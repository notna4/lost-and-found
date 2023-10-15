import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { PageRoutes } from '../../routes/routes';
import '../../styles.css';

const SignInPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const sign = "->";

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  React.useEffect(() => {
    setIsFormValid(
      formData.email !== '' &&
      formData.password !== ''
    );
  }, [formData]);

  return (
    <div className='divide-page'>
      <div className='left-side'>
        <div className='register-box'>
          <h1 className='register-header'>Welcome back</h1>
          <h1 className='register-header'>Sign In</h1>
          <form className='input-form-box'>
            <div>
              <input
                className='input-form'
                type="email"
                name="email"
                placeholder="Email"
                autoComplete='off'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                className='input-form'
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="button-container">
              <button className='btn' onClick={handleSubmit} disabled={!isFormValid}>
                Next {sign}
              </button>
            </div>
            <div className="text-hover" onClick={() => navigate(PageRoutes.Signup)}><u>Don't have an account? Sign Up</u></div>
          </form>
        </div>
      </div>
      <div className='right-side'>
        {/* Content for the right side (empty on desktop) */}
      </div>
    </div>
  );
};

export default SignInPage;
