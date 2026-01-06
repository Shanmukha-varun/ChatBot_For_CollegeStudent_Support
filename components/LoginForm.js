function LoginForm() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            alert('Demo login successful!');
            window.location.href = 'index.html';
        }, 1500);
    };

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-8 transform transition-all hover:scale-[1.01]" data-name="login-form" data-file="components/LoginForm.js">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg transform -rotate-3">
                    <div className="icon-graduation-cap"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 mt-2">Access your student dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div className="icon-mail text-gray-400 group-focus-within:text-blue-500 transition-colors"></div>
                        </div>
                        <input 
                            type="email" 
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-all outline-none" 
                            placeholder="student@college.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div className="icon-lock text-gray-400 group-focus-within:text-blue-500 transition-colors"></div>
                        </div>
                        <input 
                            type="password" 
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-all outline-none" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-600">
                        <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        Remember me
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                </div>

                <button 
                    type="submit" 
                    className={`w-full btn-primary py-3.5 text-lg ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign In
                            <div className="icon-arrow-right"></div>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                Don't have an account? <a href="#" className="text-blue-600 font-medium hover:underline">Apply for Admission</a>
            </div>
        </div>
    );
}