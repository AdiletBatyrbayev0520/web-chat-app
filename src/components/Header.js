import React, { useState } from 'react';
import { Globe, BookOpen, Menu, X } from 'lucide-react';
import { LANGUAGES, SDU_COLORS, UI_TEXT } from '../constants';
import ConnectionStatus from './ConnectionStatus';

const Header = ({ language, onLanguageChange, connectionStatus }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentText = UI_TEXT[language] || UI_TEXT['en'];
  const { blue: sduBlue, orange: sduOrange } = SDU_COLORS;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-8 mb-4 sm:mb-8" style={{ borderTop: `4px solid ${sduBlue}` }}>
      {/* SDU Logo Area */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 text-center sm:text-left">
          {/* Custom SDU Logo */}
          <div className="relative mb-3 sm:mb-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(to bottom right, ${sduBlue}, ${sduBlue}dd)` }}>
              <div className="relative">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <div className="absolute -top-1 -left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: sduOrange }}></div>
                <div className="absolute -top-1 -right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: sduOrange }}></div>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 transform rotate-45 rounded-sm shadow-md" style={{ backgroundColor: sduOrange }}></div>
          </div>
          
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">
              {currentText.title}
            </h1>
            <p className="text-sm sm:text-lg font-medium mb-2" style={{ color: sduBlue }}>
              {currentText.subtitle}
            </p>
            <ConnectionStatus connectionStatus={connectionStatus} currentText={currentText} />
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden absolute top-4 right-4 p-2 rounded-lg"
          style={{ 
            border: `2px solid ${sduBlue}30`,
            backgroundColor: `${sduBlue}08`,
          }}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" style={{ color: sduBlue }} /> : <Menu className="w-5 h-5" style={{ color: sduBlue }} />}
        </button>
        
        {/* Language Selector - Desktop */}
        <div className="hidden sm:flex items-center space-x-3">
          <Globe className="w-5 h-5" style={{ color: sduBlue }} />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium"
            style={{ 
              border: `2px solid ${sduBlue}30`,
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
          >
            {Object.entries(LANGUAGES).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mb-4 pb-4 border-t pt-4" style={{ borderColor: `${sduBlue}30` }}>
          <div className="flex items-center space-x-3 mb-3">
            <Globe className="w-5 h-5" style={{ color: sduBlue }} />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm"
              style={{ 
                border: `2px solid ${sduBlue}30`,
                outline: 'none'
              }}
            >
              {Object.entries(LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-600 text-center">
            Est. 1996 • Almaty, Kazakhstan
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;