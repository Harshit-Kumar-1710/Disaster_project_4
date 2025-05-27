import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import { useLocation as useLocationContext } from '../context/LocationContext';
import { useAlert } from '../context/AlertContext';
import { useGraph } from '../hooks/useGraph';
import GraphVisualization from '../components/GraphVisualization';

const AddLocation: React.FC = () => {
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addLocation, getUserLocation } = useLocationContext();
  const { addAlert } = useAlert();
  const { graph, loading } = useGraph();
  
  useEffect(() => {
    // Try to get user's current location on component mount
    const fetchCurrentLocation = async () => {
      try {
        const location = await getUserLocation();
        if (location && location.nodeId) {
          setSelectedNode(location.nodeId);
        }
      } catch (error) {
        console.error('Error fetching current location:', error);
      }
    };
    
    fetchCurrentLocation();
  }, [getUserLocation]);
  
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    
    // If the node exists in the graph, set the name field
    if (graph && graph.nodes[nodeId]) {
      setLocationName(graph.nodes[nodeId].name);
    }
  };
  
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNode) {
      addAlert({
        type: 'error',
        message: 'Please select a location on the graph'
      });
      return;
    }
    
    if (!locationName.trim()) {
      addAlert({
        type: 'error',
        message: 'Please enter a location name'
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      await addLocation({
        nodeId: selectedNode,
        name: locationName,
        address: address,
        timestamp: new Date().toISOString(),
        type: graph?.nodes[selectedNode]?.type || 'normal'
      });
      
      addAlert({
        type: 'success',
        message: 'Location added successfully!'
      });
      
      // Clear form
      setLocationName('');
      setAddress('');
    } catch (error) {
      console.error('Error adding location:', error);
      addAlert({
        type: 'error',
        message: 'Failed to add location. Please try again.'
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading graph data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Location</h1>
        <p className="text-gray-600">Select a location on the graph and save it to your profile.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Graph</h2>
            <p className="text-gray-600 mb-4">Click on a node to select your location:</p>
            
            {graph ? (
              <div className="overflow-auto">
                <GraphVisualization
                  graph={graph}
                  currentNode={selectedNode || undefined}
                  width={800}
                  height={600}
                  onNodeClick={handleNodeClick}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-60 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Graph data not available</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h2>
            
            {selectedNode ? (
              <form onSubmit={handleAddLocation} className="space-y-4">
                <div className="input-group">
                  <label htmlFor="locationName" className="input-label">Location Name</label>
                  <input
                    id="locationName"
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Home, Office, School"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="address" className="input-label">Address (Optional)</label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                    placeholder="Enter address details"
                  />
                </div>
                
                <div className="input-group">
                  <label className="input-label">Selected Node</label>
                  <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div className={`w-4 h-4 rounded-full mr-2 ${
                      graph?.nodes[selectedNode]?.type === 'safe' ? 'bg-green-500' :
                      graph?.nodes[selectedNode]?.type === 'warning' ? 'bg-yellow-500' :
                      graph?.nodes[selectedNode]?.type === 'danger' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="text-gray-700">
                      {graph?.nodes[selectedNode]?.name || `Node ${selectedNode}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedNode(null)}
                      className="ml-auto text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="input-label">Location Type</label>
                  <div className={`p-3 rounded-lg ${
                    graph?.nodes[selectedNode]?.type === 'safe' ? 'bg-green-100 text-green-800' :
                    graph?.nodes[selectedNode]?.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    graph?.nodes[selectedNode]?.type === 'danger' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <p className="font-medium capitalize">
                      {graph?.nodes[selectedNode]?.type || 'Normal'} Location
                    </p>
                    <p className="text-sm mt-1">
                      {graph?.nodes[selectedNode]?.type === 'safe' 
                        ? 'This is a designated safe area for emergencies.' 
                        : graph?.nodes[selectedNode]?.type === 'warning'
                        ? 'This area has potential risks. Exercise caution.'
                        : graph?.nodes[selectedNode]?.type === 'danger'
                        ? 'This is a danger zone! Evacuation is recommended.'
                        : 'This is a standard location with no special status.'}
                    </p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full flex items-center justify-center"
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Save Location
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Select a location on the graph to add it to your profile.
                </p>
              </div>
            )}
          </div>
          
          <div className="card p-6 mt-6">
            <h3 className="font-medium text-gray-900 mb-2">About Location Types</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-700"><strong>Safe Zones:</strong> Designated evacuation areas</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                <span className="text-gray-700"><strong>Warning Areas:</strong> Potential risk zones</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span className="text-gray-700"><strong>Danger Zones:</strong> Active emergency areas</span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-gray-700"><strong>Normal:</strong> Standard locations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;