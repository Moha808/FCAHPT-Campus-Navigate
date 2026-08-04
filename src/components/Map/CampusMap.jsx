import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import RoutingComponent from './RoutingComponent';
import { Layers, GraduationCap, Building2, Stethoscope, Home, Landmark } from 'lucide-react';

// Stable constant - never regenerated to prevent map reloads
const MAP_ID = 'fcahpt-campus-map-v1';

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo({ lat: center[0], lng: center[1] });
      map.setZoom(18);
    }
  }, [center, map]);
  return null;
};

// Category → color and Lucide icon
const getCategoryStyle = (category) => {
  switch (category) {
    case 'academic': return { color: '#3b82f6', Icon: GraduationCap };
    case 'admin':    return { color: '#a855f7', Icon: Building2 };
    case 'clinic':   return { color: '#22c55e', Icon: Stethoscope };
    case 'hostel':   return { color: '#f97316', Icon: Home };
    default:         return { color: '#eab308', Icon: Landmark };
  }
};

const CampusMap = ({ locations, selectedLocation, onMarkerClick, routeStart, routeEnd }) => {
  const defaultCenter = { lat: 9.7285, lng: 8.7915 };
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapType, setMapType] = useState('hybrid'); // 'hybrid' | 'roadmap'

  if (!API_KEY) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-100">API Key Missing</div>;
  }

  return (
    <div className="absolute inset-0 z-0">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={16}
          mapId={MAP_ID}
          mapTypeId={mapType}
          disableDefaultUI={true}
          zoomControl={true}
          gestureHandling="greedy"
          style={{ width: '100%', height: '100%' }}
        >
          {locations.map((loc) => {
            const { color, Icon } = getCategoryStyle(loc.category);
            const isSelected = selectedLocation?.id === loc.id;

            return (
              <AdvancedMarker
                key={loc.id}
                position={{ lat: loc.coordinates[0], lng: loc.coordinates[1] }}
                onClick={() => onMarkerClick(loc)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  {/* Icon bubble */}
                  <div style={{
                    width: isSelected ? '40px' : '32px',
                    height: isSelected ? '40px' : '32px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: `3px solid white`,
                    boxShadow: `0 2px 10px rgba(0,0,0,0.35), 0 0 0 ${isSelected ? '4px' : '0px'} ${color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    marginBottom: '3px',
                    color: 'white',
                  }}>
                    <Icon style={{ width: isSelected ? '20px' : '16px', height: isSelected ? '20px' : '16px' }} />
                  </div>
                  {/* Name label */}
                  <div style={{
                    backgroundColor: isSelected ? color : 'rgba(15,23,42,0.85)',
                    color: 'white',
                    fontSize: isSelected ? '12px' : '10px',
                    fontWeight: '700',
                    fontFamily: 'Inter, sans-serif',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    letterSpacing: '0.2px',
                    backdropFilter: 'blur(4px)',
                    maxWidth: '130px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  }}>
                    {loc.name}
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {selectedLocation && (
            <MapController center={selectedLocation.coordinates} />
          )}

          {routeStart && routeEnd && (
            <RoutingComponent start={routeStart} end={routeEnd} />
          )}

        </Map>
      </APIProvider>

      {/* Map Type Toggle Button */}
      <button
        onClick={() => setMapType(prev => prev === 'hybrid' ? 'roadmap' : 'hybrid')}
        className="absolute bottom-36 right-4 z-[500] flex flex-col items-center bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all active:scale-95"
        style={{ width: '56px' }}
        title={mapType === 'hybrid' ? 'Switch to Map View' : 'Switch to Satellite View'}
      >
        <div
          className="w-full h-12 bg-cover bg-center border-b border-gray-200"
          style={{
            backgroundImage: mapType === 'hybrid'
              ? 'url(https://maps.gstatic.com/mapfiles/api-3/images/maptype-roadmap_hdpi.png)'
              : 'url(https://maps.gstatic.com/mapfiles/api-3/images/maptype-satellite_hdpi.png)',
          }}
        />
        <div className="flex items-center justify-center gap-1 py-1.5 w-full">
          <Layers className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wide">
            {mapType === 'hybrid' ? 'Map' : 'Satellite'}
          </span>
        </div>
      </button>

    </div>
  );
};

export default CampusMap;
