function LoginApp() {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col" data-name="login-app" data-file="login-app.js">
            <Background3D />
            <Header />
            <main className="flex-grow flex items-center justify-center relative z-10 pt-20 pb-12 px-4">
                <LoginForm />
            </main>
            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoginApp />);