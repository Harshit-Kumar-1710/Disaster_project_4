import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, MapPin, RefreshCw } from 'lucide-react';
import { useLocation as useLocationContext } from '../context/LocationContext';
import { useGraph } from '../hooks/useGraph';
import { useAlert } from '../context/AlertContext';
import GraphVisualization from '../components/GraphVisualization';

const CheckSafety: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [safetyStatus, setSafetyStatus] = useState<'safe' | 'warning' | 'danger' | 'unknown'>('unknown');
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const { getUserLocation } = useLocationContext();
  const { graph, loading: graphLoading } = useGraph();
  const { addAlert } = useAlert();
  
  const checkSafety = async () => {
    setIsChecking(true);
    
    try {
      const location = await getUserLocation();
      
      if (!location || !location.nodeId) {
        addAlert({
          type: 'error',
          message: 'Could not determine your current location'
        });
        setSafetyStatus('unknown');
        return;
      }
      
      setCurrentNodeId(location.nodeId);
      
      // If we have the graph data, determine safety status
      if (graph && graph.nodes[location.nodeId]) {
        const node = graph.nodes[location.nodeId];
        setSafetyStatus((node.type as any) || 'unknown');
      } else {
        setSafetyStatus('unknown');
      }
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking safety:', error);
      addAlert({
        type: 'error',
        message: 'Failed to check safety status'
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    // Check safety on component mount
    checkSafety();
    
    // Set up interval to refresh every 2 minutes
    const intervalId = setInterval(checkSafety, 120000);
    
    return () => clearInterval(intervalId);
  }, [graph]);
  
  const renderSafetyInfo = () => {
    let icon, title, description, color, action;
    
    switch (safetyStatus) {
      case 'safe':
        icon = <CheckCircle className="h-10 w-10 text-green-600" />;
        title = 'You are in a safe area';
        description = 'This location is designated as a safe zone. You are currently in a secure area.';
        color = 'bg-green-100 border-green-300 text-green-800';
        action = (
          <div className="flex mt-4">
            <Link to="/dashboard" className="btn btn-success">
              Return to Dashboard
            </Link>
          </div>
        );
        break;
        
      case 'warning':
        icon = <AlertTriangle className="h-10 w-10 text-yellow-600" />;
        title = 'Caution: Potential Risk Zone';
        description = 'Your current location has potential risks. Please stay alert and monitor official communications.';
        color = 'bg-yellow-100 border-yellow-300 text-yellow-800';
        action = (
          <div className="flex mt-4 space-x-4">
            <Link to="/sos" className="btn btn-warning">
              View Evacuation Options
            </Link>
          </div>
        );
        break;
        
      case 'danger':
        icon = <AlertTriangle className="h-10 w-10 text-red-600" />;
        title = 'DANGER: Evacuation Recommended';
        description = 'You are currently in a high-risk area. Immediate evacuation is recommended.';
        color = 'bg-red-100 border-red-300 text-red-800';
        action = (
          <div className="flex mt-4">
            <Link to="/sos" className="btn btn-danger">
              Find Evacuation Route Now
            </Link>
          </div>
        );
        break;
        
      default:
        icon = <Shield className="h-10 w-10 text-gray-500" />;
        title = 'Safety Status Unknown';
        description = 'We could not determine the safety status of your current location.';
        color = 'bg-gray-100 border-gray-300 text-gray-800';
        action = (
          <div className="flex mt-4">
            <button
              onClick={checkSafety}
              className="btn btn-secondary flex items-center"
              disabled={isChecking}
            >
              {isChecking ? (
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600 mr-2"></span>
              ) : (
                <RefreshCw size={18} className="mr-2" />
              )}
              Retry
            </button>
          </div>
        );
    }
    
    return (
      <div className={`border rounded-lg p-6 ${color}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="mb-2">{description}</p>
            
            {currentNodeId && graph?.nodes[currentNodeId] && (
              <div className="my-3">
                <strong className="block mb-1">Current Location:</strong>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>{graph.nodes[currentNodeId].name}</span>
                </div>
              </div>
            )}
            
            {lastChecked && (
              <p className="text-sm mt-2">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
            
            {action}
          </div>
        </div>
      </div>
    );
  };
  
  if (graphLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading safety data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Check Location Safety</h1>
        <p className="text-gray-600">Verify the safety status of your current location.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            {renderSafetyInfo()}
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Area Map</h3>
                <button
                  onClick={checkSafety}
                  className="flex items-center text-blue-600 text-sm"
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-1"></span>
                  ) : (
                    <RefreshCw size={14} className="mr-1" />
                  )}
                  Refresh
                </button>
              </div>
              
              {graph ? (
                <div className="overflow-auto">
                  <GraphVisualization
                    graph={graph}
                    currentNode={currentNodeId || undefined}
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
            </div>
          </div>
        </div>
        
        <div>
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Safety Legend</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="w-4 h-4 rounded-full bg-green-500 mt-1 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="block text-gray-900">Safe Zone</strong>
                  <p className="text-sm text-gray-600">Designated evacuation areas that are monitored and secured</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-4 h-4 rounded-full bg-blue-500 mt-1 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="block text-gray-900">Normal Area</strong>
                  <p className="text-sm text-gray-600">Standard areas with no current alerts or warnings</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-4 h-4 rounded-full bg-yellow-500 mt-1 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="block text-gray-900">Warning Area</strong>
                  <p className="text-sm text-gray-600">Areas with potential risks that require increased awareness</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-4 h-4 rounded-full bg-red-500 mt-1 mr-3 flex-shrink-0"></span>
                <div>
                  <strong className="block text-gray-900">Danger Zone</strong>
                  <p className="text-sm text-gray-600">High-risk areas where immediate evacuation is recommended</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Safety Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                  <span className="text-xs font-bold">1</span>
                </div>
                <p className="text-gray-700">If you're in a danger zone, evacuate immediately following recommended routes.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                  <span className="text-xs font-bold">2</span>
                </div>
                <p className="text-gray-700">In warning areas, prepare for possible evacuation and stay alert for updates.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-gray-700">Even in safe zones, remain vigilant and follow instructions from authorities.</p>
              </li>
            </ul>
            
            <div className="mt-6">
              <Link to="/sos" className="btn btn-primary w-full">
                Find Evacuation Route
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckSafety;