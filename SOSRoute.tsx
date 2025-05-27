import React, { useState, useEffect } from 'react';
import { ArrowRight, Navigation, RefreshCw, Clock, AlertCircle, Shield } from 'lucide-react';
import { useLocation as useLocationContext } from '../context/LocationContext';
import { useGraph } from '../hooks/useGraph';
import { useAlert } from '../context/AlertContext';
import GraphVisualization from '../components/GraphVisualization';
import { findShortestPath } from '../utils/dijkstra';

const SOSRoute: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [nearestSafeNodeId, setNearestSafeNodeId] = useState<string | null>(null);
  const [pathToSafety, setPathToSafety] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    estimatedTime: number;
    nodes: string[];
  } | null>(null);
  
  const { getUserLocation } = useLocationContext();
  const { graph, loading: graphLoading, refreshGraph } = useGraph();
  const { addAlert } = useAlert();
  
  const calculateRoute = async () => {
    setIsCalculating(true);
    
    try {
      // Get current location
      const location = await getUserLocation();
      
      if (!location || !location.nodeId || !graph) {
        addAlert({
          type: 'error',
          message: 'Could not determine your current location'
        });
        return;
      }
      
      setCurrentNodeId(location.nodeId);
      
      // Find all safe nodes
      const safeNodes = Object.values(graph.nodes).filter(node => node.type === 'safe');
      
      if (safeNodes.length === 0) {
        addAlert({
          type: 'error',
          message: 'No safe zones found in the area'
        });
        return;
      }
      
      // Find path to nearest safe node
      let shortestPath: string[] = [];
      let shortestDistance = Infinity;
      let nearestSafe = null;
      
      for (const safeNode of safeNodes) {
        const result = findShortestPath(graph, location.nodeId, safeNode.id);
        
        if (result && result.distance < shortestDistance) {
          shortestPath = result.path;
          shortestDistance = result.distance;
          nearestSafe = safeNode.id;
        }
      }
      
      if (shortestPath.length === 0 || !nearestSafe) {
        addAlert({
          type: 'error',
          message: 'Could not find a path to safety'
        });
        return;
      }
      
      setNearestSafeNodeId(nearestSafe);
      setPathToSafety(shortestPath);
      
      // Calculate estimated time (assuming average walking speed of 5km/h or roughly 1.4m/s)
      // and assuming each weight unit is approximately 100 meters
      const estimatedTimeMinutes = Math.ceil((shortestDistance * 100) / (1.4 * 60));
      
      setRouteInfo({
        distance: shortestDistance,
        estimatedTime: estimatedTimeMinutes,
        nodes: shortestPath
      });
      
      addAlert({
        type: 'success',
        message: 'Evacuation route calculated successfully'
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      addAlert({
        type: 'error',
        message: 'Failed to calculate evacuation route'
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  const refreshRoute = async () => {
    try {
      await refreshGraph();
      calculateRoute();
    } catch (error) {
      console.error('Error refreshing route:', error);
      addAlert({
        type: 'error',
        message: 'Failed to refresh route data'
      });
    }
  };
  
  useEffect(() => {
    // Calculate route on component mount
    if (!graphLoading && graph) {
      calculateRoute();
    }
  }, [graph, graphLoading]);
  
  const renderPathSteps = () => {
    if (!pathToSafety.length || !graph) {
      return (
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-gray-600">No route available</p>
        </div>
      );
    }
    
    return (
      <ol className="space-y-4">
        {pathToSafety.map((nodeId, index) => {
          const node = graph.nodes[nodeId];
          const isFirst = index === 0;
          const isLast = index === pathToSafety.length - 1;
          const nextNode = !isLast ? graph.nodes[pathToSafety[index + 1]] : null;
          
          let statusColor = 'bg-blue-100 text-blue-800';
          if (node.type === 'safe') statusColor = 'bg-green-100 text-green-800';
          if (node.type === 'warning') statusColor = 'bg-yellow-100 text-yellow-800';
          if (node.type === 'danger') statusColor = 'bg-red-100 text-red-800';
          
          return (
            <li key={nodeId} className="flex items-start">
              <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center font-medium mr-3 ${
                isFirst ? 'bg-blue-600 text-white' : 
                isLast ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{node.name}</h4>
                    <p className="text-sm text-gray-600">
                      {isFirst ? 'Starting point' : 
                       isLast ? 'Safe destination' : 'Continue through this area'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
                    {node.type || 'normal'}
                  </span>
                </div>
                
                {nextNode && (
                  <div className="mt-2 pl-2 border-l-2 border-gray-300">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <ArrowRight size={14} className="mr-1" />
                      <span>Continue to {nextNode.name}</span>
                    </div>
                    
                    {/* Find the edge between this node and the next */}
                    {Object.values(graph.edges).map(edge => {
                      if ((edge.source === nodeId && edge.target === nextNode.id) ||
                          (edge.target === nodeId && edge.source === nextNode.id)) {
                        return (
                          <div key={`${nodeId}-${nextNode.id}`} className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            <span>Distance: {edge.weight} units</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  };
  
  if (graphLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading evacuation data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SOS Evacuation Route</h1>
        <p className="text-gray-600">Find the safest and shortest path to the nearest safe zone.</p>
      </header>
      
      {/* Emergency Notice */}
      <div className="bg-red-100 border-l-4 border-red-600 p-4 mb-8 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-red-800 font-medium">Emergency Evacuation Mode</h3>
            <p className="text-red-700 text-sm">
              This page calculates your optimal evacuation route. Follow the directions carefully and proceed to the nearest safe zone.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Evacuation Map</h2>
              <button
                onClick={refreshRoute}
                className="btn btn-secondary flex items-center"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600 mr-2"></span>
                ) : (
                  <RefreshCw size={16} className="mr-2" />
                )}
                Refresh Route
              </button>
            </div>
            
            {/* Route Summary */}
            {routeInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <Navigation className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-blue-800">Evacuation Route Found</h3>
                    <p className="text-blue-700">
                      Distance: ~{(routeInfo.distance * 100).toFixed(0)} meters | 
                      Estimated time: {routeInfo.estimatedTime} minutes
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Route passes through {routeInfo.nodes.length} locations to reach safety
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {graph ? (
              <div className="overflow-auto">
                <GraphVisualization
                  graph={graph}
                  currentNode={currentNodeId || undefined}
                  pathNodes={pathToSafety}
                  width={800}
                  height={500}
                  interactive={false}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-60 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Map data not available</p>
              </div>
            )}
            
            {currentNodeId && nearestSafeNodeId && graph && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">Current Location</h3>
                  <p className="text-blue-700">{graph.nodes[currentNodeId].name}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800">Nearest Safe Zone</h3>
                  <p className="text-green-700">{graph.nodes[nearestSafeNodeId].name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <span className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                Step-by-Step Directions
              </span>
            </h2>
            
            {isCalculating ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <p className="text-gray-600 text-sm">Calculating optimal route...</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-6">
                {renderPathSteps()}
              </div>
            )}
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evacuation Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
                  <span className="text-xs font-bold">!</span>
                </div>
                <p className="text-gray-700">Stay calm and follow the route exactly as shown.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
                  <span className="text-xs font-bold">!</span>
                </div>
                <p className="text-gray-700">If a path is blocked, return to this page to recalculate.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
                  <span className="text-xs font-bold">!</span>
                </div>
                <p className="text-gray-700">Help others along the way if it's safe to do so.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
                  <span className="text-xs font-bold">!</span>
                </div>
                <p className="text-gray-700">Once at a safe zone, check in with authorities.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSRoute;