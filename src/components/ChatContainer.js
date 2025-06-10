import React, { useRef, useEffect, useState } from 'react';
import { SDU_COLORS } from '../constants';
import Message from './Message';

const ChatContainer = ({ messages, currentText }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const { blue: sduBlue } = SDU_COLORS;

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

  const WelcomeMessage = () => (
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
  );

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl mb-4 sm:mb-8 overflow-hidden" 
         style={{ height: 'calc(100vh - 340px)', minHeight: '300px', maxHeight: '500px', position: 'relative' }}>
      
      {/* Fixed background that's always visible */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://sdu-bot-web-app-elements-bucket.s3.us-east-1.amazonaws.com/logo-1024x1016.png)',
          backgroundSize: 'min(250px, 40vw) min(250px, 40vw)',
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
            <WelcomeMessage />
          ) : (
            messages.map((message) => (
              <Message 
                key={message.id} 
                message={message} 
                currentText={currentText} 
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;