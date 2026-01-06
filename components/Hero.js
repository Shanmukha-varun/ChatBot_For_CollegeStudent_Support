function Hero() {
    // State: 'idle' | 'thinking' | 'happy'
    const [agentState, setAgentState] = React.useState('idle');

    return (

        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 flex items-center justify-center min-h-[80vh]" data-name="hero" data-file="components/Hero.js">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">

                {/* AI & Chat Container - Centered */}
                <div className="w-full relative z-10 perspective-1000 flex flex-col items-center">

                    {/* Live Badge - Restored */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mx-auto">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                         Admissions 2026 Live
                    </div>

                    {/* The AI Agent floats above the chat */}
                    <AIAgent agentState={agentState} />

                    {/* The Chat Interface */}
                    <div className="transform transition-transform hover:scale-[1.02] duration-500 mt-[-2rem] w-full flex justify-center">
                        <ChatInterface onStateChange={setAgentState} />
                    </div>
                </div>

            </div>
        </section>
    );
}
