function Background3D() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" data-name="background-3d" data-file="components/Background3D.js">
            {/* Gradient Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>
            
            {/* 3D Floating Elements (Simulated with Shadows and Perspective) */}
            
            {/* Element 1: Book */}
            <div className="absolute top-[15%] left-[10%] opacity-20 transform -rotate-12 animate-float-slow">
                <div className="icon-book text-9xl text-blue-900 drop-shadow-2xl"></div>
            </div>

            {/* Element 2: Graduation Cap */}
            <div className="absolute top-[20%] right-[15%] opacity-20 transform rotate-12 animate-float">
                <div className="icon-graduation-cap text-8xl text-indigo-900 drop-shadow-2xl"></div>
            </div>

            {/* Element 3: Globe/Network */}
            <div className="absolute bottom-[20%] left-[20%] opacity-10 transform rotate-45 animate-float-delayed">
                <div className="icon-globe text-[10rem] text-blue-800 drop-shadow-2xl"></div>
            </div>

            {/* Element 4: Award/Certificate */}
            <div className="absolute bottom-[30%] right-[10%] opacity-15 transform -rotate-6 animate-float-slow">
                <div className="icon-award text-9xl text-indigo-800 drop-shadow-2xl"></div>
            </div>
            
             {/* Element 5: Scroll/Diploma */}
            <div className="absolute top-[40%] left-[5%] opacity-10 transform rotate-90 animate-float">
                <div className="icon-scroll-text text-7xl text-blue-900 drop-shadow-xl"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://resource.trickle.so/vendor_lib/unpkg/lucide-static@0.516.0/font/lucide.css')] opacity-[0.02]" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)' }}></div>
        </div>
    );
}