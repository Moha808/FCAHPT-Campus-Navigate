import React from 'react';
import { Navigation, ArrowLeft, MapPin, Share2, Copy, GraduationCap, Building2, Home, Stethoscope, Landmark } from 'lucide-react';

const categoryIcons = {
  academic: GraduationCap,
  admin: Building2,
  hostel: Home,
  clinic: Stethoscope,
  facility: Landmark,
};

const categoryColors = {
  academic: { text: 'text-blue-600', light: 'bg-blue-50' },
  admin:    { text: 'text-purple-600', light: 'bg-purple-50' },
  hostel:   { text: 'text-orange-600', light: 'bg-orange-50' },
  clinic:   { text: 'text-green-600', light: 'bg-green-50' },
  facility: { text: 'text-yellow-600', light: 'bg-yellow-50' },
};

const ActionButton = ({ icon: Icon, label, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 group transition-all active:scale-90 ${className}`}
  >
    <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-100 group-hover:scale-105 transition-all shadow-sm border border-brand-100">
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-[11px] font-bold text-gray-500 group-hover:text-brand-600 transition-colors">{label}</span>
  </button>
);

const LocationDetails = ({ location, onBack, onGetDirections }) => {
  if (!location) return null;

  const Icon = categoryIcons[location.category] || Landmark;
  const colors = categoryColors[location.category] || categoryColors.facility;

  const handleShare = () => {
    const text = `${location.name} on FCAHPT Campus Map`;
    if (navigator.share) {
      navigator.share({ title: text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} — ${window.location.href}`);
    }
  };

  const handleCopyCoords = () => {
    const [lat, lng] = location.coordinates;
    navigator.clipboard.writeText(`${lat}, ${lng}`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Image */}
      <div className="relative h-56 w-full shrink-0">
        {location.image ? (
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand-50 flex items-center justify-center">
            <Icon className="w-12 h-12 text-brand-300" />
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 sm:hidden p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Title */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${colors.light} ${colors.text}`}>
            <Icon className="w-3 h-3" />
            {location.category}
          </div>
          <h2 className="text-2xl font-extrabold text-white leading-tight drop-shadow-lg">
            {location.name}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-5 overflow-y-auto flex-1">

        {/* Description */}
        <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
          {location.description}
        </p>

        {/* Coords pill */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          {location.coordinates[0].toFixed(6)}, {location.coordinates[1].toFixed(6)}
        </div>

        {/* Google-Maps style circular action buttons */}
        <div className="flex items-start justify-around pt-1 border-t border-gray-100">
          <ActionButton
            icon={Navigation}
            label="Directions"
            onClick={() => onGetDirections(location)}
          />
          <ActionButton
            icon={Share2}
            label="Share"
            onClick={handleShare}
          />
          <ActionButton
            icon={Copy}
            label="Copy Coords"
            onClick={handleCopyCoords}
          />
        </div>

        {/* Primary Get Directions CTA */}
        <button
          onClick={() => onGetDirections(location)}
          className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-500/20 active:scale-[0.98]"
        >
          <Navigation className="w-5 h-5" />
          Get Directions
        </button>

      </div>
    </div>
  );
};

export default LocationDetails;
