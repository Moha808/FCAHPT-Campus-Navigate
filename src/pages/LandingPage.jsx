import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Compass, User, KeySquare, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 font-sans selection:bg-brand-500 selection:text-white flex flex-col transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-6 sm:px-12 flex justify-between items-center z-10 absolute top-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <MapPin className="text-white w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">FCAHPT</span>
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-slate-700"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 pt-32 pb-20 max-w-7xl mx-auto w-full gap-16">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-semibold text-sm mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Campus Navigation System 2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6"
          >
            Never get lost <br />
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">on campus</span> again.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-xl"
          >
            Explore the Federal College of Animal Health and Production Technology with our interactive 3D map. Find hostels, clinics, and get turn-by-turn directions instantly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full sm:w-auto"
          >
            <button 
              onClick={() => navigate('/map')}
              className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              Launch Map 
              <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Right Graphics */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full relative"
        >
          {/* Generated 3D Campus Graphic */}
          <div className="relative w-full max-w-[500px] mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-purple-500 rounded-3xl opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"></div>
            
            <motion.div 
              whileHover={{ y: -10, rotate: 1 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800"
            >
              <img 
                src="/hero-graphic.jpg" 
                alt="FCAHPT 3D Campus Map Illustration" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="w-full bg-white dark:bg-slate-800 py-24 border-t border-gray-100 dark:border-slate-700 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 transition-colors">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Interactive Map</h3>
              <p className="text-gray-500 dark:text-gray-400">Explore the campus from a bird's eye view. Click on any building to see details, photos, and exact locations.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 transition-colors">
                <Navigation className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Routing</h3>
              <p className="text-gray-500 dark:text-gray-400">Never get lost again. Get instant point-to-point directions across the campus road network.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 transition-colors">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Quick Search</h3>
              <p className="text-gray-500 dark:text-gray-400">Find exactly what you are looking for in seconds. Search for hostels, clinics, departments, and sports facilities instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-12 text-center z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30">
              <MapPin className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">FCAHPT Navigate</span>
          </div>
          <p className="mb-4 max-w-md text-sm leading-relaxed">
            The official digital navigation system for the Federal College of Animal Health and Production Technology, Vom.
          </p>
          <div className="w-12 h-px bg-gray-800 my-6"></div>
          <p className="text-xs">&copy; {new Date().getFullYear()} FCAHPT. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
