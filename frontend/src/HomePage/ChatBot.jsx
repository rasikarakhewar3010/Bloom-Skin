import { useState, useRef, useEffect, useCallback } from 'react';
import { FaSpa, FaPaperPlane, FaTimes } from 'react-icons/fa';

// --- Constants: Your original pink theme is preserved ---
const THEME_COLORS = {
  primary: '#FB6F92',
  primaryHover: '#E65A7F',
  secondary: '#FFC2D1',
  textLight: '#FFFFFF',
  textDark: '#333333',
  backgroundLight: '#FFFFFF',
  backgroundGray: '#F9FAFB',
};

// --- THE KNOWLEDGE BASE REMAINS THE SAME ---
const knowledgeBase = {
  greeting: {
    title: "Greeting",
    keywords: ['hello', 'hi', 'hey'],
    response: "Hello! I'm BloomBot, your AI Skincare Assistant. I'm here to answer your questions about the Bloom Skin application. How can I help you today?",
    followUp: null,
  },
  about: {
    title: "About Bloom Skin",
    keywords: ['what is bloom skin', 'about this app', 'purpose', 'goal'],
    response: "Bloom Skin is an advanced web application that uses Artificial Intelligence to analyze your skin. You simply upload a photo, and our AI identifies common skin concerns like different types of acne, dark spots, and pigmentation. The main goal is to give you quick, accessible, and personalized insights into your skin's health.",
    followUp: "Would you like to know how to use it, or the technology behind it?",
  },
  how_to_use: {
    title: "How to Use",
    keywords: ['how to use', 'steps', 'what do i do', 'guide', 'how does it work'],
    response: "Using Bloom Skin is a simple three-step process:\n\n1. Upload Your Photo: Go to our main analysis page and upload a clear, well-lit photo of your skin. Using your phone's camera is recommended for the best quality.\n\n2. Instant AI Analysis: Our AI model, MobileNetV2, will process your image in real-time to detect visible skin issues.\n\n3. View Your Results: You'll receive a personalized report detailing the findings, along with helpful care tips and suggestions for your skincare routine.",
    followUp: null,
  },
  photo_analysis: {
    title: "Photo Analysis",
    keywords: ['photo', 'image', 'upload', 'analyze', 'picture'],
    response: "While I can't analyze photos myself, our main application is built specifically for that! The image analysis tool uses a powerful AI to give you a detailed report. It's the core feature of our platform.",
    followUp: null,
  },
  technology: {
    title: "Technology Stack",
    keywords: ['technology', 'tech stack', 'what tech does it use', 'engine', 'built with'],
    response: "Bloom Skin is built on a modern, robust technology stack designed for performance and scalability. This is often called a 'full-stack' application.\n\nI can give you more details on the Frontend (what you see), the Backend (the server-side brain), or the AI Model itself. Which part interests you most?",
    followUp: "Which part would you like to know more about: Frontend, Backend, or the AI Model?",
  },
  frontend_tech: {
    title: "Frontend Technology",
    keywords: ['frontend', 'ui', 'interface', 'react'],
    response: "The user interface, or Frontend, is built using React.js. We chose React because it allows us to create a highly interactive, fast, and responsive 'single-page application'. This means the app feels smooth and seamless, like a native mobile app, but runs right in your web browser without any installation.",
    followUp: null,
  },
  backend_tech: {
    title: "Backend Technology",
    keywords: ['backend', 'server', 'node', 'express', 'mongodb'],
    response: "Our Backend runs on Node.js with the Express.js framework. This combination is excellent for handling many user requests at once. For data storage, like saving your analysis history, we use MongoDB, a flexible and scalable NoSQL database that works perfectly with our system.",
    followUp: null,
  },
  ai_model: {
    title: "AI Model",
    keywords: ['ai', 'model', 'mobilenet', 'deep learning', 'computer vision'],
    response: "The core of our analysis is a deep learning model called MobileNetV2. It's a state-of-the-art computer vision model that is both powerful and lightweight, making it perfect for delivering fast, real-time results on a web platform. It has been pre-trained to accurately identify the visual characteristics of various skin conditions.",
    followUp: null,
  },
  acne: {
    title: "About Acne",
    keywords: ['acne', 'pimple', 'breakout'],
    response: "Acne is a common condition where pores become clogged with oil and dead skin cells. For general care, it's best to use a gentle cleanser and products labeled 'non-comedogenic' (meaning they won't clog pores). \n\nOver-the-counter ingredients like salicylic acid (good for clearing pores) and benzoyl peroxide (good for targeting bacteria) can be very effective. For a specific analysis of your acne type, the best tool is our photo analysis feature!",
    followUp: null,
  },
  dark_spots: {
    title: "About Dark Spots",
    keywords: ['dark spot', 'pigmentation', 'hyperpigmentation'],
    response: "Dark spots, or hyperpigmentation, often occur after inflammation (like acne) or due to sun exposure. To help fade them, look for products with ingredients like Vitamin C, Niacinamide, or Retinoids. \n\nThe single most important step is daily use of a broad-spectrum sunscreen. Sun exposure can make dark spots much more prominent, so protection is key.",
    followUp: null,
  },
  dry_skin: {
    title: "About Dry Skin",
    keywords: ['dry skin', 'flaky', 'dehydrated'],
    response: "Dry skin lacks oil and moisture. The key is to provide hydration and support the skin's natural barrier. Seek out moisturizers with humectants like hyaluronic acid (which draws in water) and emollients like ceramides (which lock in moisture). Avoid harsh cleansers that can strip the skin.",
    followUp: null,
  },
  fallback: {
    title: "Fallback",
    keywords: [],
    response: "I'm sorry, I don't have detailed information on that. I'm best at answering questions about how the Bloom Skin app works, its technology, and general advice for common skin concerns like acne or dark spots.",
    followUp: null,
  }
};

const getBotResponse = (userInput, lastTopic) => {
  const lowerInput = userInput.toLowerCase().trim();
  if (['more', 'tell me more', 'details'].includes(lowerInput) && lastTopic?.followUp) {
    return { topic: lastTopic, response: lastTopic.followUp };
  }
  for (const key in knowledgeBase) {
    const topic = knowledgeBase[key];
    if (topic.keywords.some(keyword => lowerInput.includes(keyword))) {
      return { topic, response: topic.response };
    }
  }
  return { topic: knowledgeBase.fallback, response: knowledgeBase.fallback.response };
};


// --- Sub-components with polished looks ---
const ChatHeader = ({ onClose }) => (
  // The header is now back to a solid color
  <div className={`bg-[${THEME_COLORS.primary}] text-white p-4 rounded-t-2xl`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/20 rounded-full">
          <FaSpa className="text-xl" />
        </div>
        <div>
          <h2 className="text-lg font-bold">BloomBot</h2>
          <p className="text-xs opacity-90">AI Skincare Assistant</p>
        </div>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white" aria-label="Close chat">
        <FaTimes />
      </button>
    </div>
  </div>
);

const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot';
  return (
    <div className={`mb-4 flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-sm animate-fade-in-up ${
          isBot
            ? `bg-[${THEME_COLORS.backgroundLight}] text-[${THEME_COLORS.textDark}] rounded-tl-none`
            : `bg-[${THEME_COLORS.primary}] text-[${THEME_COLORS.textLight}] rounded-br-none`
        }`}
        style={{ animationDuration: '0.3s' }}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
    <div className="mb-4 flex justify-start animate-fade-in-up">
        <div className={`p-3 rounded-xl bg-white text-gray-800 rounded-tl-none shadow-sm`}>
            <div className="flex space-x-1.5 items-center">
                <div className={`w-2 h-2 rounded-full bg-[${THEME_COLORS.secondary}] animate-bounce`}></div>
                <div className={`w-2 h-2 rounded-full bg-[${THEME_COLORS.secondary}] animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                <div className={`w-2 h-2 rounded-full bg-[${THEME_COLORS.secondary}] animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    </div>
);

const QuickReply = ({ text, onSend }) => (
  <button
    onClick={() => onSend(text)}
    className="flex-shrink-0 px-4 py-2 bg-white border border-pink-200 text-pink-700 rounded-full text-sm hover:bg-pink-50 hover:border-pink-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
  >
    {text}
  </button>
);


const MessageList = ({ messages, isTyping, quickReplies, onQuickReplySend }) => {
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col">
      <div className="flex-grow">
        {messages.map((msg, index) => <MessageBubble key={index} message={msg} />)}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      {!isTyping && messages.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2 animate-fade-in-up">
            {quickReplies.map(reply => <QuickReply key={reply} text={reply} onSend={onQuickReplySend} />)}
        </div>
      )}
    </div>
  );
};


const ChatInput = ({ value, onChange, onSend, disabled }) => (
  <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && !disabled && onSend()}
        placeholder="Ask a question..."
        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm placeholder-gray-400 disabled:bg-gray-100 transition-shadow"
        disabled={disabled}
      />
      <button
        onClick={onSend}
        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-90"
        disabled={!value.trim() || disabled}
        aria-label="Send message"
      >
        <FaPaperPlane />
      </button>
    </div>
  </div>
);

// --- Main ChatBot Component ---
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastBotTopic, setLastBotTopic] = useState(null);

  const greetUser = useCallback(() => {
    setMessages([{ sender: 'bot', content: knowledgeBase.greeting.response }]);
    setLastBotTopic(knowledgeBase.greeting);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) greetUser();
  }, [isOpen, messages.length, greetUser]);

  const handleSendMessage = useCallback(async (textOverride) => {
    const currentInput = typeof textOverride === 'string' ? textOverride : inputValue;
    if (!currentInput.trim()) return;

    const userMessage = { sender: 'user', content: currentInput };
    setMessages(prev => [...prev, userMessage]);
    if (typeof textOverride !== 'string') setInputValue('');
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const { topic, response } = getBotResponse(currentInput, lastBotTopic);
      setMessages(prev => [...prev, { sender: 'bot', content: response }]);
      setLastBotTopic(topic);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { sender: 'bot', content: "I'm having a little trouble right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, lastBotTopic]);

  const quickReplies = ["How does it work?", "What tech is used?", "Tell me about acne"];
  
  return (
    <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-[1000]">
      {isOpen ? (
        <div className="w-full sm:w-96 h-[80vh] sm:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-pink-100 transform transition-all duration-300 max-w-[calc(100vw-2rem)] animate-slide-in">
          <ChatHeader onClose={() => setIsOpen(false)} />
          <MessageList 
            messages={messages} 
            isTyping={isTyping}
            quickReplies={quickReplies}
            onQuickReplySend={handleSendMessage}
          />
          <ChatInput 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSend={handleSendMessage}
            disabled={isTyping}
          />
        </div>
      ) : (
        // The floating button is now back to bouncing
        <button
          onClick={() => setIsOpen(true)}
          className={`w-16 h-16 bg-[${THEME_COLORS.primary}] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[${THEME_COLORS.primary}] focus:ring-offset-2 animate-bounce`}
          aria-label="Open BloomSkin chatbot"
          style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}
        >
          <FaSpa className="text-2xl" />
          <span className={`absolute top-0 right-0 w-4 h-4 bg-[${THEME_COLORS.secondary}] rounded-full border-2 border-white`}></span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;