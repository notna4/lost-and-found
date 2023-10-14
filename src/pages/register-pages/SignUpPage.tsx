import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../../styles.css';
import { PageRoutes } from '../../routes/routes';

const SignUpPage: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (formData.password === formData.confirmPassword) {
      console.log('Email:', formData.email);
      console.log('Password:', formData.password);
      console.log('Username:', formData.username);

      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
            const user = userCredential.user;

            updateProfile(user, {
                displayName: formData.username,
            })
            .then(() => {
                console.log('User with updated username:', user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error updating username:', errorCode, errorMessage);
            });

            console.log(user);

            navigate(PageRoutes.MakeDecision);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }
  };

  React.useEffect(() => {
    setIsFormValid(
      formData.email !== '' &&
        formData.password !== '' &&
        formData.confirmPassword !== '' &&
        formData.username !== ''
    );
  }, [formData]);

  return (
    <div className="form-container">
      <h1>Lost something?
          You’ve come to the right place!</h1>
      <h1>Create an account</h1>
      <form>
        <div>
          <input
            className="input-field"
            placeholder="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            className="input-field"
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            className="input-field"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <button className="button" onClick={handleSubmit} disabled={!isFormValid}>
        Next
      </button>
    </div>
  );
};

export default SignUpPage;
