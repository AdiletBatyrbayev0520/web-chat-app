import React, { useState, useRef, useEffect } from 'react';
import { Send, Globe, Clock, Database, User, Bot, AlertCircle, CheckCircle, BookOpen, Menu, X } from 'lucide-react';

const BedrockQAApp = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('en');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const API_ENDPOINT = 'https://lzompyihsttpv2dyqbrkahgyny0ujqll.lambda-url.us-east-1.on.aws/ask';

  const languages = {
    'en': { name: 'English', flag: '🇺🇸' },
    'es': { name: 'Español', flag: '🇪🇸' },
    'fr': { name: 'Français', flag: '🇫🇷' },
    'de': { name: 'Deutsch', flag: '🇩🇪' },
    'zh': { name: '中文', flag: '🇨🇳' },
    'kk': { name: 'Қазақша', flag: '🇰🇿' },
    'tr': { name: 'Türkçe', flag: '🇹🇷' },
    'ru': { name: 'Русский', flag: '🇷🇺' }
  };

  const placeholders = {
    'en': 'Ask your question about SDU University...',
    'es': 'Haz tu pregunta sobre la Universidad SDU...',
    'fr': 'Posez votre question sur l\'Université SDU...',
    'de': 'Stellen Sie Ihre Frage zur SDU Universität...',
    'zh': '询问关于SDU大学的问题...',
    'kk': 'SDU университеті туралы сұрағыңызды қойыңыз...',
    'tr': 'SDU Üniversitesi hakkında sorunuzu sorun...',
    'ru': 'Задайте ваш вопрос об университете SDU...'
  };

  const uiText = {
    'en': {
      title: 'SDU Knowledge Base',
      subtitle: 'Suleyman Demirel University Q&A Assistant',
      userIdPlaceholder: 'Enter your student/staff ID',
      send: 'Send',
      connecting: 'Connecting...',
      connected: 'Connected',
      disconnected: 'Disconnected',
      error: 'Error',
      cached: 'Cached Response',
      sources: 'Sources:',
      noSources: 'No sources available',
      welcomeMessage: 'Welcome to SDU University Knowledge Base! Ask me anything about academics, programs, admissions, or campus life.',
      processing: 'Processing your question...'
    },
    'ru': {
      title: 'База знаний SDU',
      subtitle: 'Помощник Q&A Университета Сулеймана Демиреля',
      userIdPlaceholder: 'Введите ваш ID студента/сотрудника',
      send: 'Отправить',
      connecting: 'Подключение...',
      connected: 'Подключено',
      disconnected: 'Отключено',
      error: 'Ошибка',
      cached: 'Кэшированный ответ',
      sources: 'Источники:',
      noSources: 'Источники недоступны',
      welcomeMessage: 'Добро пожаловать в базу знаний университета SDU! Спрашивайте меня о программах, поступлении или университетской жизни.',
      processing: 'Обрабатываю ваш вопрос...'
    },
    'kk': {
      title: 'SDU білім базасы',
      subtitle: 'Сүлейман Демирел университетінің Q&A көмекшісі',
      userIdPlaceholder: 'Студент/қызметкер ID енгізіңіз',
      send: 'Жіберу',
      connecting: 'Қосылуда...',
      connected: 'Қосылды',
      disconnected: 'Ажыратылды',
      error: 'Қате',
      cached: 'Кэштелген жауап',
      sources: 'Дереккөздер:',
      noSources: 'Дереккөздер жоқ',
      welcomeMessage: 'SDU университетінің білім базасына қош келдіңіз! Академиялық бағдарламалар, түсу немесе университет өмірі туралы сұраңыз.',
      processing: 'Сұрағыңызды өңдеп жатырмын...'
    }
  };

  const currentText = uiText[language] || uiText['en'];

  // Generate a random user ID on component mount
  useEffect(() => {
    if (!userId) {
      setUserId(`sdu_user_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [userId]);

  // Handle scroll for parallax effect
  useEffect(() => {
    let animationFrameId;
    
    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          const scrollTop = chatContainerRef.current.scrollTop;
          setScrollOffset(scrollTop * 0.15); 
        }
      });
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      console.log('Testing connection to:', API_ENDPOINT);
      
      // Test with a simple GET request to root for documentation
      const testUrl = 'https://lzompyihsttpv2dyqbrkahgyny0ujqll.lambda-url.us-east-1.on.aws/'
      const response = await fetch(testUrl, {
        method: 'GET',
      });
      
      console.log('Connection test response:', response.status);
      
      if (response.ok) {
        setConnectionStatus('connected');
        console.log('Connection successful');
      } else {
        console.log('Connection failed with status:', response.status);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setConnectionStatus('disconnected');
    }
  };

  const sendQuestion = async () => {
    if (!question.trim() || !userId.trim()) {
      setError('Please provide both question and user ID');
      return;
    }

    setIsLoading(true);
    setError('');

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');

    try {
      const requestBody = {
        question: currentQuestion,
        user_id: userId,
        language: language
      };

      console.log('Sending request to:', API_ENDPOINT);
      console.log('Request body:', requestBody);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
      });

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(120000), // 2 minute timeout
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response (${response.status}): ${responseText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        console.error('API error:', data);
        throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.answer || 'No answer provided',
        timestamp: new Date().toLocaleTimeString(),
        sources: data.sources || [],
        cacheStatus: data.cache_status,
        cacheType: data.cache_type,
        cached: data.cache_status === 'hit'
      };

      setMessages(prev => [...prev, botMessage]);
      setConnectionStatus('connected');

    } catch (error) {
      console.error('Fetch error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      
      let errorMessage;
      let userErrorMessage;
      
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        userErrorMessage = 'Request timeout - The server is taking too long to respond. Please try again.';
        errorMessage = 'Request Timeout: The server took longer than 2 minutes to respond.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
        userErrorMessage = 'Network error - Unable to connect to the server. Please check your internet connection and try again.';
        errorMessage = `Network Error: ${error.message}. This could be due to:\n• Internet connectivity issues\n• Server temporarily unavailable\n• CORS configuration problems\n• Firewall or proxy blocking the request`;
      } else if (error.message.includes('CORS')) {
        userErrorMessage = 'CORS error - Cross-origin request blocked. Please contact system administrator.';
        errorMessage = `CORS Error: ${error.message}`;
      } else {
        userErrorMessage = `Connection error: ${error.message}`;
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(userErrorMessage);
      
      const errorMessageObj = {
        id: Date.now() + 1,
        type: 'error',
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setConnectionStatus('disconnected');
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return currentText.connected;
      case 'connecting': return currentText.connecting;
      case 'disconnected': return currentText.disconnected;
      default: return currentText.disconnected;
    }
  };

  // Custom SDU blue color
  const sduBlue = '#212153';
  const sduOrange = '#f3a366';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 p-2 sm:p-4">
      {/* SDU Background Pattern - Hidden on mobile for performance */}
      <div className="hidden sm:block fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: sduBlue }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: sduBlue }}></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header with SDU Branding - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-8 mb-4 sm:mb-8" style={{ borderTop: `4px solid ${sduBlue}` }}>
          {/* SDU Logo Area */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 text-center sm:text-left">
              {/* Custom SDU Logo */}
              <div className="relative mb-3 sm:mb-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(to bottom right, ${sduBlue}, ${sduBlue}dd)` }}>
                  {/* Shanyrak-inspired design with wings */}
                  <div className="relative">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    <div className="absolute -top-1 -left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: sduOrange }}></div>
                    <div className="absolute -top-1 -right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: sduOrange }}></div>
                  </div>
                </div>
                {/* Light orange rhombus */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 transform rotate-45 rounded-sm shadow-md" style={{ backgroundColor: sduOrange }}></div>
              </div>
              
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">
                  {currentText.title}
                </h1>
                <p className="text-sm sm:text-lg font-medium mb-2" style={{ color: sduBlue }}>
                  {currentText.subtitle}
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-xs sm:text-sm">
                  <div className={`flex items-center space-x-1 ${getConnectionStatusColor()}`}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse"></div>
                    <span className="font-medium">{getConnectionStatusText()}</span>
                  </div>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="text-gray-600 hidden sm:inline">Est. 1996 • Almaty, Kazakhstan</span>
                </div>
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
                onChange={(e) => setLanguage(e.target.value)}
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
                {Object.entries(languages).map(([code, lang]) => (
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
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm"
                  style={{ 
                    border: `2px solid ${sduBlue}30`,
                    outline: 'none'
                  }}
                >
                  {Object.entries(languages).map(([code, lang]) => (
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

          {/* User ID Input with SDU styling */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <User className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: sduBlue }} />
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={currentText.userIdPlaceholder}
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

          {/* Error Display with SDU styling */}
          {error && (
            <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm sm:text-base">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Chat Messages with SDU styling - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl mb-4 sm:mb-8 overflow-hidden" style={{ height: 'calc(100vh - 340px)', minHeight: '300px', maxHeight: '500px', position: 'relative' }}>
          {/* Fixed background that's always visible */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://sdu.edu.kz/wp-content/uploads/2023/08/logo-1024x1016.png)',
              backgroundSize: '250px 250px',
              backgroundPosition: `center calc(50% - ${scrollOffset * 0}px)`,
              backgroundRepeat: 'no-repeat',
              opacity: 0.20,
              pointerEvents: 'none',
              zIndex: 1,
              willChange: 'background-position',
              transition: 'background-position 0.1s ease-out'
            }}
            className="sm:opacity-10"
          />
          
          <div ref={chatContainerRef} className="h-full overflow-y-auto p-3 sm:p-6 relative z-10">
            <div className="space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8 sm:py-16">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${sduBlue}20, #FFA50020)` }}>
                    <img 
                      src="https://scontent.fala6-1.fna.fbcdn.net/v/t39.30808-6/396010554_810707741060773_3844701626438101860_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=3hRhBeTzF4EQ7kNvwEjcZL5&_nc_oc=Adn5KSPRawhCYfrLl0sRk_N3JavsXNf_ZZWmJVssGrkUL17u9NU8YABW3MVm6sp0CIY&_nc_zt=23&_nc_ht=scontent.fala6-1.fna&_nc_gid=lT7GPAYCaJGUwTjm9PNqfQ&oh=00_AfP7Yg9bEymOHXferx9UTKNJ7naFyaeef3bRKe9lhxAnxQ&oe=68478461"
                      alt="SDU Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Welcome to SDU Knowledge Base!</h3>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed px-4">
                    {currentText.welcomeMessage}
                  </p>
                  <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                    <span>• Academics</span>
                    <span>• Admissions</span>
                    <span>• Campus Life</span>
                    <span>• Research</span>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-4xl rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md sm:shadow-lg text-sm sm:text-base ${
                        message.type === 'user'
                          ? 'text-white'
                          : message.type === 'error'
                          ? 'bg-red-50 border-l-4 border-red-500 text-red-700'
                          : 'border'
                      }`}
                      style={
                        message.type === 'user'
                          ? { background: `linear-gradient(to right, ${sduBlue}, ${sduBlue}ee)` }
                          : message.type === 'bot'
                          ? { background: `linear-gradient(to right, #f9fafb, ${sduBlue}08)`, borderColor: `${sduBlue}30` }
                          : {}
                      }
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        {message.type === 'user' ? (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                        ) : message.type === 'error' ? (
                          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-1" />
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1" style={{ background: `linear-gradient(to bottom right, ${sduBlue}, ${sduBlue}dd)` }}>
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="whitespace-pre-wrap leading-relaxed break-words">{message.content}</p>
                          
                          {/* Sources and Cache Info for SDU */}
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
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area with SDU styling - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-3 sm:p-6 border-b-4 border-orange-400">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholders[language]}
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
              disabled={isLoading}
            />
            <button
              onClick={sendQuestion}
              disabled={isLoading || !question.trim() || !userId.trim()}
              className="px-6 py-3 sm:px-8 sm:py-4 text-white rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 transition-all duration-200 shadow-lg font-medium text-sm sm:text-base"
              style={{ 
                background: `linear-gradient(to right, ${sduBlue}, ${sduBlue}dd)`,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = `linear-gradient(to right, ${sduBlue}dd, ${sduBlue}bb)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = `linear-gradient(to right, ${sduBlue}, ${sduBlue}dd)`;
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

        {/* SDU Footer - Mobile Optimized */}
        <div className="text-center mt-4 sm:mt-8 text-gray-500 text-xs sm:text-sm px-4">
          <p>© 2024 Suleyman Demirel University</p>
          <p className="hidden sm:block mt-1">Almaty region, Karasai district, Kaskelen</p>
          <p className="mt-1">🎓 Trilingual Education • 🌍 International Community • 🔬 Research Excellence</p>
        </div>
      </div>
    </div>
  );
};

export default BedrockQAApp;