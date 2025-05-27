import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { NodeType, EdgeType, GraphType, RouteAnimationState } from '../types/graph';
import { trafficColors } from '../utils/dehradunData';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapVisualizationProps {
  graph: GraphType;
  currentNode?: string;
  pathNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
  width?: number;
  height?: number;
  interactive?: boolean;
}

// Custom icons for different node types
const createIcon = (color: string) => new L.Icon({
  iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(color)}' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const icons = {
  normal: createIcon('#3B82F6'),
  safe: createIcon('#10B981'),
  warning: createIcon('#F59E0B'),
  danger: createIcon('#EF4444'),
  hazard: createIcon('#991B1B'),
};

// Calculate real-world distance between two points in meters
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

// Animation component for the route
const RouteAnimation: React.FC<{ 
  path: [number, number][], 
  duration: number,
  traffic: 'low' | 'medium' | 'high'
}> = ({ path, duration, traffic }) => {
  const map = useMap();
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!path.length) return;

    // Create a custom icon for the moving marker
    const movingIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-4 h-4 rounded-full bg-blue-500 shadow-lg"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Create marker and add to map
    const animatedMarker = L.marker(path[0], { icon: movingIcon });
    animatedMarker.addTo(map);

    // Calculate total distance
    let totalDistance = 0;
    for (let i = 1; i < path.length; i++) {
      totalDistance += calculateDistance(
        path[i-1][0], path[i-1][1],
        path[i][0], path[i][1]
      );
    }

    // Animate marker along the path
    let currentIndex = 0;
    const moveMarker = () => {
      if (currentIndex >= path.length - 1) {
        setProgress(100);
        return;
      }

      const start = path[currentIndex];
      const end = path[currentIndex + 1];
      const startTime = Date.now();
      const segmentDuration = (duration * calculateDistance(start[0], start[1], end[0], end[1])) / totalDistance;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / segmentDuration, 1);

        const lat = start[0] + (end[0] - start[0]) * progress;
        const lng = start[1] + (end[1] - start[1]) * progress;
        animatedMarker.setLatLng([lat, lng]);

        // Update overall progress
        const coveredDistance = calculateDistance(path[0][0], path[0][1], lat, lng);
        setProgress((coveredDistance / totalDistance) * 100);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          currentIndex++;
          if (currentIndex < path.length - 1) {
            moveMarker();
          }
        }
      };

      requestAnimationFrame(animate);
    };

    moveMarker();
    setMarker(animatedMarker);

    return () => {
      if (marker) {
        marker.remove();
      }
    };
  }, [path, map, duration]);

  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
      <div className="text-sm font-medium mb-1">Evacuation Progress</div>
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {Math.round(progress)}% complete
      </div>
    </div>
  );
};

