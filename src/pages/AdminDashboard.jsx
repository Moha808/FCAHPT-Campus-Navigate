import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { LogOut, Map as MapIcon, Save, Trash2, ShieldAlert, MousePointerClick, CheckCircle2, XCircle, X } from 'lucide-react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { saveRoadNetwork, loadRoadNetwork } from '../services/db';
import { locations } from '../data/locations';

const MAP_ID  = 'fcahpt-admin-map-v1';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// ── Campus boundary restricted tightly to the immediate FCAHPT school axis ──
const CAMPUS_BOUNDS = {
  north: 9.7365,
  south: 9.7220,
  east:  8.8015,
  west:  8.7810,
};
const MIN_ZOOM = 16;
const MAX_ZOOM = 21;

// Category colours — matches the main map
const catColors = {
  academic: '#3b82f6',
  admin:    '#a855f7',
  clinic:   '#22c55e',
  hostel:   '#f97316',
  facility: '#eab308',
};

// ── Edges renderer ────────────────────────────────────────────────────────────
const EdgesRenderer = ({ nodes, edges }) => {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!map) return;
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    edges.forEach(edge => {
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (src && tgt) {
        const p = new window.google.maps.Polyline({
          path: [{ lat: src.lat, lng: src.lng }, { lat: tgt.lat, lng: tgt.lng }],
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.85,
          strokeWeight: 5,
          map,
        });
        polylinesRef.current.push(p);
      }
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [map, nodes, edges]);

  return null;
};

