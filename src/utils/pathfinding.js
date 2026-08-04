// Haversine formula to calculate distance between two lat/lng points in meters
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Find the closest node in the graph to a given coordinate
export const findClosestNode = (lat, lng, nodes) => {
  if (!nodes || nodes.length === 0) return null;

  let closestNode = null;
  let minDistance = Infinity;

  for (const node of nodes) {
    const dist = getDistance(lat, lng, node.lat, node.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestNode = node;
    }
  }

  return closestNode;
};

// Dijkstra's Shortest Path Algorithm
export const findShortestPath = (startNodeId, endNodeId, nodes, edges) => {
  // Build adjacency list graph structure
  // graph = { nodeId: [ { neighborId, weight }, ... ] }
  const graph = {};
  
  nodes.forEach(node => {
    graph[node.id] = [];
  });

  edges.forEach(edge => {
    // Check if nodes still exist
    if (!graph[edge.source] || !graph[edge.target]) return;

    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const dist = getDistance(sourceNode.lat, sourceNode.lng, targetNode.lat, targetNode.lng);
      // It's an undirected graph (you can walk both ways)
      graph[edge.source].push({ id: edge.target, weight: dist });
      graph[edge.target].push({ id: edge.source, weight: dist });
    }
  });

  // Dijkstra initialization
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    let currentNodeId = null;
    let minDistance = Infinity;
    
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    }

    // If we can't reach any more nodes, break
    if (currentNodeId === null) break;

    // If we reached the destination, we can stop early
    if (currentNodeId === endNodeId) break;

    unvisited.delete(currentNodeId);

    // Update distances to neighbors
    const neighbors = graph[currentNodeId];
    for (const neighbor of neighbors) {
      if (unvisited.has(neighbor.id)) {
        const altDistance = distances[currentNodeId] + neighbor.weight;
        if (altDistance < distances[neighbor.id]) {
          distances[neighbor.id] = altDistance;
          previous[neighbor.id] = currentNodeId;
        }
      }
    }
  }

  // Reconstruct path
  const pathNodeIds = [];
  let current = endNodeId;
  
  // If no path was found (distance is infinity)
  if (previous[current] === null && current !== startNodeId) {
    return null;
  }

  while (current !== null) {
    pathNodeIds.unshift(current);
    current = previous[current];
  }

  // Convert node IDs to full coordinates
  return pathNodeIds.map(id => {
    const n = nodes.find(node => node.id === id);
    return { lat: n.lat, lng: n.lng };
  });
};
