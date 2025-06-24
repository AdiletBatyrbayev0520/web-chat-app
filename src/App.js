import React, { useState, useEffect } from 'react';
import { SDU_COLORS, PLACEHOLDERS, UI_TEXT } from './constants';
import { useConnection } from './hooks/useConnection';
import { 
  sendQuestionToAPI, 
  createBotMessage, 
  createUserMessage, 
  createErrorMessage, 
  handleApiError 
} from './services/apiService';

// Components
import Header from './components/Header';
import UserIdInput from './components/UserIdInput';
import ErrorDisplay from './components/ErrorDisplay';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import Footer from './components/Footer';

const BedrockQAApp = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('en');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Custom hooks
  const { connectionStatus, setConnectionStatus } = useConnection();
  
  // Derived state
  const currentText = UI_TEXT[language] || UI_TEXT['en'];
  const placeholder = PLACEHOLDERS[language];
  const { blue: sduBlue } = SDU_COLORS;

  // Generate a random user ID on component mount
  useEffect(() => {
    if (!userId) {
      setUserId(`sdu_user_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [userId]);

  // Handlers
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleUserIdChange = (newUserId) => {
    setUserId(newUserId);
  };

  const handleQuestionChange = (newQuestion) => {
    setQuestion(newQuestion);
  };

  const sendQuestion = async () => {
    if (!question.trim() || !userId.trim()) {
      setError('Please provide both question and user ID');
      return;
    }

    setIsLoading(true);
    setError('');

    // Create and add user message
    const userMessage = createUserMessage(question);
    setMessages(prev => [...prev, userMessage]);
    
    const currentQuestion = question;
    setQuestion('');

    try {
      // Send question to API
      const data = await sendQuestionToAPI(currentQuestion, userId);
      
      // Create and add bot message
      const botMessage = createBotMessage(data);
      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus('connected');

    } catch (error) {
      // Handle errors
      const { userErrorMessage, errorMessage } = handleApiError(error);
      setError(userErrorMessage);
      
      const errorMessageObj = createErrorMessage(errorMessage);
      setConnectionStatus('disconnected');
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if send button should be disabled
  const isSendDisabled = isLoading || !question.trim() || !userId.trim();
  
  // Textarea should only be disabled when loading, not when empty
  const isTextareaDisabled = isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-100 to-orange-50 p-2 sm:p-4">
      {/* SDU Background Pattern - Hidden on mobile for performance */}
      <div className="hidden sm:block fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: sduBlue }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: sduBlue }}></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <Header 
          language={language}
          onLanguageChange={handleLanguageChange}
          connectionStatus={connectionStatus}
        />

        {/* User ID Input Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-8 mb-4 sm:mb-8" style={{ borderTop: `4px solid ${sduBlue}` }}>
          <UserIdInput 
            userId={userId}
            onUserIdChange={handleUserIdChange}
            placeholder={currentText.userIdPlaceholder}
          />

          {/* Error Display */}
          <ErrorDisplay error={error} />
        </div>

        {/* Chat Messages */}
        <ChatContainer 
          messages={messages}
          currentText={currentText}
        />

        {/* Input Area */}
        <MessageInput 
          question={question}
          onQuestionChange={handleQuestionChange}
          onSendMessage={sendQuestion}
          placeholder={placeholder}
          isLoading={isLoading}
          disabled={isTextareaDisabled}
          sendDisabled={isSendDisabled}
          currentText={currentText}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default BedrockQAApp;