// ── Main component ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [nodes, setNodes]             = useState([]);
  const [edges, setEdges]             = useState([]);
  const [mode, setMode]               = useState('draw');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isSaving, setIsSaving]       = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
        loadRoadNetwork().then(net => {
          setNodes(net.nodes);
          setEdges(net.edges);
          setLoading(false);
        });
      } else {
        navigate('/admin');
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveRoadNetwork(nodes, edges);
      setModalConfig({ isOpen: true, title: 'Saved!', message: 'Road network saved to the cloud successfully.', type: 'success' });
    } catch {
      setModalConfig({ isOpen: true, title: 'Error', message: 'Failed to save. Check your connection.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMapClick = useCallback((e) => {
    if (mode !== 'draw') return;
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    const newId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newNode = { id: newId, lat, lng };

    setNodes(prev => [...prev, newNode]);

    setEdges(prev => {
      if (!selectedNodeId) return prev;
      return [...prev, { id: `edge_${selectedNodeId}_${newId}`, source: selectedNodeId, target: newId }];
    });

    setSelectedNodeId(newId);
  }, [mode, selectedNodeId]);

  const handleNodeClick = useCallback((nodeId, e) => {
    if (e) e.stopPropagation();
    if (mode === 'draw') {
      setSelectedNodeId(nodeId);
    } else if (mode === 'delete') {
      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(ed => ed.source !== nodeId && ed.target !== nodeId));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    }
  }, [mode, selectedNodeId]);

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading road network…</p>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] w-full bg-[#f8fafc] font-sans flex flex-col sm:flex-row overflow-hidden">

      {/* ── Desktop Sidebar (hidden on mobile) ───────────────────────────── */}
      <aside className="hidden sm:flex w-64 bg-white border-r border-gray-200 flex-col z-10 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">Admin</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 truncate">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-brand-50 text-brand-700 rounded-xl font-medium text-sm">
            <MapIcon className="w-5 h-5" /> Road Network Editor
          </button>
        </nav>

        {/* Stats */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Network Stats</p>
          <div className="flex gap-4">
            <div>
              <p className="text-xl font-bold text-gray-900">{nodes.length}</p>
              <p className="text-xs text-gray-400">Nodes</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{edges.length}</p>
              <p className="text-xs text-gray-400">Edges</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white hover:bg-brand-700 rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving…' : 'Save to Cloud'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Map + floating tools ──────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative h-full w-full min-h-0 overflow-hidden">

        {/* Floating mode toolbar — top centre */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-gray-200 z-20 flex gap-2">
          <button
            onClick={() => { setMode('draw'); setSelectedNodeId(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              mode === 'draw' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MousePointerClick className="w-4 h-4" /> Draw
          </button>
          <button
            onClick={() => setMode('delete')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              mode === 'delete' ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>

        {/* Help hint — top right */}
        <div className="absolute top-4 right-4 z-20 hidden sm:block bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 shadow border border-gray-200 text-xs text-gray-600 max-w-[180px]">
          <p className="font-bold text-gray-800 mb-1">How to draw:</p>
          <ul className="space-y-0.5 list-disc pl-3">
            <li>Tap map to drop a node</li>
            <li>Nodes auto-connect in sequence</li>
            <li>Tap existing node to branch</li>
            <li>Use Delete mode to remove</li>
          </ul>
        </div>

        {/* Map */}
        <div className="flex-1 relative w-full h-full min-h-0">
          <div className="absolute inset-0 w-full h-full">
            <Map
              defaultCenter={{ lat: 9.7285, lng: 8.7915 }}
              defaultZoom={16}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              mapId={MAP_ID}
              mapTypeId="hybrid"
              disableDefaultUI={true}
              zoomControl={true}
              gestureHandling="greedy"
              restriction={{
                latLngBounds: CAMPUS_BOUNDS,
                strictBounds: false,
              }}
              onClick={handleMapClick}
              style={{ width: '100%', height: '100%' }}
            >
              {/* ── Location endpoint markers — large & coloured ── */}
              {locations.map(loc => {
                const color = catColors[loc.category] || '#6b7280';
                return (
                  <AdvancedMarker
                    key={loc.id}
                    position={{ lat: loc.coordinates[0], lng: loc.coordinates[1] }}
                    zIndex={5}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                      {/* Coloured circle pin */}
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '3px solid white',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                        marginBottom: '3px',
                        flexShrink: 0,
                      }} />
                      {/* Name label */}
                      <div style={{
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'Inter, sans-serif',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap',
                        maxWidth: '140px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.4',
                        letterSpacing: '0.1px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                      }}>
                        {loc.name}
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              <EdgesRenderer nodes={nodes} edges={edges} />

              {/* ── Road network nodes ── */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isDelete   = mode === 'delete';
                return (
                  <AdvancedMarker
                    key={node.id}
                    position={{ lat: node.lat, lng: node.lng }}
                    onClick={() => handleNodeClick(node.id)}
                    zIndex={isDelete ? 100 : (isSelected ? 50 : 10)}
                  >
                    <div style={{
                      width:           isSelected ? '18px' : '14px',
                      height:          isSelected ? '18px' : '14px',
                      borderRadius:    '50%',
                      backgroundColor: isSelected ? '#f59e0b' : (isDelete ? '#ef4444' : '#ffffff'),
                      border:          `2.5px solid ${isSelected ? '#b45309' : '#0f172a'}`,
                      cursor:          'pointer',
                      transition:      'all 0.15s',
                      boxShadow:       '0 2px 6px rgba(0,0,0,0.6)',
                    }} />
                  </AdvancedMarker>
                );
              })}
            </Map>
          </div>
        </div>

        {/* ── Mobile bottom action bar (visible only on mobile) ─────────── */}
        <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-3 z-20 flex items-center gap-3 shrink-0">
          {/* Stats pill */}
          <div className="flex gap-3 text-xs text-gray-500 font-semibold mr-auto">
            <span><strong className="text-gray-800">{nodes.length}</strong> nodes</span>
            <span><strong className="text-gray-800">{edges.length}</strong> edges</span>
          </div>

          {/* Sign out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Out
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-brand-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>

        {/* ── Modal ────────────────────────────────────────────────────────── */}
        {modalConfig.isOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {modalConfig.type === 'success'
                    ? <CheckCircle2 className="w-7 h-7 text-green-500" />
                    : <XCircle      className="w-7 h-7 text-red-500" />
                  }
                  <h3 className="text-lg font-bold text-gray-900">{modalConfig.title}</h3>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-5 pl-10">{modalConfig.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className={`px-5 py-2 rounded-xl font-semibold text-sm text-white transition-all ${
                    modalConfig.type === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
