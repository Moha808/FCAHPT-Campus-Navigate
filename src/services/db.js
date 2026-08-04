import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const NETWORK_DOC_ID = 'latest';

/**
 * Saves the road network graph (nodes and edges) to Firestore
 * @param {Array} nodes - Array of { id, lat, lng }
 * @param {Array} edges - Array of { source, target, distance }
 */
export const saveRoadNetwork = async (nodes, edges) => {
  try {
    const docRef = doc(db, 'roadNetwork', NETWORK_DOC_ID);
    await setDoc(docRef, {
      nodes,
      edges,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving road network:", error);
    throw error;
  }
};

/**
 * Loads the road network graph from Firestore
 * @returns {Promise<{nodes: Array, edges: Array}>}
 */
export const loadRoadNetwork = async () => {
  try {
    const docRef = doc(db, 'roadNetwork', NETWORK_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        nodes: data.nodes || [],
        edges: data.edges || []
      };
    } else {
      // Document doesn't exist yet (first time)
      return { nodes: [], edges: [] };
    }
  } catch (error) {
    console.error("Error loading road network:", error);
    // Return empty graph if error or offline
    return { nodes: [], edges: [] };
  }
};
