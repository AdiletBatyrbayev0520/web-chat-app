import React from 'react';
import { Send } from 'lucide-react';
import { SDU_COLORS } from '../constants';

const MessageInput = ({ 
  question, 
  onQuestionChange, 
  onSendMessage, 
  placeholder, 
  isLoading, 
  disabled,      // For textarea (only when loading)
  sendDisabled,  // For send button (loading + validation)
  currentText 
}) => {
  const { blue: sduBlue } = SDU_COLORS;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-3 sm:p-6 border-b-4 border-orange-400">
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <textarea
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl resize-none text-gray-700 placeholder-gray-500 text-sm sm:text-base mb-3 sm:mb-0"
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
          rows="2"
          disabled={disabled}
        />
        <button
          onClick={onSendMessage}
          disabled={sendDisabled}
          className="px-6 py-3 sm:px-8 sm:py-4 text-white rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 transition-all duration-200 shadow-lg font-medium text-sm sm:text-base"
          style={{ 
            background: `linear-gradient(to right, ${sduBlue}, ${sduBlue}dd)`,
          }}
          onMouseEnter={(e) => {
            if (!sendDisabled) {
              e.target.style.background = `linear-gradient(to right, ${sduBlue}dd, ${sduBlue}bb)`;
            }
          }}
          onMouseLeave={(e) => {
            if (!sendDisabled) {
              e.target.style.background = `linear-gradient(to right, ${sduBlue}, ${sduBlue}dd)`;
            }
          }}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="sm:inline">{currentText.processing}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{currentText.send}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;