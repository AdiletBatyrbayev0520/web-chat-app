import React, { useRef, useEffect, useState } from 'react';
import { SDU_COLORS, IMAGE_SOURCES} from '../constants';
import Message from './Message';

const ChatContainer = ({ messages, currentText }) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const { blue: sduBlue } = SDU_COLORS;
  const {sduLogoSource: sduLogoSource, backgroundImage: backgroundImage} = IMAGE_SOURCES
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
          src={sduLogoSource}
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
          backgroundImage: `url(${backgroundImage})`,
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