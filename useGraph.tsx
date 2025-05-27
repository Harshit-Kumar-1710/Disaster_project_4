import { useState, useEffect, useCallback } from 'react';
import { GraphType, NodeType } from '../types/graph';
import { dehradunGraph, initialHazards } from '../utils/dehradunData';

interface UseGraphReturn {
  graph: GraphType | null;
  loading: boolean;
  error: Error | null;
  refreshGraph: () => Promise<void>;
  reportHazard: (nodeId: string) => Promise<void>;
  updateTraffic: (edgeId: string, traffic: 'low' | 'medium' | 'high') => Promise<void>;
}

export const useGraph = (): UseGraphReturn => {
  const [graph, setGraph] = useState<GraphType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Deep clone the graph to avoid mutations
      const graphData = JSON.parse(JSON.stringify(dehradunGraph));
      
      // Apply any reported hazards
      initialHazards.forEach(nodeId => {
        if (graphData.nodes[nodeId]) {
          graphData.nodes[nodeId].isHazard = true;
        }
      });
      
      setGraph(graphData);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch graph data'));
      console.error('Error fetching graph:', e);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const reportHazard = async (nodeId: string) => {
    if (!graph || !graph.nodes[nodeId]) return;
    
    setGraph(prev => {
      if (!prev) return prev;
      
      const newGraph = JSON.parse(JSON.stringify(prev));
      newGraph.nodes[nodeId].isHazard = true;
      initialHazards.add(nodeId);
      
      // Increase weights of connected edges
      Object.values(newGraph.edges).forEach(edge => {
        if (edge.source === nodeId || edge.target === nodeId) {
          edge.weight *= 2;
        }
      });
      
      return newGraph;
    });
  };
  
  const updateTraffic = async (edgeId: string, traffic: 'low' | 'medium' | 'high') => {
    if (!graph || !graph.edges[edgeId]) return;
    
    setGraph(prev => {
      if (!prev) return prev;
      
      const newGraph = JSON.parse(JSON.stringify(prev));
      newGraph.edges[edgeId].traffic = traffic;
      
      // Update edge weight based on traffic
      const weightMultiplier = traffic === 'low' ? 1 : 
                              traffic === 'medium' ? 1.5 : 2;
      newGraph.edges[edgeId].weight = Math.round(dehradunGraph.edges[edgeId].weight * weightMultiplier);
      
      return newGraph;
    });
  };
  
  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);
  
  return { 
    graph, 
    loading, 
    error, 
    refreshGraph: fetchGraph,
    reportHazard,
    updateTraffic
  };
};