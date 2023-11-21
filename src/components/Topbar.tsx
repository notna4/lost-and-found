import React from 'react';

interface TopbarProps {
  user: string;
  handleDropdown: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ user, handleDropdown }) => {
  return (
    <div className='topbar-container'>
      <div>Lost and Found TM</div>
      <div className='topbar-right' onClick={handleDropdown}>
        {`Welcome back, ${user} ▼`}
      </div>
    </div>
  );
};

export default Topbar;