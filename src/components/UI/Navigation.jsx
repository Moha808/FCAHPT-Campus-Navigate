import React from 'react';
import { Map, Compass, BookOpen, Settings } from 'lucide-react';

const Navigation = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 pb-safe z-[900] sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[400px] sm:rounded-3xl sm:border sm:shadow-2xl sm:pb-0">
      <div className="flex justify-around items-center p-3">
        <NavItem icon={<Map className="w-6 h-6" />} label="Map" isActive />
        <NavItem icon={<Compass className="w-6 h-6" />} label="Explore" />
        <NavItem icon={<BookOpen className="w-6 h-6" />} label="Directory" />
        <NavItem icon={<Settings className="w-6 h-6" />} label="Settings" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isActive }) => (
  <button className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-brand-600 scale-110' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
    {icon}
    <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export default Navigation;
