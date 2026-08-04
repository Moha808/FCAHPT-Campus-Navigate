import React, { useEffect, useRef, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { loadRoadNetwork } from '../../services/db';
import { findClosestNode, findShortestPath } from '../../utils/pathfinding';

const RoutingComponent = ({ start, end }) => {
  const map = useMap();
  const polylineRef = useRef(null);
  
  // State for the graph
  const [network, setNetwork] = useState({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Load the graph once when component mounts
  useEffect(() => {
    loadRoadNetwork().then(data => {
      setNetwork(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!map || !start || !end || isLoading) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    let finalPath = [];

    // 1. If we have a graph, try Dijkstra
    if (network.nodes.length > 0) {
      // Find closest nodes in graph to start and end buildings
      const startNode = findClosestNode(start.coordinates[0], start.coordinates[1], network.nodes);
      const endNode = findClosestNode(end.coordinates[0], end.coordinates[1], network.nodes);

      if (startNode && endNode) {
        // Run Dijkstra
        const graphPath = findShortestPath(startNode.id, endNode.id, network.nodes, network.edges);
        
        if (graphPath) {
          // Construct the final visual path:
          // Actual Start Building -> Closest Graph Node -> ...Dijkstra Path... -> Closest End Node -> Actual End Building
          finalPath = [
            { lat: start.coordinates[0], lng: start.coordinates[1] },
            ...graphPath,
            { lat: end.coordinates[0], lng: end.coordinates[1] }
          ];
        }
      }
    }

    // 2. Fallback if Dijkstra failed (e.g. disconnected graph) or no graph exists
    let isFallback = false;
    if (finalPath.length === 0) {
      isFallback = true;
      finalPath = [
        { lat: start.coordinates[0], lng: start.coordinates[1] },
        { lat: end.coordinates[0], lng: end.coordinates[1] }
      ];
    }

    // 3. Draw the full background network to help debugging
    const networkPolylines = [];
    if (network.edges.length > 0) {
      network.edges.forEach(edge => {
        const sourceNode = network.nodes.find(n => n.id === edge.source);
        const targetNode = network.nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          const p = new window.google.maps.Polyline({
            path: [
              { lat: sourceNode.lat, lng: sourceNode.lng },
              { lat: targetNode.lat, lng: targetNode.lng }
            ],
            geodesic: true,
            strokeColor: '#9ca3af', // gray-400
            strokeOpacity: 0.4,
            strokeWeight: 3,
            map: map
          });
          networkPolylines.push(p);
        }
      });
    }

    // 4. Draw the Main Route Polyline
    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 4
    };

    polylineRef.current = new window.google.maps.Polyline({
      path: finalPath,
      geodesic: true,
      strokeOpacity: isFallback ? 0 : 0.8, // dashed if fallback, solid if mapped
      icons: isFallback ? [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px'
      }] : [],
      strokeColor: '#3b82f6',
      strokeWeight: 6,
    });

    polylineRef.current.setMap(map);

    // 5. Fit map bounds
    const bounds = new window.google.maps.LatLngBounds();
    finalPath.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds, { top: 100, bottom: 100, left: 100, right: 100 });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      networkPolylines.forEach(p => p.setMap(null));
    };
  }, [map, start, end, network, isLoading]);

  return null;
};

export default RoutingComponent;
