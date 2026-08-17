import React, { useState } from 'react';
import { Navigation, ArrowLeft, MapPin, Share2, Copy, GraduationCap, Building2, Home, Stethoscope, Landmark, CheckCircle } from 'lucide-react';

const categoryIcons = {
  academic: GraduationCap,
  admin:    Building2,
  hostel:   Home,
  clinic:   Stethoscope,
  facility: Landmark,
};

const categoryMeta = {
  academic: { text: 'text-blue-600',   light: 'bg-blue-50',   bar: 'from-blue-500 to-blue-600' },
  admin:    { text: 'text-purple-600', light: 'bg-purple-50', bar: 'from-purple-500 to-purple-600' },
  hostel:   { text: 'text-orange-600', light: 'bg-orange-50', bar: 'from-orange-500 to-orange-600' },
  clinic:   { text: 'text-green-600',  light: 'bg-green-50',  bar: 'from-green-500 to-green-600' },
  facility: { text: 'text-yellow-600', light: 'bg-yellow-50', bar: 'from-yellow-500 to-yellow-600' },
};

const ActionButton = ({ icon: Icon, label, onClick, done = false }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 group transition-all active:scale-90"
  >
    <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-100 group-hover:scale-105 transition-all shadow-sm border border-brand-100/60 relative overflow-hidden">
      {done
        ? <CheckCircle className="w-5 h-5 text-green-500" />
        : <Icon className="w-5 h-5" />
      }
    </div>
    <span className="text-[11px] font-bold text-gray-400 group-hover:text-brand-600 transition-colors">{label}</span>
  </button>
);

const LocationDetails = ({ location, onBack, onGetDirections }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!location) return null;

  const Icon   = categoryIcons[location.category] || Landmark;
  const meta   = categoryMeta[location.category]  || categoryMeta.facility;

  const handleShare = async () => {
    const text = `${location.name} — FCAHPT Campus Map`;
    if (navigator.share) {
      await navigator.share({ title: text, url: window.location.href }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${text}: ${window.location.href}`);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleCopyCoords = async () => {
    const [lat, lng] = location.coordinates;
    await navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-white">

      {/* Hero image */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden">
        {location.image ? (
          <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.bar} flex items-center justify-center`}>
            <Icon className="w-14 h-14 text-white/60" />
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 sm:hidden w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Title area */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide mb-2 ${meta.light} ${meta.text}`}>
            <Icon className="w-3 h-3" />
            {location.category}
          </div>
          <h2 className="text-xl font-extrabold text-white leading-snug drop-shadow-md">
            {location.name}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {location.description}
        </p>

        {/* Coords pill */}
        {location.coordinates && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>{location.coordinates[0].toFixed(6)}, {location.coordinates[1].toFixed(6)}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-start justify-around py-2 border-y border-gray-100">
          <ActionButton icon={Navigation} label="Directions" onClick={() => onGetDirections(location)} />
          <ActionButton icon={Share2}     label="Share"      onClick={handleShare}     done={shared} />
          <ActionButton icon={Copy}       label="Copy GPS"   onClick={handleCopyCoords} done={copied} />
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => onGetDirections(location)}
          className={`w-full bg-gradient-to-r ${meta.bar} text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]`}
        >
          <Navigation className="w-5 h-5" />
          Get Directions
        </button>

      </div>
    </div>
  );
};

export default LocationDetails;
