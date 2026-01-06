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
                glass-3d
                w-full max-w-3xl mx-auto h-[550px]
                flex flex-col overflow-hidden
                relative z-20
                rounded-3xl
                hover-lift
                transition-transform duration-500
            "
            data-name="chat-interface"
            data-file="components/ChatInterface.js"
        >
            {/* Chat Header */}
            <div
                className="
                    bg-gradient-to-r from-indigo-600/90 via-blue-600/90 to-purple-600/90
                    px-5 py-4
                    text-white flex justify-between items-center
                    shadow-2xl
                    relative overflow-hidden
                "
            >
                {/* glossy sweep */}
                <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_55%)]" />
                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <span className="font-semibold text-sm tracking-wide">
                        Your Assistant☺️
                    </span>
                </div>
                <div className="icon-ellipsis text-white/80 relative z-10" />
            </div>

            {/* Messages Area */}
            <div
                className="
                    flex-1 overflow-y-auto
                    px-5 py-4 space-y-4
                    bg-gradient-to-b from-white/10 via-white/5 to-white/0
                    backdrop-blur-xl
                "
            >
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}
                    >
                        <div
                            className={`
                                relative max-w-[85%] px-5 py-3 text-sm
                                rounded-3xl shadow-xl transform-style-3d
                                transition-all duration-300 hover:scale-[1.02]
                                ${msg.type === 'user'
                                    ? 'bubble-3d-user text-white rounded-br-none'
                                    : 'bubble-3d-bot text-gray-800 rounded-bl-none'
                                }
                            `}
                        >
                            {/* subtle inner gloss */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-white/10 to-transparent opacity-70" />
                            <span className="relative z-10 whitespace-pre-wrap">
                                {msg.text}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator Bubble */}
                {isTyping && (
                    <div className="flex justify-start animate-[fadeIn_0.3s_ease-out]">
                        <div
                            className="
                                relative px-5 py-3 text-xs
                                rounded-3xl shadow-xl
                                bubble-3d-bot
                                flex items-center gap-3
                            "
                        >
                            <span className="text-[11px] text-gray-500 font-semibold tracking-wide relative z-10">
                                AI Typing
                            </span>
                            <div className="flex gap-1 relative z-10">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-t from-blue-500 to-indigo-400 shadow-md animate-[bounce_1s_infinite_0ms]" />
                                <div className="w-2 h-2 rounded-full bg-gradient-to-t from-blue-500 to-indigo-400 shadow-md animate-[bounce_1s_infinite_200ms]" />
                                <div className="w-2 h-2 rounded-full bg-gradient-to-t from-blue-500 to-indigo-400 shadow-md animate-[bounce_1s_infinite_400ms]" />
                            </div>
                            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-white/20 to-transparent" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                className="
                    px-4 py-3
                    bg-gradient-to-r from-white/40 via-white/30 to-white/40
                    backdrop-blur-xl
                    border-t border-white/40
                    flex gap-3 items-center
                "
            >
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask anything about admissions, placements, campus life..."
                        className="
                            w-full px-5 py-3 text-sm
                            bg-white/10 text-gray-900 placeholder-gray-500
                            rounded-3xl border border-white/40
                            shadow-inner
                            focus:outline-none focus:ring-2 focus:ring-indigo-400/70
                            backdrop-blur-xl
                            transition-all duration-300
                            hover:bg-white/20
                        "
                    />
                    {/* subtle top highlight */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-white/40 to-transparent opacity-70" />
                </div>

                <button
                    type="submit"
                    className="
                        relative
                        w-12 h-12
                        rounded-3xl
                        bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600
                        flex items-center justify-center
                        text-white
                        shadow-2xl
                        hover:shadow-[0_18px_35px_rgba(79,70,229,0.55)]
                        transition-all duration-300
                        hover:scale-110 active:scale-95
                        disabled:opacity-40 disabled:cursor-not-allowed
                    "
                    disabled={!inputValue.trim()}
                >
                    <div className="icon-send text-sm transform translate-x-0.5 translate-y-0.5 transition-transform" />
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_20%_0,rgba(255,255,255,0.9),transparent_55%)] opacity-80" />
                </button>
            </form>
        </div>
    );
}
