import { GraphType } from '../types/graph';

interface DijkstraResult {
  distance: number;
  path: string[];
}

// Implementation of Dijkstra's algorithm to find shortest path
export function findShortestPath(
  graph: GraphType,
  startNodeId: string,
  endNodeId: string
): DijkstraResult | null {
  // Initialize distances with infinity for all nodes except start
  const distances: { [id: string]: number } = {};
  const previous: { [id: string]: string | null } = {};
  const unvisited = new Set<string>();
  
  // Initialize all nodes
  Object.keys(graph.nodes).forEach(nodeId => {
    distances[nodeId] = nodeId === startNodeId ? 0 : Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  });
  
  // Process nodes
  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentNodeId: string | null = null;
    let smallestDistance = Infinity;
    
    unvisited.forEach(nodeId => {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        currentNodeId = nodeId;
      }
    });
    
    // If smallest distance is infinity, no path exists
    if (smallestDistance === Infinity || !currentNodeId) {
      break;
    }
    
    // If we've reached the target node, we're done
    if (currentNodeId === endNodeId) {
      break;
    }
    
    // Remove current node from unvisited
    unvisited.delete(currentNodeId);
    
    // Get all edges from the current node
    const edges = Object.values(graph.edges).filter(
      edge => edge.source === currentNodeId || edge.target === currentNodeId
    );
    
    // Process each neighbor
    edges.forEach(edge => {
      // Skip blocked edges
      if (edge.status === 'blocked') {
        return;
      }
      
      // Get neighbor node
      const neighborId = edge.source === currentNodeId ? edge.target : edge.source;
      
      // Calculate new distance
      const newDistance = distances[currentNodeId!] + edge.weight;
      
      // If new distance is shorter, update
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentNodeId;
      }
    });
  }
  
  // If end node was not reached, no path exists
  if (distances[endNodeId] === Infinity) {
    return null;
  }
  
  // Reconstruct the path
  const path: string[] = [];
  let current: string | null = endNodeId;
  
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  
  return {
    distance: distances[endNodeId],
    path
  };
}