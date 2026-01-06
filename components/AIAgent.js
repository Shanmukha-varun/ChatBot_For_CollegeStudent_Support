function AIAgent({ agentState = 'idle' }) { // agentState: 'idle' | 'thinking' | 'happy'
    const [eyePosition, setEyePosition] = React.useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = React.useState(false);

    // Handle cursor tracking
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (agentState !== 'idle') {
                // When not idle (e.g. thinking or happy), reset eyes to center
                setEyePosition({ x: 0, y: 0 });
                return;
            }

            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Calculate offset (limit movement range)
            const moveX = (clientX - centerX) / 30; 
            const moveY = (clientY - centerY) / 30;

            const clampedX = Math.min(Math.max(moveX, -15), 15);
            const clampedY = Math.min(Math.max(moveY, -10), 10);

            setEyePosition({ x: clampedX, y: clampedY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [agentState]);

    // Handle blinking
    React.useEffect(() => {
        const blinkInterval = setInterval(() => {
            if (agentState === 'happy') return; // Don't blink when happy/squinting
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);
        }, 4000);

        return () => clearInterval(blinkInterval);
    }, [agentState]);

    const isThinking = agentState === 'thinking';
    const isHappy = agentState === 'happy';

    return (
        <div className={`relative w-48 h-48 mx-auto mb-8 transition-all duration-500 ${isHappy ? 'animate-[bounce_0.5s_ease-in-out_2]' : 'animate-float'}`} data-name="ai-agent" data-file="components/AIAgent.js">
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-blue-400 rounded-full blur-3xl transition-opacity duration-500 ${isThinking ? 'opacity-60 animate-pulse' : 'opacity-30'}`}></div>

            {/* Towers */}
            <div className="absolute -top-6 left-6 w-4 h-12 bg-gray-300 rounded-t-lg z-0 flex flex-col items-center justify-end">
                <div className="w-6 h-1 bg-gray-400 rounded-full mb-1"></div>
                <div className="w-1 h-6 bg-gray-300 absolute -top-4"></div>
                <div className={`w-2 h-2 bg-red-500 rounded-full absolute -top-5 ${isThinking ? 'animate-ping' : ''} ${isHappy ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : ''}`}></div>
            </div>
            <div className="absolute -top-6 right-6 w-4 h-12 bg-gray-300 rounded-t-lg z-0 flex flex-col items-center justify-end">
                <div className="w-6 h-1 bg-gray-400 rounded-full mb-1"></div>
                <div className="w-1 h-6 bg-gray-300 absolute -top-4"></div>
                <div className={`w-2 h-2 bg-red-500 rounded-full absolute -top-5 ${isThinking ? 'animate-ping delay-75' : ''} ${isHappy ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : ''}`}></div>
            </div>

            {/* Head */}
            <div className="relative z-10 w-full h-full bg-gradient-to-b from-white to-blue-50 rounded-[2.5rem] shadow-2xl border-4 border-white flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute -right-2 top-16 w-4 h-16 bg-gray-200 rounded-r-lg border-l border-gray-300"></div>
                <div className="absolute -left-2 top-16 w-4 h-16 bg-gray-200 rounded-l-lg border-r border-gray-300"></div>

                {/* Eyes Container */}
                <div className="relative w-32 h-20 flex justify-between items-center px-2">
                    
                    {/* Common Eye Style Function */}
                    {['left', 'right'].map(side => (
                        <div key={side} className="w-12 h-12 bg-gray-800 rounded-full relative overflow-hidden border-2 border-gray-700 shadow-inner group transition-all duration-300">
                            
                            {/* Normal Pupil */}
                            <div 
                                className={`w-4 h-4 bg-blue-400 rounded-full absolute top-1/2 left-1/2 shadow-[0_0_10px_rgba(96,165,250,0.8)] transition-all duration-300 ${isHappy ? 'scale-0' : 'scale-100'}`}
                                style={{ 
                                    transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px))`,
                                }}
                            >
                                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 right-0.5 opacity-80"></div>
                            </div>

                            {/* Happy Eye (Upside down U shape) */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHappy ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="w-8 h-4 border-t-4 border-blue-400 rounded-t-full"></div>
                            </div>

                            {/* Thinking Overlay */}
                            {isThinking && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            {/* Blink Eyelid */}
                            <div 
                                className={`absolute inset-0 bg-gray-800 transition-all duration-100 ${isBlinking ? 'h-full' : 'h-0'}`} 
                                style={{ top: 0 }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Mouth */}
                <div className={`
                    border-gray-300 transition-all duration-300 mt-2
                    ${isThinking ? 'w-4 h-4 border-4 rounded-full border-t-transparent animate-spin' : ''}
                    ${isHappy ? 'w-10 h-5 border-b-4 rounded-b-full bg-gray-800 border-transparent mb-1' : 'w-8 h-4 border-b-4 rounded-full'}
                `}>
                    {isHappy && <div className="w-6 h-2 bg-red-400 rounded-t-lg mx-auto mt-2"></div>}
                </div>
            </div>
            
            {/* Status Indicator */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold text-green-600 flex items-center gap-1 border border-green-100 whitespace-nowrap">
                <div className={`w-2 h-2 rounded-full 
                    ${isThinking ? 'bg-yellow-500 animate-ping' : ''}
                    ${isHappy ? 'bg-green-500' : ''}
                    ${!isThinking && !isHappy ? 'bg-green-500 animate-pulse' : ''}
                `}></div>
                {isThinking ? 'PROCESSING...' : isHappy ? 'ANSWERING' : 'ONLINE'}
            </div>
        </div>
    );
}