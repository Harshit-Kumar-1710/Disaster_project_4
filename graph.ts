export interface NodeType {
  id: string;
  name: string;
  type?: 'normal' | 'safe' | 'warning' | 'danger';
  description?: string;
  lat?: number;
  lng?: number;
  x?: number;
  y?: number;
  isHazard?: boolean;
}

export interface EdgeType {
  id: string;
  source: string;
  target: string;
  weight: number;
  status?: 'open' | 'blocked';
  traffic?: 'low' | 'medium' | 'high';
}

export interface GraphType {
  nodes: { [id: string]: NodeType };
  edges: { [id: string]: EdgeType };
}

export interface RouteAnimationState {
  currentNodeIndex: number;
  isAnimating: boolean;
  progress: number;
}