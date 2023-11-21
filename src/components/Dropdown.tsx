import React from 'react';
import { PageRoutes } from '../routes/routes';
import { useNavigate } from 'react-router-dom';

interface DropdownProps {
  isDropdown: boolean;
  user: string;
  sign: string;
  handleDropdown: () => void;
  logOut: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  isDropdown,
  user,
  sign,
  handleDropdown,
  logOut,
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      {isDropdown && (
        <div className='dropdown-bg' onClick={handleDropdown}>
          <div className='dropdown'>
            <div className='topbar-right' onClick={handleDropdown}>
              {'Welcome back, ' + user + ' ▼'}
            </div>
            <button
              className='btn-dropdown'
              onClick={() => navigate(PageRoutes.CreateLost)}
            >
              I lost something {sign}
            </button>
            <button
              className='btn-dropdown'
              onClick={() => navigate(PageRoutes.CreateFind)}
            >
              I found something {sign}
            </button>
            <div className='btn-dropdown' onClick={logOut}>
              Logout
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dropdown;