function ChatInterface({ onStateChange }) { // Changed prop name to onStateChange
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
        <div
            className="
                glass-3d w-full max-w-3xl mx-auto h-[550px]
                flex flex-col overflow-hidden shadow-2xl
                relative z-20 rounded-3xl
                hover-lift text-sharp
                transition-all duration-500
                -webkit-font-smoothing-antialiased
                -moz-osx-font-smoothing-grayscale
            "
            data-name="chat-interface"
            data-file="components/ChatInterface.js"
        >
            {/* Chat Header */}
            <div
                className="
                    bg-gradient-to-r from-indigo-600/95 via-blue-600/90 to-purple-600/95
                    px-6 py-5 text-white
                    flex justify-between items-center
                    shadow-2xl relative overflow-hidden
                    rounded-t-3xl
                    text-sharp
                "
            >
                {/* Glossy sweep effect */}
                <div className="pointer-events-none absolute inset-0 opacity-40 bg-gradient-to-r from-white/30 via-transparent to-white/20" />
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg animate-ping" />
                    <span className="font-bold text-base tracking-wide">
                        Campus Assistant ☺️
                    </span>
                </div>
                <div className="icon-ellipsis text-white/90 text-lg relative z-10 hover:rotate-90 transition-transform duration-300" />
            </div>

            {/* Messages Area */}
            <div
                className="
                    flex-1 overflow-y-auto
                    px-6 py-5 space-y-5
                    bg-gradient-to-br from-white/20 via-white/10 to-white/5
                    backdrop-blur-xl backdrop-saturate-150
                    text-sharp
                "
            >
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.4s_ease-out]`}
                    >
                        <div
                            className={`
                                text-sharp relative max-w-[85%]
                                px-6 py-4 text-sm leading-relaxed
                                rounded-3xl shadow-2xl
                                hover:scale-[1.02] hover-lift
                                transition-all duration-300
                                border border-white/20
                                transform-style-3d
                                -webkit-font-smoothing-antialiased
                                ${msg.type === 'user'
                                    ? 'bubble-3d-user text-white rounded-br-xl'
                                    : 'bubble-3d-bot text-gray-900 rounded-bl-xl'
                                }
                            `}
                        >
                            {/* Inner gloss highlight */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-80" />
                            <span className="relative z-10 block">
                                {msg.text}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator Bubble */}
                {isTyping && (
                    <div className="flex justify-start animate-[fadeInUp_0.4s_ease-out]">
                        <div
                            className="
                                text-sharp relative px-6 py-4
                                rounded-3xl shadow-xl
                                bubble-3d-bot
                                flex items-center gap-4
                                hover-lift
                                border border-white/30
                            "
                        >
                            <span className="text-sm font-semibold text-gray-600 tracking-wide relative z-10">
                                AI is typing...
                            </span>
                            <div className="flex gap-1.5 relative z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-blue-500 to-indigo-500 shadow-lg animate-[bounce_1.2s_infinite_0ms]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-blue-500 to-indigo-500 shadow-lg animate-[bounce_1.2s_infinite_200ms]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-blue-500 to-indigo-500 shadow-lg animate-[bounce_1.2s_infinite_400ms]" />
                            </div>
                            {/* Gloss */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-white/30 to-transparent" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                className="
                    px-6 py-4
                    bg-gradient-to-r from-white/50 via-white/40 to-white/50
                    backdrop-blur-2xl backdrop-saturate-200
                    border-t border-white/50 rounded-b-3xl
                    flex gap-3 items-stretch
                    text-sharp
                "
            >
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about admissions, placements, courses, campus life..."
                        className="
                            w-full px-6 py-4 text-sm font-medium
                            bg-white/20 text-gray-900 placeholder-gray-500
                            rounded-3xl border border-white/40 shadow-inner
                            focus:outline-none focus:ring-4 focus:ring-indigo-400/60 focus:border-white/60
                            backdrop-blur-xl transition-all duration-400
                            hover:bg-white/30 hover:shadow-md
                            text-sharp
                        "
                    />
                    {/* Top shine */}
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </div>

                <button
                    type="submit"
                    className="
                        relative w-14 h-14 flex-shrink-0
                        rounded-3xl
                        bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600
                        shadow-2xl hover:shadow-[0_20px_40px_rgba(99,102,241,0.5)]
                        flex items-center justify-center text-white
                        transition-all duration-400
                        hover:scale-110 hover:rotate-12 active:scale-95
                        disabled:opacity-40 disabled:cursor-not-allowed
                        hover-lift
                        overflow-hidden
                    "
                    disabled={!inputValue.trim()}
                >
                    <div className="icon-send text-lg relative z-10 transform group-hover:translate-x-0.5 transition-transform" />
                    {/* Button shine */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.9),transparent_50%)] opacity-70" />
                </button>
            </form>
        </div>
    );
}
