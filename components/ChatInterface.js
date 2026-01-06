function ChatInterface({ onStateChange }) { // Changed prop name to onStateChange
    const [messages, setMessages] = React.useState([
        { id: 1, type: 'bot', text: 'Hi there! I am your campus guide. Ask me about admissions, placements, or campus facilities.' }
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
            setMessages(prev => [...prev, newUserMsg, { id: Date.now() + 1, type: 'bot', text: botReply }]);
            setInputValue('');
            setIsTyping(false);
            if (onStateChange) onStateChange('happy');
            setTimeout(() => {
                if (onStateChange) onStateChange('idle');
            }, 3000);
            return;
        }

        // Trigger THINKING state
        if (onStateChange) onStateChange('thinking');

        const apiEndpoint = `${window.API_CONFIG.BASE_URL}${window.API_CONFIG.ENDPOINTS.CHAT}`;

        // Add ngrok skip warning header for free tier
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
                // Assume backend returns { reply: "..." } or { message: "..." }
                const botReply = data.answer || "I received your message, but I'm not sure how to reply.";

                setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botReply }]);
                setIsTyping(false);

                // Trigger HAPPY/ANSWERING state
                if (onStateChange) onStateChange('happy');

                // Reset to IDLE after showing happy gesture
                setTimeout(() => {
                    if (onStateChange) onStateChange('idle');
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Sorry, I'm having trouble connecting to the server. Please check your connection." }]);
                setIsTyping(false);
                if (onStateChange) onStateChange('idle');
            });
    };

    const messagesEndRef = React.useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    React.useEffect(scrollToBottom, [messages, isTyping]);

    return (
        <div className="glass-panel w-full max-w-3xl mx-auto h-[550px] flex flex-col overflow-hidden shadow-2xl relative z-20" data-name="chat-interface" data-file="components/ChatInterface.js">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-sm">Admissions Assistant</span>
                </div>
                <div className="icon-ellipsis text-white/80"></div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80 backdrop-blur-sm">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all hover:shadow-md ${msg.type === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Typing Indicator Bubble */}
                {isTyping && (
                    <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium mr-1">AI Typing</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 placeholder-gray-500"
                />
                <button
                    type="submit"
                    className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                    disabled={!inputValue.trim()}
                >
                    <div className="icon-send text-sm transform translate-x-0.5 translate-y-0.5 group-hover:scale-110 transition-transform"></div>
                </button>
            </form>
        </div>
    );
}