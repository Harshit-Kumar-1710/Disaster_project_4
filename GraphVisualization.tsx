import React, { useEffect, useRef, useState } from 'react';
import { LocationType, useLocation as useLocationContext } from '../context/LocationContext';
import { NodeType, EdgeType, GraphType } from '../types/graph';

interface GraphVisualizationProps {
  graph: GraphType;
  currentNode?: string;
  pathNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
  width?: number;
  height?: number;
  interactive?: boolean;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graph,
  currentNode,
  pathNodes = [],
  onNodeClick,
  width = 800,
  height = 600,
  interactive = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { getUserLocation } = useLocationContext();
  
  // Force-directed layout simulation
  useEffect(() => {
    if (!svgRef.current || !graph) return;
    
    // Convert the graph data structure for visualization
    const nodes = Object.values(graph.nodes);
    const edges = Object.values(graph.edges);
    
    // Simple force-directed layout
    const simulation = () => {
      // Position nodes in a circular layout initially
      const radius = Math.min(width, height) / 3;
      const centerX = width / 2;
      const centerY = height / 2;
      
      nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
      });
      
      // Add safe zones to the outer edge
      const safeNodes = nodes.filter(node => node.type === 'safe');
      safeNodes.forEach((node, i) => {
        const angle = (i / safeNodes.length) * 2 * Math.PI;
        node.x = centerX + (radius * 1.3) * Math.cos(angle);
        node.y = centerY + (radius * 1.3) * Math.sin(angle);
      });
      
      // Position danger zones more centrally
      const dangerNodes = nodes.filter(node => node.type === 'danger');
      dangerNodes.forEach((node, i) => {
        const angle = (i / dangerNodes.length) * 2 * Math.PI;
        node.x = centerX + (radius * 0.5) * Math.cos(angle);
        node.y = centerY + (radius * 0.5) * Math.sin(angle);
      });
    };
    
    simulation();
    
    // Draw the graph
    renderGraph();
  }, [graph, width, height, currentNode, pathNodes]);
  
  const renderGraph = () => {
    if (!svgRef.current || !graph) return;
    
    const svg = svgRef.current;
    
    // Clear previous elements
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Create a group for edges
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(edgesGroup);
    
    // Draw edges
    Object.values(graph.edges).forEach(edge => {
      const sourceNode = graph.nodes[edge.source];
      const targetNode = graph.nodes[edge.target];
      
      if (!sourceNode || !targetNode) return;
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', sourceNode.x?.toString() || '0');
      line.setAttribute('y1', sourceNode.y?.toString() || '0');
      line.setAttribute('x2', targetNode.x?.toString() || '0');
      line.setAttribute('y2', targetNode.y?.toString() || '0');
      
      // Check if this edge is part of the current path
      const isPath = pathNodes.includes(sourceNode.id) && pathNodes.includes(targetNode.id) &&
                    pathNodes.indexOf(sourceNode.id) === pathNodes.indexOf(targetNode.id) - 1;
      
      if (isPath) {
        line.setAttribute('class', 'edge-path');
      } else if (edge.status === 'blocked') {
        line.setAttribute('class', 'edge-blocked');
      } else {
        line.setAttribute('class', 'edge');
      }
      
      // Add weight label
      if (edge.weight) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const midX = (sourceNode.x! + targetNode.x!) / 2;
        const midY = (sourceNode.y! + targetNode.y!) / 2;
        
        text.setAttribute('x', midX.toString());
        text.setAttribute('y', midY.toString());
        text.setAttribute('class', 'edge-weight');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '-5');
        text.setAttribute('fill', '#666');
        text.setAttribute('font-size', '10');
        text.textContent = edge.weight.toString();
        
        edgesGroup.appendChild(text);
      }
      
      edgesGroup.appendChild(line);
    });
    
    // Create a group for nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(nodesGroup);
    
    // Draw nodes
    Object.values(graph.nodes).forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x?.toString() || '0');
      circle.setAttribute('cy', node.y?.toString() || '0');
      circle.setAttribute('r', node.id === currentNode ? '12' : '8');
      
      let nodeClass = 'node node-normal';
      
      if (node.type === 'safe') {
        nodeClass = 'node node-safe';
      } else if (node.type === 'danger') {
        nodeClass = 'node node-danger';
      } else if (node.type === 'warning') {
        nodeClass = 'node node-warning';
      }
      
      if (node.id === currentNode) {
        nodeClass += ' node-current';
      }
      
      circle.setAttribute('class', nodeClass);
      
      if (interactive) {
        circle.addEventListener('click', () => {
          if (onNodeClick) onNodeClick(node.id);
        });
        
        // Tooltip functionality
        circle.addEventListener('mouseenter', (e) => {
          setHoveredNode(node.id);
          showTooltip(e, node);
        });
        
        circle.addEventListener('mouseleave', () => {
          setHoveredNode(null);
          hideTooltip();
        });
      }
      
      nodesGroup.appendChild(circle);
      
      // Add node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x?.toString() || '0');
      text.setAttribute('y', (node.y! + 20).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#333');
      text.setAttribute('font-size', '10');
      text.setAttribute('class', 'node-label');
      text.textContent = node.name;
      
      nodesGroup.appendChild(text);
    });
  };
  
  const showTooltip = (event: MouseEvent, node: NodeType) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
      <div>
        <strong>${node.name}</strong><br/>
        Type: ${node.type}<br/>
        ${node.description ? `<small>${node.description}</small>` : ''}
      </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position the tooltip near the mouse
    const updatePosition = (e: MouseEvent) => {
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
    };
    
    updatePosition(event);
    
    // Update position on mouse move
    document.addEventListener('mousemove', updatePosition as any);
    
    // Store cleanup function on the tooltip element
    (tooltip as any).cleanup = () => {
      document.removeEventListener('mousemove', updatePosition as any);
    };
  };
  
  const hideTooltip = () => {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      // Call cleanup function if it exists
      if ((tooltip as any).cleanup) {
        (tooltip as any).cleanup();
      }
      document.body.removeChild(tooltip);
    }
  };
  
  return (
    <div className="graph-container relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="graph-svg border border-gray-200 rounded-lg bg-white shadow-inner"
      ></svg>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white p-2 rounded-md shadow-md text-xs">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
          <span>Normal Location</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
          <span>Safe Zone</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span>Warning Area</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>
          <span>Danger Zone</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;