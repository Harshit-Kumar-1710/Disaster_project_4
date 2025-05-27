import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle, FileText, Plus, Clock, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation as useLocationContext } from '../context/LocationContext';
import { useGraph } from '../hooks/useGraph';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { getSavedLocations, getUserLocation } = useLocationContext();
  const { graph, loading: graphLoading } = useGraph();
  const [recentLocations, setRecentLocations] = useState<any[]>([]);
  const [safetyStatus, setSafetyStatus] = useState<'safe' | 'warning' | 'danger' | 'unknown'>('unknown');
  
  useEffect(() => {
    // Get user's recent locations
    const fetchRecentLocations = async () => {
      const locations = await getSavedLocations();
      setRecentLocations(locations.slice(0, 3)); // Get the 3 most recent locations
    };
    
    // Check current safety status
    const checkSafetyStatus = async () => {
      try {
        const currentLocation = await getUserLocation();
        if (!currentLocation || !graph || graphLoading) {
          setSafetyStatus('unknown');
          return;
        }
        
        // Find the node corresponding to current location
        const locationNode = Object.values(graph.nodes).find(
          node => node.id === currentLocation.nodeId
        );
        
        if (!locationNode) {
          setSafetyStatus('unknown');
          return;
        }
        
        setSafetyStatus(locationNode.type as any || 'unknown');
      } catch (error) {
        console.error('Error checking safety status:', error);
        setSafetyStatus('unknown');
      }
    };
    
    fetchRecentLocations();
    checkSafetyStatus();
    
    // Refresh safety status every minute
    const intervalId = setInterval(checkSafetyStatus, 60000);
    return () => clearInterval(intervalId);
  }, [graph, graphLoading, getSavedLocations, getUserLocation]);
  
  const getSafetyStatusDisplay = () => {
    switch(safetyStatus) {
      case 'safe':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <UserCheck className="h-6 w-6 text-green-600" />,
          message: 'You are currently in a safe area'
        };
      case 'warning':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          message: 'You are in an area with potential risks'
        };
      case 'danger':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          message: 'DANGER! You should evacuate immediately'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="h-6 w-6 text-gray-600" />,
          message: 'Safety status unknown'
        };
    }
  };
  
  const statusDisplay = getSafetyStatusDisplay();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.displayName || 'User'}</h1>
        <p className="text-gray-600">Your safety dashboard provides quick access to important features.</p>
      </header>
      
      {/* Safety Status */}
      <div className={`p-4 rounded-lg mb-8 flex items-center ${statusDisplay.color}`}>
        {statusDisplay.icon}
        <div className="ml-3">
          <h3 className="font-medium">Current Safety Status</h3>
          <p>{statusDisplay.message}</p>
        </div>
        {safetyStatus === 'danger' && (
          <Link to="/sos" className="btn btn-danger ml-auto">
            Get Evacuation Route
          </Link>
        )}
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/add-location" className="card p-6 flex items-center hover:bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Add Location</h3>
            <p className="text-sm text-gray-600">Add a new location to your profile</p>
          </div>
        </Link>
        
        <Link to="/check-safety" className="card p-6 flex items-center hover:bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Check Safety</h3>
            <p className="text-sm text-gray-600">Verify if your location is safe</p>
          </div>
        </Link>
        
        <Link to="/sos" className="card p-6 flex items-center hover:bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">SOS Route</h3>
            <p className="text-sm text-gray-600">Find evacuation route to safety</p>
          </div>
        </Link>
      </div>
      
      {/* Recent Locations */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Locations</h2>
          <Link to="/add-location" className="text-blue-600 flex items-center text-sm">
            <Plus size={16} className="mr-1" />
            Add New
          </Link>
        </div>
        
        {recentLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentLocations.map((location, index) => (
              <div key={index} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{location.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    location.type === 'safe' ? 'bg-green-100 text-green-800' :
                    location.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    location.type === 'danger' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {location.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{location.address}</p>
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock size={12} className="mr-1" />
                  <span>Added {new Date(location.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-600 mb-4">You haven't added any locations yet.</p>
            <Link to="/add-location" className="btn btn-primary inline-flex items-center">
              <Plus size={18} className="mr-1" />
              Add Your First Location
            </Link>
          </div>
        )}
      </div>
      
      {/* Emergency Tips */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Preparedness Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
              <span className="text-xs font-bold">1</span>
            </div>
            <p className="text-gray-700">Always keep your phone charged and have a backup power bank.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
              <span className="text-xs font-bold">2</span>
            </div>
            <p className="text-gray-700">Establish meeting points with family members in case of separation.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
              <span className="text-xs font-bold">3</span>
            </div>
            <p className="text-gray-700">Follow official instructions and evacuation orders promptly.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;