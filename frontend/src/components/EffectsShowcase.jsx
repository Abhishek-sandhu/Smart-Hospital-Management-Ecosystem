const EffectsShowcase = () => {
  return (
    <div className="min-h-screen bg-gradient-mesh p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-center text-white mb-12 animate-fade-in">
          Enhanced CSS Effects Showcase
        </h1>

        {/* Animation Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 glass-effect animate-slide-in-left">
            <h3 className="text-xl font-semibold text-white mb-4">Fade In Animation</h3>
            <div className="w-16 h-16 bg-primary-500 rounded-full animate-fade-in mx-auto"></div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 glass-effect animate-slide-in-right">
            <h3 className="text-xl font-semibold text-white mb-4">Bounce In Animation</h3>
            <div className="w-16 h-16 bg-accent-500 rounded-full animate-bounce-in mx-auto"></div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 glass-effect animate-float">
            <h3 className="text-xl font-semibold text-white mb-4">Float Animation</h3>
            <div className="w-16 h-16 bg-success-500 rounded-full animate-float mx-auto"></div>
          </div>
        </div>

        {/* Button Effects */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-8">Interactive Button Effects</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-gradient-ocean text-white font-semibold rounded-full btn-gradient shadow-glow hover:shadow-glow-lg transition-all duration-300">
              Gradient Button
            </button>
            <button className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-full animate-glow shadow-neon hover:scale-105 transition-all duration-300">
              Glowing Button
            </button>
            <button className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-full animate-pulse-custom hover:bg-primary-50 transition-all duration-300">
              Pulse Button
            </button>
          </div>
        </div>

        {/* Card Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover">
            <div className="w-full h-32 bg-gradient-sunset rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hover Card</h3>
            <p className="text-gray-600">This card lifts up on hover with enhanced shadows.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover border-2 border-primary-200">
            <div className="w-full h-32 bg-gradient-forest rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Border Card</h3>
            <p className="text-gray-600">Cards with beautiful gradient backgrounds.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover neon-border">
            <div className="w-full h-32 bg-gradient-fire rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Neon Border</h3>
            <p className="text-gray-600">Animated neon border effects for special elements.</p>
          </div>
        </div>

        {/* Form Elements */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 glass-effect">
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">Enhanced Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-white font-medium mb-2">Input Field</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 input-focus backdrop-blur-sm"
                placeholder="Type something..."
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Select Field</label>
              <select className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white input-focus backdrop-blur-sm">
                <option value="">Choose an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="mt-12 text-center">
          <div className="inline-block px-8 py-4 bg-gradient-ocean text-white font-semibold rounded-full animate-shimmer">
            Loading Effect
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectsShowcase;