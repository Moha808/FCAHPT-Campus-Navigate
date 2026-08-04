import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { LogOut, Map as MapIcon, Plus, Save, Trash2, ShieldAlert, Navigation, MousePointerClick, CheckCircle2, XCircle, X } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { saveRoadNetwork, loadRoadNetwork } from '../services/db';
import { locations } from '../data/locations';

const MAP_ID = 'fcahpt-admin-map-v1';
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Component to render all edges as lines
const EdgesRenderer = ({ nodes, edges }) => {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    // Draw new polylines
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        const polyline = new window.google.maps.Polyline({
          path: [
            { lat: sourceNode.lat, lng: sourceNode.lng },
            { lat: targetNode.lat, lng: targetNode.lng }
          ],
          geodesic: true,
          strokeColor: '#3b82f6', // blue-500
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map: map
        });
        polylinesRef.current.push(polyline);
      }
    });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [map, nodes, edges]);

  return null;
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Map Editor State
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState('draw'); // 'draw' or 'delete'
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        // Load initial network
        loadRoadNetwork().then(network => {
          setNodes(network.nodes);
          setEdges(network.edges);
        });
      } else {
        navigate('/admin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveRoadNetwork(nodes, edges);
      setModalConfig({ isOpen: true, title: 'Success!', message: 'Road network saved to the cloud successfully.', type: 'success' });
    } catch (error) {
      setModalConfig({ isOpen: true, title: 'Error', message: 'Failed to save road network. Check your connection.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMapClick = (e) => {
    if (mode !== 'draw') return;

    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newNode = { id: newNodeId, lat, lng };
    setNodes(prev => [...prev, newNode]);

    // If a previous node is selected, connect them
    if (selectedNodeId) {
      const newEdge = {
        id: `edge_${selectedNodeId}_${newNodeId}`,
        source: selectedNodeId,
        target: newNodeId
      };
      setEdges(prev => [...prev, newEdge]);
    }

    // Auto-select the newly created node so drawing continues
    setSelectedNodeId(newNodeId);
  };

  const handleNodeClick = (nodeId, e) => {
    // Prevent the map click event from firing too
    if (e) e.stopPropagation();

    if (mode === 'draw') {
      // In draw mode, clicking an existing node selects it so we can branch off
      setSelectedNodeId(nodeId);
    } else if (mode === 'delete') {
      // In delete mode, remove the node and any edges attached to it
      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden sm:flex z-10">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="text-white w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">Admin</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 truncate">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-brand-50 text-brand-700 rounded-xl font-medium">
            <MapIcon className="w-5 h-5" /> Road Network
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white hover:bg-brand-700 rounded-xl font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save to Cloud'}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen">
        
        {/* Floating Tools Toolbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-gray-200 z-10 flex gap-2">
          <button 
            onClick={() => { setMode('draw'); setSelectedNodeId(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === 'draw' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MousePointerClick className="w-4 h-4" /> Draw Paths
          </button>
          <button 
            onClick={() => setMode('delete')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${mode === 'delete' ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Trash2 className="w-4 h-4" /> Delete Nodes
          </button>
        </div>

        {/* Info panel */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 z-10 w-72">
          <h3 className="font-bold text-gray-900 mb-1">How to draw:</h3>
          <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
            <li>Click anywhere to drop a node.</li>
            <li>Subsequent clicks will auto-connect lines.</li>
            <li>Click an existing node to "branch off" from it.</li>
            <li>Switch to Delete mode to remove mistakes.</li>
            <li>Nodes: <strong>{nodes.length}</strong> | Edges: <strong>{edges.length}</strong></li>
          </ul>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-gray-100 relative">
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={{ lat: 9.7285, lng: 8.7915 }}
              defaultZoom={17}
              mapId={MAP_ID}
              mapTypeId="hybrid"
              disableDefaultUI={true}
              zoomControl={true}
              gestureHandling="greedy"
              onClick={handleMapClick}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Reference Building Markers */}
              {locations.map((loc) => (
                <AdvancedMarker 
                  key={loc.id} 
                  position={{ lat: loc.coordinates[0], lng: loc.coordinates[1] }}
                  zIndex={5} 
                >
                  <div style={{
                    backgroundColor: 'rgba(15,23,42,0.7)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    pointerEvents: 'none'
                  }}>
                    {loc.name}
                  </div>
                </AdvancedMarker>
              ))}

              <EdgesRenderer nodes={nodes} edges={edges} />

              {nodes.map(node => (
                <AdvancedMarker 
                  key={node.id} 
                  position={{ lat: node.lat, lng: node.lng }}
                  onClick={() => handleNodeClick(node.id)}
                  zIndex={mode === 'delete' ? 100 : (selectedNodeId === node.id ? 50 : 10)}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: selectedNodeId === node.id ? '#f59e0b' : (mode === 'delete' ? '#ef4444' : '#ffffff'),
                    border: '2px solid #0f172a',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transform: selectedNodeId === node.id ? 'scale(1.5)' : 'scale(1)',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }} />
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        </div>

        {/* Professional Modal Overlay */}
        {modalConfig.isOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm transform scale-100 transition-all border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {modalConfig.type === 'success' ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{modalConfig.title}</h3>
                </div>
                <button 
                  onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6 pl-11">{modalConfig.message}</p>
              <div className="flex justify-end">
                <button 
                  onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                  className={`px-5 py-2 rounded-xl font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 ${modalConfig.type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' : 'bg-red-600 hover:bg-red-700 shadow-red-500/30'}`}
                >
                  Okay
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
