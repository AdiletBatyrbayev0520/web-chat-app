import React from 'react';
import { User } from 'lucide-react';
import { SDU_COLORS } from '../constants';

const UserIdInput = ({ userId, onUserIdChange, placeholder }) => {
  const { blue: sduBlue } = SDU_COLORS;

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
      <User className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: sduBlue }} />
      <input
        type="text"
        value={userId}
        onChange={(e) => onUserIdChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base"
        style={{ 
          border: `2px solid ${sduBlue}30`,
          backgroundColor: `${sduBlue}08`,
          outline: 'none'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = sduBlue;
          e.target.style.boxShadow = `0 0 0 3px ${sduBlue}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = `${sduBlue}30`;
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default UserIdInput;