import React, { useEffect, useState } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import RoutingComponent from './RoutingComponent';
import { Layers, GraduationCap, Building2, Stethoscope, Home, Landmark } from 'lucide-react';

// Stable constant - never regenerated to prevent map reloads
const MAP_ID = 'fcahpt-campus-map-v1';

// ── Campus boundary restricted to the FCAHPT school axis ────────────────────
const CAMPUS_BOUNDS = {
  north: 9.7420,
  south: 9.7180,
  east:  8.8050,
  west:  8.7750,
};
const MIN_ZOOM = 15;   // restricts zoom out to only the school axis
const MAX_ZOOM = 21;   // max zoom-in for inspecting buildings and pathways

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
  const [mapType, setMapType] = useState('hybrid');

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={16}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        mapId={MAP_ID}
        mapTypeId={mapType}
        disableDefaultUI={true}
        zoomControl={true}
        gestureHandling="greedy"
        restriction={{
          latLngBounds: CAMPUS_BOUNDS,
          strictBounds: false,
        }}
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
                  {/* Icon bubble — smaller when not selected */}
                  <div style={{
                    width: isSelected ? '30px' : '20px',
                    height: isSelected ? '30px' : '20px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: `2px solid white`,
                    boxShadow: `0 1px 6px rgba(0,0,0,0.3), 0 0 0 ${isSelected ? '3px' : '0px'} ${color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    marginBottom: isSelected ? '3px' : '0px',
                    color: 'white',
                  }}>
                    <Icon style={{ width: isSelected ? '14px' : '10px', height: isSelected ? '14px' : '10px' }} />
                  </div>
                  {/* Name label — always visible */}
                  <div style={{
                    backgroundColor: isSelected ? color : 'rgba(15,23,42,0.85)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '700',
                    fontFamily: 'Inter, sans-serif',
                    padding: '2px 7px',
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    letterSpacing: '0.2px',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease',
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