const MapVisualization: React.FC<MapVisualizationProps> = ({
  graph,
  currentNode,
  pathNodes = [],
  onNodeClick,
  height = 600,
  interactive = true,
}) => {
  // Calculate map bounds
  const bounds = Object.values(graph.nodes).reduce(
    (acc, node) => {
      if (node.lat && node.lng) {
        acc.push([node.lat, node.lng]);
      }
      return acc;
    },
    [] as [number, number][]
  );

  // Create path coordinates for animation
  const pathCoordinates = pathNodes
    .map(nodeId => {
      const node = graph.nodes[nodeId];
      return node.lat && node.lng ? [node.lat, node.lng] as [number, number] : null;
    })
    .filter((coord): coord is [number, number] => coord !== null);

  // Calculate route details
  const calculateRouteDetails = () => {
    let totalDistance = 0;
    let totalTime = 0;
    let traffic: 'low' | 'medium' | 'high' = 'low';

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const currentNode = graph.nodes[pathNodes[i]];
      const nextNode = graph.nodes[pathNodes[i + 1]];

      if (currentNode.lat && currentNode.lng && nextNode.lat && nextNode.lng) {
        const segmentDistance = calculateDistance(
          currentNode.lat, currentNode.lng,
          nextNode.lat, nextNode.lng
        );
        totalDistance += segmentDistance;

        // Find the edge between these nodes
        const edge = Object.values(graph.edges).find(e => 
          (e.source === pathNodes[i] && e.target === pathNodes[i + 1]) ||
          (e.target === pathNodes[i] && e.source === pathNodes[i + 1])
        );

        // Adjust time based on traffic
        const trafficMultiplier = edge?.traffic === 'high' ? 2 :
                                edge?.traffic === 'medium' ? 1.5 : 1;
        totalTime += (segmentDistance / 1.4) * trafficMultiplier; // 1.4 m/s average walking speed

        // Update overall traffic status
        if (edge?.traffic === 'high') traffic = 'high';
        else if (edge?.traffic === 'medium' && traffic !== 'high') traffic = 'medium';
      }
    }

    return {
      distance: totalDistance,
      time: Math.ceil(totalTime / 60), // Convert to minutes
      traffic
    };
  };

  const routeDetails = pathCoordinates.length > 1 ? calculateRouteDetails() : null;

  return (
    <div style={{ height: `${height}px`, width: '100%' }} className="relative">
      <MapContainer
        bounds={L.latLngBounds(bounds)}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        whenCreated={map => {
          map.fitBounds(bounds);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render edges (roads) */}
        {Object.values(graph.edges).map(edge => {
          const sourceNode = graph.nodes[edge.source];
          const targetNode = graph.nodes[edge.target];

          if (!sourceNode?.lat || !sourceNode?.lng || !targetNode?.lat || !targetNode?.lng) {
            return null;
          }

          const coordinates: [number, number][] = [
            [sourceNode.lat, sourceNode.lng],
            [targetNode.lat, targetNode.lng],
          ];

          const isPathEdge = pathNodes.includes(edge.source) && pathNodes.includes(edge.target) &&
                            Math.abs(pathNodes.indexOf(edge.source) - pathNodes.indexOf(edge.target)) === 1;

          const color = isPathEdge ? '#2563EB' :
                       edge.status === 'blocked' ? trafficColors.blocked :
                       trafficColors[edge.traffic || 'low'];

          const options = isPathEdge ? {
            color,
            weight: 4,
            opacity: 0.8,
            dashArray: '10,10',
            className: 'route-animation'
          } : {
            color,
            weight: 4,
            opacity: 0.8
          };

          return (
            <Polyline
              key={edge.id}
              positions={coordinates}
              {...options}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Traffic Status:</strong> {edge.traffic || 'Unknown'}
                  <br />
                  <strong>Status:</strong> {edge.status || 'Open'}
                  <br />
                  <strong>Distance:</strong> {Math.round(calculateDistance(
                    sourceNode.lat, sourceNode.lng,
                    targetNode.lat, targetNode.lng
                  ))} meters
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render nodes (locations) */}
        {Object.values(graph.nodes).map(node => {
          if (!node.lat || !node.lng) return null;

          const icon = node.isHazard ? icons.hazard :
                      node.type ? icons[node.type] : icons.normal;

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (interactive && onNodeClick) {
                    onNodeClick(node.id);
                  }
                },
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="block text-lg mb-1">{node.name}</strong>
                  {node.description && <p className="mb-2">{node.description}</p>}
                  {node.isHazard && (
                    <p className="text-red-600 font-bold">⚠️ Hazard Reported</p>
                  )}
                  <p className="text-gray-600">Type: {node.type || 'Normal'}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render route animation */}
        {pathCoordinates.length > 1 && routeDetails && (
          <RouteAnimation
            path={pathCoordinates}
            duration={routeDetails.time * 1000} // Convert minutes to milliseconds
            traffic={routeDetails.traffic}
          />
        )}
      </MapContainer>

      {/* Route details overlay */}
      {routeDetails && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md z-[1000]">
          <h3 className="font-medium text-lg mb-2">Route Details</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Total Distance:</strong> {Math.round(routeDetails.distance)} meters
            </p>
            <p>
              <strong>Estimated Time:</strong> {routeDetails.time} minutes
            </p>
            <p>
              <strong>Traffic Conditions:</strong>{' '}
              <span className={`px-2 py-1 rounded-full text-xs ${
                routeDetails.traffic === 'high' ? 'bg-red-100 text-red-800' :
                routeDetails.traffic === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {routeDetails.traffic.charAt(0).toUpperCase() + routeDetails.traffic.slice(1)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapVisualization;