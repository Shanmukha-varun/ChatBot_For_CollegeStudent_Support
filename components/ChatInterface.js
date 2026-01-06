import React, { useState, useRef, useEffect } from 'react';

// Add these keyframes to your global CSS or inside a <style> tag in your main index.html/App.js
// If using Tailwind config, add them there. For now, I'll assume standard Tailwind availability.
const styles = {
    slideUp: "animate-[slideUp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]",
    typingDot: "animate-[bounce_1.4s_infinite_ease-in-out_both]",
};

function ChatInterface({ onStateChange }) {
    // --- 1. EXISTING LOGIC (UNCHANGED) ---
    const [messages, setMessages] = React.useState([
        { id: 1, type: 'bot', text: 'Hi there! I am your campus guide. Ask me about admissions, placements.' }
    ]);
    const [inputValue, setInputValue] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg = { id: Date.now(), type: 'user', text: inputValue };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        if (inputValue.trim().toLowerCase() === 'hi') {
            const botReply = "hello,How can i help you";
            // Note: In your original code you added newUserMsg twice here (once above, once in setMessages). 
            // I kept it exactly as your logic was, but usually you only add it once. 
            // Assuming your logic requires this flow:
            setMessages(prev => [...prev, newUserMsg, { id: Date.now() + 1, type: 'bot', text: botReply }]);
            setInputValue('');
            setIsTyping(false);
            if (onStateChange) onStateChange('happy');
            setTimeout(() => {
                if (onStateChange) onStateChange('idle');
            }, 3000);
            return;
        }

        if (onStateChange) onStateChange('thinking');

        const apiEndpoint = `${window.API_CONFIG?.BASE_URL || ''}${window.API_CONFIG?.ENDPOINTS?.CHAT || ''}`;

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ question: inputValue })
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const botReply = data.answer || "I received your message, but I'm not sure how to reply.";
                setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botReply }]);
                setIsTyping(false);
                if (onStateChange) onStateChange('happy');
                setTimeout(() => { if (onStateChange) onStateChange('idle'); }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Sorry, I'm having trouble connecting to the server." }]);
                setIsTyping(false);
                if (onStateChange) onStateChange('idle');
            });
    };

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages, isTyping]);

    // --- 2. NEW VISUAL LOGIC (3D TILT & GLOW) ---
    const containerRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on cursor position
        // Rotates between -5 and 5 degrees
        const xRotation = ((y - rect.height / 2) / rect.height) * 4; 
        const yRotation = ((x - rect.width / 2) / rect.width) * -4;

        setRotation({ x: xRotation, y: yRotation });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 }); // Reset to flat
    };

    return (
        // Perspective container to allow 3D depth
        <div className="w-full max-w-3xl mx-auto py-10 perspective-1000">
            {/* INJECT CUSTOM ANIMATIONS */}
            <style>{`
                @keyframes slideUp {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .perspective-1000 { perspective: 1000px; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>

            <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transition: 'transform 0.1s ease-out'
                }}
                className="
                    relative h-[600px] flex flex-col overflow-hidden 
                    rounded-[30px] border border-white/20 shadow-2xl
                    backdrop-blur-xl bg-white/10 
                "
            >
                {/* Background Decor (Glowing Orbs) */}
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-purple-500/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-blue-500/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen animate-pulse"></div>

                {/* --- HEADER --- */}
                <div className="relative z-10 p-5 bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-blue-600/90 backdrop-blur-md flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80] animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white tracking-wide text-lg drop-shadow-sm">Campus AI</h3>
                            <p className="text-indigo-200 text-xs font-medium">Online & Ready</p>
                        </div>
                    </div>
                    {/* Visual Eye Candy Icon */}
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* --- MESSAGES AREA --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative z-10">
                    {messages.map((msg, index) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} ${styles.slideUp}`}
                            style={{ animationDelay: `${index * 0.05}s` }} // Stagger animation
                        >
                            {/* Avatar for Bot */}
                            {msg.type === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-lg mt-auto">
                                    AI
                                </div>
                            )}
                            
                            <div className={`
                                max-w-[80%] px-5 py-3.5 text-sm shadow-lg backdrop-blur-md border
                                ${msg.type === 'user'
                                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-sm border-indigo-400/30'
                                    : 'bg-white/80 text-gray-800 rounded-2xl rounded-tl-sm border-white/40'
                                }
                                transition-all hover:scale-[1.02] duration-200
                            `}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className={`flex justify-start ${styles.slideUp}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-lg mt-auto">AI</div>
                            <div className="bg-white/80 border border-white/40 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                                <div className={`w-2 h-2 bg-indigo-500 rounded-full ${styles.typingDot}`} style={{ animationDelay: '0ms' }}></div>
                                <div className={`w-2 h-2 bg-indigo-500 rounded-full ${styles.typingDot}`} style={{ animationDelay: '150ms' }}></div>
                                <div className={`w-2 h-2 bg-indigo-500 rounded-full ${styles.typingDot}`} style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* --- INPUT AREA --- */}
                <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/20 relative z-20">
                    <form onSubmit={handleSend} className="relative flex gap-2 items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            className="
                                flex-1 bg-white/70 text-gray-800 placeholder-gray-500/80 
                                rounded-full px-6 py-3.5 text-sm border border-white/50
                                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white
                                shadow-inner transition-all
                            "
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="
                                w-12 h-12 rounded-full 
                                bg-gradient-to-r from-indigo-600 to-violet-600 
                                text-white shadow-lg shadow-indigo-500/30 
                                flex items-center justify-center 
                                hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100 
                                transition-all duration-300 group
                            "
                        >
                            <svg 
                                className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatInterface;
