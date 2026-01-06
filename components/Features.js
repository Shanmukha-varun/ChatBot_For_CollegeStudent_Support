function Features() {
    const features = [
        {
            icon: 'icon-graduation-cap',
            title: 'Admissions Support',
            desc: 'Step-by-step guidance on application processes, deadlines, and requirements for all streams.',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: 'icon-briefcase',
            title: 'Placement Stats',
            desc: 'Real-time data on recruitment drives, salary packages, and top hiring partners.',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: 'icon-building-2',
            title: 'Campus Details',
            desc: 'Explore hostels, labs, libraries, and sports facilities through our interactive guide.',
            color: 'bg-indigo-100 text-indigo-600'
        }
    ];

    return (
        <section id="features" className="py-20 bg-white relative" data-name="features" data-file="components/Features.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Our AI Support?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We combine cutting-edge technology with comprehensive academic data to provide you with the most accurate information instantly.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <div className={`${feature.icon} text-2xl`}></div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}