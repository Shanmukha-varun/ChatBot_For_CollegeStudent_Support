function Hero() {
    // State: 'idle' | 'thinking' | 'happy'
    const [agentState, setAgentState] = React.useState('idle');

    return (
        <section
            className="
                relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4
                flex items-center justify-center
                min-h-[60vh]
                overflow-hidden
            "
            data-name="hero"
            data-file="components/Hero.js"
        >
            {/* Enhanced 3D Glass Container */}
            <div
                className="
                    glass-3d p-8 lg:p-12 rounded-[3rem]
                    w-full max-w-6xl mx-auto
                    flex flex-col items-center justify-center
                    shadow-2xl hover-lift
                    border border-white/30
                    backdrop-blur-3xl
                    relative z-20
                "
            >
                {/* Subtle inner glow */}
                <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20 blur-xl" />

                {/* AI & Chat Container - Centered */}
                <div
                    className="
                        w-full relative z-30
                        perspective-[1500px]
                        flex flex-col items-center
                        transform-style-3d
                    "
                >
                    {/* The AI Agent floats above the chat */}
                    <div className="relative mb-[-3rem] lg:mb-[-4rem] z-40 hover-lift">
                        <AIAgent agentState={agentState} />
                    </div>

                    {/* The Chat Interface */}
                    <div
                        className="
                            w-full max-w-4xl flex justify-center
                            transform transition-all duration-700 ease-out
                            hover:scale-[1.01]
                            relative z-30
                        "
                    >
                        <ChatInterface onStateChange={setAgentState} />
                    </div>
                </div>

                {/* Bottom decorative shine */}
                <div className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-t from-white/40 to-transparent rounded-3xl blur-xl" />
            </div>

            {/* Floating accent elements */}
            <div className="absolute top-1/4 left-10 w-24 h-24 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-3xl blur-xl animate-float-slow" />
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl animate-float-delayed" />
        </section>
    );
}
