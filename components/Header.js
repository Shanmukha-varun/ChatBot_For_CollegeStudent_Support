function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100" data-name="header" data-file="components/Header.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = 'index.html'}>
                        {/* Placeholder for Anits Logo - using a graduation cap icon for now */}
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                            <div className="icon-graduation-cap text-xl"></div>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            AnitsBot
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
} 