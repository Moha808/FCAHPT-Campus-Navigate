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

// Find top N closest nodes in the graph to a given coordinate
export const findClosestNodes = (lat, lng, nodes, count = 6) => {
  if (!nodes || nodes.length === 0) return [];

  return [...nodes]
    .map(node => ({
      node,
      dist: getDistance(lat, lng, node.lat, node.lng)
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
    .map(item => item.node);
};

// Build undirected graph adjacency list with node coordinates mapping
const buildGraphAdjacency = (nodes, edges) => {
  const nodeMap = new Map();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const graph = {};
  nodes.forEach(n => {
    graph[n.id] = [];
  });

  edges.forEach(edge => {
    if (!graph[edge.source] || !graph[edge.target]) return;
    const s = nodeMap.get(edge.source);
    const t = nodeMap.get(edge.target);
    if (!s || !t) return;
    const dist = getDistance(s.lat, s.lng, t.lat, t.lng);
    graph[edge.source].push({ id: edge.target, weight: dist });
    graph[edge.target].push({ id: edge.source, weight: dist });
  });

  return { graph, nodeMap };
};

// Find connected components in graph
const getConnectedComponents = (nodes, graph) => {
  const visited = new Set();
  const components = [];

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const comp = [];
      const queue = [node.id];
      visited.add(node.id);

      while (queue.length > 0) {
        const curr = queue.shift();
        comp.push(curr);
        for (const neighbor of (graph[curr] || [])) {
          if (!visited.has(neighbor.id)) {
            visited.add(neighbor.id);
            queue.push(neighbor.id);
          }
        }
      }
      components.push(comp);
    }
  }

  return components;
};

// Dijkstra Shortest Path implementation
export const findShortestPath = (startNodeId, endNodeId, nodes, edges) => {
  if (!startNodeId || !endNodeId || !nodes || nodes.length === 0) return null;
  if (startNodeId === endNodeId) {
    const n = nodes.find(node => node.id === startNodeId);
    return n ? [{ lat: n.lat, lng: n.lng }] : null;
  }

  const { graph, nodeMap } = buildGraphAdjacency(nodes, edges);
  if (!graph[startNodeId] || !graph[endNodeId]) return null;

  // Run Dijkstra
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
    let currentNodeId = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    }

    if (currentNodeId === null) break;
    if (currentNodeId === endNodeId) break;

    unvisited.delete(currentNodeId);

    const neighbors = graph[currentNodeId] || [];
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

  if (previous[endNodeId] === null && endNodeId !== startNodeId) {
    return null;
  }

  const pathNodeIds = [];
  let current = endNodeId;
  while (current !== null) {
    pathNodeIds.unshift(current);
    current = previous[current];
  }

  return pathNodeIds.map(id => {
    const n = nodeMap.get(id);
    return { lat: n.lat, lng: n.lng };
  });
};

/**
 * Robust pathfinder that handles:
 * - Multi-candidate nearest node search
 * - Auto-bridging small gaps (< 60m) between human-drawn road components
 * - Connecting seamlessly from start point to graph and to destination
 */
export const findRobustPath = (startCoord, endCoord, nodes, edges) => {
  const sLat = Array.isArray(startCoord) ? startCoord[0] : (startCoord.lat ?? startCoord.coordinates?.[0]);
  const sLng = Array.isArray(startCoord) ? startCoord[1] : (startCoord.lng ?? startCoord.coordinates?.[1]);
  const eLat = Array.isArray(endCoord) ? endCoord[0] : (endCoord.lat ?? endCoord.coordinates?.[0]);
  const eLng = Array.isArray(endCoord) ? endCoord[1] : (endCoord.lng ?? endCoord.coordinates?.[1]);

  if (sLat == null || sLng == null || eLat == null || eLng == null) {
    return null;
  }

  if (!nodes || nodes.length === 0) {
    return {
      path: [{ lat: sLat, lng: sLng }, { lat: eLat, lng: eLng }],
      isFallback: true
    };
  }

  const { graph, nodeMap } = buildGraphAdjacency(nodes, edges);

  // Auto-bridge small gaps (< 60 meters) between disconnected components
  const components = getConnectedComponents(nodes, graph);
  const augmentedEdges = [...edges];

  if (components.length > 1) {
    // For each pair of components, check if closest distance is small (< 60m) and bridge them
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        let bestDist = Infinity;
        let bestPair = null;

        for (const uId of components[i]) {
          const u = nodeMap.get(uId);
          if (!u) continue;
          for (const vId of components[j]) {
            const v = nodeMap.get(vId);
            if (!v) continue;
            const d = getDistance(u.lat, u.lng, v.lat, v.lng);
            if (d < bestDist) {
              bestDist = d;
              bestPair = [uId, vId];
            }
          }
        }

        // If components are within 60 meters of each other, bridge them
        if (bestPair && bestDist <= 60) {
          augmentedEdges.push({
            id: `bridge_${bestPair[0]}_${bestPair[1]}`,
            source: bestPair[0],
            target: bestPair[1],
            distance: bestDist
          });
        }
      }
    }
  }

  // Get candidate nodes near start and end
  const startCandidates = findClosestNodes(sLat, sLng, nodes, 6);
  const endCandidates = findClosestNodes(eLat, eLng, nodes, 6);

  let bestPath = null;
  let bestTotalDistance = Infinity;

  for (const sNode of startCandidates) {
    for (const eNode of endCandidates) {
      const gPath = findShortestPath(sNode.id, eNode.id, nodes, augmentedEdges);
      if (gPath && gPath.length > 0) {
        // Calculate total approximate walking distance
        let pathDist = getDistance(sLat, sLng, sNode.lat, sNode.lng);
        for (let k = 0; k < gPath.length - 1; k++) {
          pathDist += getDistance(gPath[k].lat, gPath[k].lng, gPath[k + 1].lat, gPath[k + 1].lng);
        }
        pathDist += getDistance(eNode.lat, eNode.lng, eLat, eLng);

        if (pathDist < bestTotalDistance) {
          bestTotalDistance = pathDist;
          bestPath = [
            { lat: sLat, lng: sLng },
            ...gPath,
            { lat: eLat, lng: eLng }
          ];
        }
      }
    }
  }

  if (bestPath && bestPath.length >= 2) {
    return {
      path: bestPath,
      isFallback: false
    };
  }

  // If no path on graph could connect them, fallback to straight line
  return {
    path: [{ lat: sLat, lng: sLng }, { lat: eLat, lng: eLng }],
    isFallback: true
  };
};
