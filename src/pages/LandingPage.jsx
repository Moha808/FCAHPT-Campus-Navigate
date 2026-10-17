import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Compass, Shield, Sun, Moon, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

// Verified against src/data/locations.js: 22 locations, 5 categories
const stats = [
  { value: '22', label: 'Mapped locations' },
  { value: '5',  label: 'Categories' },
];

const features = [
  {
    icon: MapPin,
    title: 'Interactive Map',
    desc: 'Explore every building on campus on a live satellite map. Tap any pin to see its description, category, and exact coordinates.',
  },
  {
    icon: Navigation,
    title: 'Turn-by-turn Routing',
    desc: 'Get the shortest walking route from your GPS position to any campus destination using the built-in campus road network.',
  },
  {
    icon: Compass,
    title: 'Search & Filter',
    desc: 'Filter by Academic, Hostel, Clinic, Admin, or Facility. Find exactly what you need without scrolling through the full map.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="w-full px-5 sm:px-10 py-4 flex justify-between items-center fixed top-0 z-50 bg-white/90 dark:bg-[#0b1120]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/[0.06]">
        {/* Logo wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <MapPin className="text-white w-4 h-4" />
          </div>
          <div className="leading-none">
            <span className="block font-bold text-[15px] tracking-tight text-gray-900 dark:text-white">FCAHPT</span>
            <span className="block text-[10px] font-medium text-brand-600 dark:text-brand-500 uppercase tracking-widest">Navigate</span>
          </div>
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => navigate('/map')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Open Map <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-5 sm:px-10 pt-28 pb-20 max-w-7xl mx-auto w-full">

        {/* Left — copy */}
        <div className="flex-1 flex flex-col items-start max-w-lg">

          {/* Institutional identifier */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5"
          >
            Federal College of Animal Health &amp; Production Technology · Vom
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5 text-gray-900 dark:text-white"
          >
            Find your way<br />
            <span className="text-brand-600 dark:text-brand-500">across campus.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8"
          >
            An interactive navigation tool for students and visitors at FCAHPT, Vom. Search for buildings, filter by category, and get walking directions anywhere on campus.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="flex items-center gap-8 mb-9"
          >
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />}
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate('/map')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Launch Map
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </button>
          </motion.div>
        </div>

        {/* Right — authentic campus photograph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-1 w-full max-w-xl lg:max-w-none"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10">
            <img
              src="/campus-photo.jpg"
              alt="Federal College of Animal Health and Production Technology — main building, Vom"
              className="w-full h-auto object-cover"
              loading="eager"
            />
            {/* Subtle caption bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-xs font-medium opacity-90">
                FCAHPT Main Campus · Vom, Plateau State
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="w-full border-t border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] py-20 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12">
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-500 uppercase tracking-widest mb-2">What it does</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Built for the FCAHPT campus</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white dark:bg-white/[0.04] rounded-xl p-6 border border-gray-100 dark:border-white/[0.06]"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-500 mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────── */}
      <section className="w-full px-5 sm:px-10 py-16">
        <div className="max-w-3xl mx-auto bg-brand-600 dark:bg-brand-700 rounded-2xl px-8 sm:px-14 py-12 text-center">
          <GraduationCap className="w-9 h-9 text-white/70 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to explore campus?</h2>
          <p className="text-brand-100 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
            Open the interactive map to search, filter, and navigate to any location on the FCAHPT campus.
          </p>
          <button
            onClick={() => navigate('/map')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-brand-700 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            Open the Map
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-gray-100 dark:border-white/[0.06] bg-white dark:bg-[#0b1120] px-5 sm:px-10 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
              <MapPin className="text-white w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-gray-900 dark:text-white">FCAHPT Navigate</span>
          </div>
          <p className="text-xs text-gray-400 text-center sm:text-right">
            &copy; {new Date().getFullYear()} Federal College of Animal Health &amp; Production Technology, Vom.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
