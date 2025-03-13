
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-50 via-gray-100 to-cyan-50 font-['Inter',_sans-serif] overflow-hidden">

      <div className="bg-cyan-800 text-white text-center py-4 shadow-xl sticky top-0 z-10">
        <h3 className="text-base font-medium tracking-wider animate-slide-in-down">
          Blockchain-driven agriculture connecting farmers and consumers seamlessly
        </h3>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">

        <div className="flex-1 bg-gradient-to-br from-cyan-600 to-teal-500 text-white flex items-center justify-center p-8 lg:p-20 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="max-w-xl text-center lg:text-left relative z-10 transform transition-all duration-500 group-hover:scale-105">
            <span className="inline-block bg-white text-cyan-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-md animate-fade-in-up">
              For Farmers
            </span>
            <h2 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Grow with <br />
              <span className="text-yellow-300">Purpose</span>
            </h2>
            <p className="text-lg text-gray-100 mb-8 opacity-85 leading-relaxed">
              Skip the middleman, increase revenue, and embrace sustainable farming with cutting-edge transparency.
            </p>
            <Link to="/farmer">
              <button className="bg-yellow-400 text-cyan-900 font-semibold py-4 px-12 rounded-full shadow-lg hover:bg-yellow-300 hover:shadow-xl hover:scale-105 transition-all duration-300">
                Start Farming
              </button>
            </Link>
            <div className="flex justify-center lg:justify-start gap-8 mt-12">
              {["1150/1150302", "7417/7417717", "4062/4062297", "11998/11998153"].map((icon, idx) => (
                <img
                  key={idx}
                  src={`https://cdn-icons-png.flaticon.com/128/${icon}.png`}
                  alt={`Partner ${idx + 1}`}
                  className="w-12 h-12 opacity-75 hover:opacity-100 hover:scale-110 transition-all duration-300"
                />
              ))}
            </div>
  
            <div className="mt-12 grid grid-cols-2 gap-6 text-sm">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-inner">
                <p className="font-bold text-yellow-300 text-lg">10K+</p>
                <p className="text-gray-100">Farmers Onboard</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-inner">
                <p className="font-bold text-yellow-300 text-lg">95%</p>
                <p className="text-gray-100">Profit Boost</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-purple-700 to-indigo-600 text-white flex items-center justify-center p-8 lg:p-20 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="max-w-xl text-center lg:text-left relative z-10 transform transition-all duration-500 group-hover:scale-105">
            <span className="inline-block bg-white text-purple-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-md animate-fade-in-up">
              For Consumers
            </span>
            <h2 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Taste the <br />
              <span className="text-rose-300">Difference</span>
            </h2>
            <p className="text-lg text-gray-100 mb-8 opacity-85 leading-relaxed">
              Enjoy farm-fresh produce at fair prices, delivered directly from the source.
            </p>
            <Link to="/logincon">
              <button className="bg-rose-400 text-purple-900 font-semibold py-4 px-12 rounded-full shadow-lg hover:bg-rose-300 hover:shadow-xl hover:scale-105 transition-all duration-300">
                Start Shopping
              </button>
            </Link>
            <div className="flex justify-center lg:justify-start gap-8 mt-12">
              {["2761/2761014", "9587/9587475", "11100/11100051", "6012/6012987"].map((icon, idx) => (
                <img
                  key={idx}
                  src={`https://cdn-icons-png.flaticon.com/128/${icon}.png`}
                  alt={`Partner ${idx + 1}`}
                  className="w-12 h-12 opacity-75 hover:opacity-100 hover:scale-110 transition-all duration-300"
                />
              ))}
            </div>
  
            <div className="mt-12 grid grid-cols-2 gap-6 text-sm">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-inner">
                <p className="font-bold text-rose-300 text-lg">50K+</p>
                <p className="text-gray-100">Satisfied Buyers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-inner">
                <p className="font-bold text-rose-300 text-lg">100%</p>
                <p className="text-gray-100">Freshness</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-zinc-900 text-white py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between gap-12 relative z-10">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold text-cyan-400 tracking-wide">Farmer To Consumer</h2>
            <p className="text-gray-300 mt-4 text-sm leading-relaxed max-w-md">
              Redefining agriculture with a modern, sustainable approach to connect farmers and consumers.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-purple-400 mb-4">Navigation</h2>
            <ul className="space-y-3">
              {["/", "/aboutus", "/resource"].map((path, idx) => (
                <li key={idx}>
                  <Link
                    to={path}
                    className="text-gray-300 hover:text-purple-300 transition duration-300 text-sm font-medium"
                  >
                    {["Home", "About Us", "Resources"][idx]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Contact</h2>
            <p className="text-gray-300 text-sm">Email: hello@farmertoconsumer.com</p>
            <p className="text-gray-300 text-sm">Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-12">
          © 2025 Farmer To Consumer | Designed for Tomorrow
        </div>
      </footer>
    </div>
  );
};

export default Login;