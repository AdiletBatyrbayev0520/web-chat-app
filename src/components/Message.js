import React from 'react';
import { User, Bot, AlertCircle, CheckCircle, Database, Clock } from 'lucide-react';
import { SDU_COLORS } from '../constants';
import TextFormatter from './TextFormatter';

const Message = ({ message, currentText }) => {
  const { blue: sduBlue } = SDU_COLORS;

  const renderMessageIcon = () => {
    if (message.type === 'user') {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
          <User className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      );
    } else if (message.type === 'error') {
      return <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-1" />;
    } else {
      return (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1" style={{ background: `linear-gradient(to bottom right, ${sduBlue}, ${sduBlue}dd)` }}>
          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      );
    }
  };

  const getMessageStyles = () => {
    if (message.type === 'user') {
      return { background: `linear-gradient(to right, ${sduBlue}, ${sduBlue}ee)` };
    } else if (message.type === 'bot') {
      return { background: `linear-gradient(to right, #f9fafb, ${sduBlue}08)`, borderColor: `${sduBlue}30` };
    } else {
      return {};
    }
  };

  const getMessageClasses = () => {
    const baseClasses = `max-w-[85%] sm:max-w-4xl rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md sm:shadow-lg text-sm sm:text-base`;
    
    if (message.type === 'user') {
      return `${baseClasses} text-white`;
    } else if (message.type === 'error') {
      return `${baseClasses} bg-red-50 border-l-4 border-red-500 text-red-700`;
    } else {
      return `${baseClasses} border`;
    }
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={getMessageClasses()} style={getMessageStyles()}>
        <div className="flex items-start space-x-2 sm:space-x-3">
          {renderMessageIcon()}
          <div className="flex-1 min-w-0">
            {/* Message Content */}
            {message.type === 'bot' ? (
              <TextFormatter text={message.content} className="leading-relaxed" />
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed break-words">
                {message.content}
              </p>
            )}
            
            {/* Sources and Cache Info for Bot Messages */}
            {message.type === 'bot' && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4" style={{ borderTop: `1px solid ${sduBlue}30` }}>
                {/* Cache Status */}
                {message.cached && (
                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-green-600 mb-2 sm:mb-3">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">{currentText.cached}</span>
                  </div>
                )}
                
                {/* Sources */}
                <div className="text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                    <Database className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: sduBlue }} />
                    <span className="font-semibold" style={{ color: sduBlue }}>{currentText.sources}</span>
                  </div>
                  {message.sources && message.sources.length > 0 ? (
                    <ul className="list-none ml-4 sm:ml-6 space-y-0.5 sm:space-y-1">
                      {message.sources.map((source, index) => (
                        <li key={index} className="flex items-center space-x-1.5 sm:space-x-2">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-400 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-600 break-words">{source}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ml-4 sm:ml-6 text-gray-400 italic">{currentText.noSources}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Timestamp */}
            <div className="flex items-center justify-between mt-2 sm:mt-3">
              <div className="flex items-center space-x-1 text-xs opacity-70">
                <Clock className="w-3 h-3" />
                <span>{message.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;