import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useGraph } from '../hooks/useGraph';
import { useAlert } from './AlertContext';

export interface LocationType {
  nodeId: string;
  name: string;
  address?: string;
  timestamp: string;
  type?: 'normal' | 'safe' | 'warning' | 'danger';
}

interface LocationContextType {
  getUserLocation: () => Promise<LocationType | null>;
  addLocation: (location: LocationType) => Promise<void>;
  getSavedLocations: () => Promise<LocationType[]>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const { graph } = useGraph();
  const { addAlert } = useAlert();
  
  // Get user's current location
  const getUserLocation = async (): Promise<LocationType | null> => {
    try {
      // First try to get from state
      if (currentLocation) {
        return currentLocation;
      }
      
      // Try to get from localStorage
      const savedLocation = localStorage.getItem('safeEscapeCurrentLocation');
      if (savedLocation) {
        const parsedLocation = JSON.parse(savedLocation);
        setCurrentLocation(parsedLocation);
        return parsedLocation;
      }
      
      // If no saved location, mock a random location from the graph
      if (graph) {
        const nodeIds = Object.keys(graph.nodes);
        if (nodeIds.length > 0) {
          // Pick a random node
          const randomNodeId = nodeIds[Math.floor(Math.random() * nodeIds.length)];
          const node = graph.nodes[randomNodeId];
          
          const newLocation: LocationType = {
            nodeId: randomNodeId,
            name: node.name,
            timestamp: new Date().toISOString(),
            type: node.type as any || 'normal'
          };
          
          setCurrentLocation(newLocation);
          localStorage.setItem('safeEscapeCurrentLocation', JSON.stringify(newLocation));
          
          addAlert({
            type: 'info',
            message: `Location set to ${node.name} for demonstration`
          });
          
          return newLocation;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user location:', error);
      return null;
    }
  };
  
  // Add a new location to saved locations
  const addLocation = async (location: LocationType): Promise<void> => {
    try {
      // Save as current location
      setCurrentLocation(location);
      localStorage.setItem('safeEscapeCurrentLocation', JSON.stringify(location));
      
      // Add to saved locations
      const savedLocations = await getSavedLocations();
      savedLocations.unshift(location); // Add to beginning
      
      // Keep only the 10 most recent locations
      const updatedLocations = savedLocations.slice(0, 10);
      localStorage.setItem('safeEscapeSavedLocations', JSON.stringify(updatedLocations));
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };
  
  // Get all saved locations
  const getSavedLocations = async (): Promise<LocationType[]> => {
    try {
      const savedLocations = localStorage.getItem('safeEscapeSavedLocations');
      if (savedLocations) {
        return JSON.parse(savedLocations);
      }
      return [];
    } catch (error) {
      console.error('Error getting saved locations:', error);
      return [];
    }
  };
  
  const value = {
    getUserLocation,
    addLocation,
    getSavedLocations
  };
  
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};