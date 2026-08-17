import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Compass, Shield, Sun, Moon, GraduationCap, Stethoscope, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const stats = [
  { value: '22+', label: 'Locations' },
  { value: '5', label: 'Categories' },
  { value: '100%', label: 'Free' },
];

const features = [
  {
    icon: MapPin,
    color: 'from-brand-500 to-brand-600',
    shadow: 'shadow-brand-500/25',
    title: 'Interactive Map',
    desc: 'Explore every building on campus with a satellite-view map. Tap any pin to see photos, descriptions, and exact coordinates.',
  },
  {
    icon: Navigation,
    color: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/25',
    title: 'Smart Routing',
    desc: 'Get the shortest walking route from your exact GPS location to any campus destination, powered by Dijkstra\'s algorithm.',
  },
  {
    icon: Compass,
    color: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/25',
    title: 'Category Filters',
    desc: 'Instantly filter the map by Academic, Hostel, Clinic, Admin, or Facility — find exactly what you need in seconds.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col overflow-x-hidden">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="w-full px-6 sm:px-12 py-5 flex justify-between items-center fixed top-0 z-50 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-lg border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <MapPin className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[15px] tracking-tight text-gray-900 dark:text-white">FCAHPT</span>
            <span className="text-[10px] font-semibold text-brand-500 uppercase tracking-widest">Navigate</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => navigate('/map')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-500/25 hidden sm:flex items-center gap-1.5"
          >
            Open Map <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 pt-36 pb-24 max-w-7xl mx-auto w-full gap-16">

        {/* Left */}
        <div className="flex-1 flex flex-col items-start text-left z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Campus Navigation System · Vom, Plateau State
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05] mb-5"
          >
            Find your way<br />
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-blue-600 bg-clip-text text-transparent">
              across campus.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8"
          >
            The official interactive map for <strong className="text-gray-700 dark:text-gray-200">FCAHPT, Vom</strong>. Explore hostels, clinics, departments and get GPS-powered turn-by-turn directions in seconds.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex gap-6 mb-10"
          >
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate('/map')}
              className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-brand-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              Launch Map
              <Navigation className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="px-8 py-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </button>
          </motion.div>
        </div>

        {/* Right — hero image card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <div className="relative w-full max-w-[520px] mx-auto">
            {/* Glow blob */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/30 via-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-3xl" />

            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/60 dark:border-white/10"
            >
              <img
                src="/hero-graphic.jpg"
                alt="FCAHPT Campus Aerial View"
                className="w-full h-auto object-cover"
              />
              {/* floating badge cards */}
              <div className="absolute top-4 right-4 bg-white dark:bg-[#1e293b] rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                  <Stethoscope className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800 dark:text-white">School Clinic</p>
                  <p className="text-[9px] text-gray-400">Open now</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white dark:bg-[#1e293b] rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
                  <Home className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800 dark:text-white">AV Boys Hostel</p>
                  <p className="text-[9px] text-green-500 font-semibold">Route found ✓</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="w-full bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 py-24 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-3">Why use FCAHPT Navigate?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Everything you need on campus</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-white/[0.04] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg ${f.shadow} group-hover:-translate-y-1 transition-transform`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="w-full px-6 sm:px-12 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-10 sm:p-16 text-center shadow-2xl shadow-brand-500/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <GraduationCap className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to explore campus?</h2>
          <p className="text-brand-200 mb-8 text-base max-w-md mx-auto">Jump straight into the interactive map and start navigating FCAHPT like a pro.</p>
          <button
            onClick={() => navigate('/map')}
            className="px-10 py-4 bg-white text-brand-700 hover:bg-gray-50 rounded-2xl font-extrabold text-base shadow-xl transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Launch the Map
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="w-full bg-gray-950 text-gray-500 py-10 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <MapPin className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">FCAHPT Navigate</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Federal College of Animal Health &amp; Production Technology, Vom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
