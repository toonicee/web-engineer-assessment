export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-2xl animate-slide-up">
        <h1 className="text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
          Welcome to AEON
        </h1>
        <p className="text-xl text-gray-600 mb-8 animate-fade-in delay-200">
          A modern web application with secure authentication and seamless user
          experience.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors animate-scale-hover">
            Get Started
          </button>
          <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors animate-scale-hover">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
