import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Navigation, Map, AlertTriangle, CheckCircle, Github } from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <nav className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Logo className="h-8 w-8 text-white" />
              <span className="ml-2 text-2xl font-bold">SafeEscape</span>
            </div>
            <div>
              <Link to="/auth" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Sign In
              </Link>
            </div>
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Navigate to Safety in Emergency Situations
              </h1>
              <p className="text-xl text-blue-100">
                SafeEscape provides optimal evacuation routes using advanced algorithms to guide you to the nearest safe location during emergencies.
              </p>
              <div className="pt-4">
                <Link to="/auth" className="btn btn-primary bg-white text-blue-600 hover:bg-blue-50">
                  Get Started
                </Link>
                <a href="#features" className="btn btn-secondary bg-transparent text-white border border-white hover:bg-blue-700 ml-4">
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-blue-500 rounded-lg opacity-20 blur-xl transform -rotate-6"></div>
                <img 
                  src="https://images.pexels.com/photos/69020/pexels-photo-69020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Emergency evacuation map" 
                  className="relative z-10 rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SafeEscape Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent evacuation system uses graph theory and Dijkstra's algorithm to calculate the optimal path to safety.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 fade-in">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Map size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location Mapping</h3>
              <p className="text-gray-600">
                Add your location to our intelligent map system which models the environment as a weighted graph of nodes and paths.
              </p>
            </div>

            <div className="card p-6 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety Verification</h3>
              <p className="text-gray-600">
                Instantly check if your current location is safe based on real-time data about hazards and emergency situations.
              </p>
            </div>

            <div className="card p-6 fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency SOS</h3>
              <p className="text-gray-600">
                Get immediate routing to the nearest safe location with our SOS feature that calculates the optimal evacuation path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Technology Behind SafeEscape</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine advanced graph theory algorithms with real-time data to ensure you reach safety quickly.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Graph visualization" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <div className="slide-up">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">1</span>
                  Weighted Graph Model
                </h3>
                <p className="text-gray-600 ml-11">
                  We represent the environment as a weighted graph where nodes are locations and edges are possible paths with weights based on safety factors.
                </p>
              </div>
              
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">2</span>
                  Dijkstra's Algorithm
                </h3>
                <p className="text-gray-600 ml-11">
                  Our C++ implementation of Dijkstra's algorithm calculates the shortest and safest path to the nearest evacuation point.
                </p>
              </div>
              
              <div className="slide-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">3</span>
                  Real-Time Updates
                </h3>
                <p className="text-gray-600 ml-11">
                  The system continuously updates path weights based on new information about hazards, blocked routes, and changing conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Ensure Your Safety?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Sign up for SafeEscape today and get access to real-time evacuation routing during emergencies.
          </p>
          <Link to="/auth" className="btn btn-primary bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-3">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Logo className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">SafeEscape</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} SafeEscape. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;