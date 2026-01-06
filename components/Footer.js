function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800" data-name="footer" data-file="components/Footer.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <div className="icon-graduation-cap text-lg"></div>
                            </div>
                            <span className="text-xl font-bold">ANITS AI</span>
                        </div>
                        <p className="text-gray-400 max-w-sm">
                            Empowering students with instant access to college information through advanced AI technology.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center gap-2">
                                <div className="icon-mail text-sm"></div>
                                principal@anits.edu.in
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="icon-phone text-sm"></div>
                                +91 8712005999
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    &copy; 2026 ANITS AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}