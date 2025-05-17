import { useState, useRef, useEffect } from 'react';
import { FaSpa, FaPaperPlane, FaCamera, FaUpload, FaTimes } from 'react-icons/fa';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content: "Hello! I'm BloomBot, your skincare assistant. You can ask me about skin concerns or upload a photo for analysis."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { sender: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Mock response for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponses = [
        "I recommend using our BloomSkin Clarifying Serum for acne concerns.",
        "For dark spots, try our Brightening Night Cream with vitamin C.",
        "Daily sunscreen is essential for preventing further pigmentation.",
        "Would you like me to analyze a photo of your skin concern?",
        "Our BloomSkin Hydrating Mask works wonders for dry skin."
      ];
      const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      setMessages(prev => [...prev, { sender: 'bot', content: reply }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        content: "I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const showPhotoOptions = () => {
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        content: "Please choose an option:",
        options: [
          { text: "Upload from device", icon: <FaUpload className="mr-2" />, action: uploadPhoto },
          { text: "Take a photo", icon: <FaCamera className="mr-2" />, action: takePhoto }
        ]
      }
    ]);
  };

  const uploadPhoto = () => {
    // Implement photo upload logic
    alert("Photo upload functionality would be implemented here");
  };

  const takePhoto = () => {
    // Implement camera access logic
    alert("Camera functionality would be implemented here");
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      {isOpen ? (
        <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-pink-200 transform transition-all duration-300">
          {/* Header */}
          <div className="bg-[#FB6F92] text-white p-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <FaSpa className="text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">BloomSkin</h2>
                  <p className="text-xs opacity-90">Your personal skincare assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'bot'
                      ? 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                      : 'bg-[#FB6F92] text-white rounded-tr-none'
                  }`}
                >
                  <div className="text-sm">
                    {message.content}
                    {message.options && (
                      <div className="mt-2 space-y-2">
                        {message.options.map((option, i) => (
                          <button
                            key={i}
                            onClick={option.action}
                            className={`flex items-center w-full p-2 text-left rounded-lg transition-colors ${
                              message.sender === 'bot'
                                ? 'bg-[#FFC2D1] text-[#FB6F92] hover:bg-[#FB6F92] hover:text-white'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {option.icon}
                            <span>{option.text}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl bg-white text-gray-800 rounded-tl-none shadow-sm">
                  <div className="text-sm flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-[#FB6F92] animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-[#FB6F92] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#FB6F92] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-pink-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your skin concerns..."
                className="flex-1 p-3 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FB6F92] text-sm placeholder-pink-400"
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 flex items-center justify-center bg-[#FB6F92] text-white rounded-full hover:bg-[#E65A7F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FB6F92] focus:ring-offset-2"
                disabled={isTyping}
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#FB6F92] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[#FB6F92] focus:ring-offset-2 animate-bounce"
          aria-label="Open chatbot"
          style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}
        >
          <FaSpa className="text-2xl" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-[#FFC2D1] rounded-full border-2 border-white"></span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;