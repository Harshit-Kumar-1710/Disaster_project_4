import { GraphType } from '../types/graph';

// Dehradun map data with real locations
export const dehradunGraph: GraphType = {
  nodes: {
    'clock_tower': {
      id: 'clock_tower',
      name: 'Clock Tower',
      type: 'normal',
      lat: 30.3245,
      lng: 78.0339,
      description: 'Historic Clock Tower of Dehradun'
    },
    'railway_station': {
      id: 'railway_station',
      name: 'Dehradun Railway Station',
      type: 'safe',
      lat: 30.3173,
      lng: 78.0322,
      description: 'Main railway station - Designated evacuation point'
    },
    'parade_ground': {
      id: 'parade_ground',
      name: 'Parade Ground',
      type: 'safe',
      lat: 30.3249,
      lng: 78.0362,
      description: 'Large open space - Emergency assembly point'
    },
    'gandhi_park': {
      id: 'gandhi_park',
      name: 'Gandhi Park',
      type: 'safe',
      lat: 30.3257,
      lng: 78.0416,
      description: 'Public park - Safe zone with multiple exit points'
    },
    'doon_hospital': {
      id: 'doon_hospital',
      name: 'Doon Hospital',
      type: 'safe',
      lat: 30.3228,
      lng: 78.0328,
      description: 'Main government hospital - Medical emergency center'
    },
    'paltan_bazaar': {
      id: 'paltan_bazaar',
      name: 'Paltan Bazaar',
      type: 'warning',
      lat: 30.3234,
      lng: 78.0349,
      description: 'Crowded market area - High congestion risk during emergencies'
    },
    'prince_chowk': {
      id: 'prince_chowk',
      name: 'Prince Chowk',
      type: 'normal',
      lat: 30.3261,
      lng: 78.0332,
      description: 'Major intersection'
    },
    'survey_chowk': {
      id: 'survey_chowk',
      name: 'Survey Chowk',
      type: 'warning',
      lat: 30.3336,
      lng: 78.0420,
      description: 'Heavy traffic junction - Potential bottleneck'
    },
    'ec_road': {
      id: 'ec_road',
      name: 'EC Road',
      type: 'normal',
      lat: 30.3284,
      lng: 78.0366,
      description: 'Major commercial area'
    },
    'rajpur_road': {
      id: 'rajpur_road',
      name: 'Rajpur Road',
      type: 'normal',
      lat: 30.3315,
      lng: 78.0424,
      description: 'Main connecting road to Rajpur'
    },
    'isbt': {
      id: 'isbt',
      name: 'ISBT Dehradun',
      type: 'safe',
      lat: 30.3168,
      lng: 78.0298,
      description: 'Interstate Bus Terminal - Large evacuation point'
    },
    'race_course': {
      id: 'race_course',
      name: 'Race Course',
      type: 'safe',
      lat: 30.3162,
      lng: 78.0452,
      description: 'Open ground - Emergency landing and relief camp site'
    },
    'chemical_factory': {
      id: 'chemical_factory',
      name: 'Industrial Area',
      type: 'danger',
      lat: 30.3198,
      lng: 78.0358,
      description: 'Chemical storage facility - High risk area'
    },
    'forest_fire': {
      id: 'forest_fire',
      name: 'Forest Ridge',
      type: 'danger',
      lat: 30.3352,
      lng: 78.0445,
      description: 'Active forest fire zone - Avoid area'
    },
    'landslide_zone': {
      id: 'landslide_zone',
      name: 'Hill Bypass',
      type: 'danger',
      lat: 30.3289,
      lng: 78.0482,
      description: 'Recent landslide activity - Unstable terrain'
    },
    'flood_risk': {
      id: 'flood_risk',
      name: 'River Bank',
      type: 'warning',
      lat: 30.3142,
      lng: 78.0378,
      description: 'Flood-prone area during monsoon'
    },
    'gas_leak': {
      id: 'gas_leak',
      name: 'Gas Plant',
      type: 'danger',
      lat: 30.3208,
      lng: 78.0392,
      description: 'Reported gas leak - Hazardous area'
    },
    'power_station': {
      id: 'power_station',
      name: 'Power Grid',
      type: 'warning',
      lat: 30.3275,
      lng: 78.0298,
      description: 'High voltage area - Exercise caution'
    },
    // New central safe zone
    'central_shelter': {
      id: 'central_shelter',
      name: 'Central Emergency Shelter',
      type: 'safe',
      lat: 30.3245,
      lng: 78.0375,
      description: 'Main emergency shelter with medical facilities and supplies'
    },
    // Additional new nodes
    'market_complex': {
      id: 'market_complex',
      name: 'City Market Complex',
      type: 'warning',
      lat: 30.3218,
      lng: 78.0412,
      description: 'Dense commercial area with high foot traffic'
    },
    'school_zone': {
      id: 'school_zone',
      name: 'School District',
      type: 'warning',
      lat: 30.3192,
      lng: 78.0445,
      description: 'Multiple schools - Priority evacuation zone'
    },
    'temple_complex': {
      id: 'temple_complex',
      name: 'Temple Complex',
      type: 'safe',
      lat: 30.3267,
      lng: 78.0398,
      description: 'Large temple grounds - Alternative assembly point'
    },
    'residential_block': {
      id: 'residential_block',
      name: 'Housing Colony',
      type: 'normal',
      lat: 30.3231,
      lng: 78.0434,
      description: 'Dense residential area'
    },
    'sports_complex': {
      id: 'sports_complex',
      name: 'Sports Complex',
      type: 'safe',
      lat: 30.3203,
      lng: 78.0332,
      description: 'Large open ground with basic facilities'
    }
  },
  edges: {
    'e1': {
      id: 'e1',
      source: 'clock_tower',
      target: 'paltan_bazaar',
      weight: 2,
      traffic: 'high'
    },
    'e2': {
      id: 'e2',
      source: 'clock_tower',
      target: 'railway_station',
      weight: 3,
      traffic: 'medium'
    },
    'e3': {
      id: 'e3',
      source: 'clock_tower',
      target: 'parade_ground',
      weight: 1,
      traffic: 'low'
    },
    'e4': {
      id: 'e4',
      source: 'paltan_bazaar',
      target: 'doon_hospital',
      weight: 2,
      traffic: 'medium'
    },
    'e5': {
      id: 'e5',
      source: 'parade_ground',
      target: 'gandhi_park',
      weight: 2,
      traffic: 'low'
    },
    'e6': {
      id: 'e6',
      source: 'prince_chowk',
      target: 'ec_road',
      weight: 3,
      traffic: 'high'
    },
    'e7': {
      id: 'e7',
      source: 'ec_road',
      target: 'survey_chowk',
      weight: 4,
      traffic: 'high'
    },
    'e8': {
      id: 'e8',
      source: 'survey_chowk',
      target: 'rajpur_road',
      weight: 2,
      traffic: 'medium'
    },
    'e9': {
      id: 'e9',
      source: 'gandhi_park',
      target: 'rajpur_road',
      weight: 3,
      traffic: 'medium'
    },
    'e10': {
      id: 'e10',
      source: 'paltan_bazaar',
      target: 'prince_chowk',
      weight: 2,
      traffic: 'high'
    },
    'e11': {
      id: 'e11',
      source: 'railway_station',
      target: 'isbt',
      weight: 2,
      traffic: 'low'
    },
    'e12': {
      id: 'e12',
      source: 'isbt',
      target: 'flood_risk',
      weight: 3,
      traffic: 'medium'
    },
    'e13': {
      id: 'e13',
      source: 'flood_risk',
      target: 'chemical_factory',
      weight: 2,
      traffic: 'low',
      status: 'blocked'
    },
    'e14': {
      id: 'e14',
      source: 'chemical_factory',
      target: 'gas_leak',
      weight: 1,
      traffic: 'low',
      status: 'blocked'
    },
    'e15': {
      id: 'e15',
      source: 'gas_leak',
      target: 'paltan_bazaar',
      weight: 2,
      traffic: 'high'
    },
    'e16': {
      id: 'e16',
      source: 'ec_road',
      target: 'landslide_zone',
      weight: 3,
      traffic: 'medium',
      status: 'blocked'
    },
    'e17': {
      id: 'e17',
      source: 'landslide_zone',
      target: 'forest_fire',
      weight: 4,
      traffic: 'low',
      status: 'blocked'
    },
    'e18': {
      id: 'e18',
      source: 'rajpur_road',
      target: 'forest_fire',
      weight: 3,
      traffic: 'medium'
    },
    'e19': {
      id: 'e19',
      source: 'power_station',
      target: 'prince_chowk',
      weight: 2,
      traffic: 'low'
    },
    'e20': {
      id: 'e20',
      source: 'race_course',
      target: 'gandhi_park',
      weight: 3,
      traffic: 'low'
    },
    'e21': {
      id: 'e21',
      source: 'race_course',
      target: 'flood_risk',
      weight: 2,
      traffic: 'medium'
    },
    // New edges connecting to central shelter and new nodes
    'e22': {
      id: 'e22',
      source: 'central_shelter',
      target: 'paltan_bazaar',
      weight: 2,
      traffic: 'medium'
    },
    'e23': {
      id: 'e23',
      source: 'central_shelter',
      target: 'gandhi_park',
      weight: 1,
      traffic: 'low'
    },
    'e24': {
      id: 'e24',
      source: 'central_shelter',
      target: 'ec_road',
      weight: 2,
      traffic: 'medium'
    },
    'e25': {
      id: 'e25',
      source: 'market_complex',
      target: 'central_shelter',
      weight: 2,
      traffic: 'high'
    },
    'e26': {
      id: 'e26',
      source: 'school_zone',
      target: 'race_course',
      weight: 3,
      traffic: 'medium'
    },
    'e27': {
      id: 'e27',
      source: 'temple_complex',
      target: 'central_shelter',
      weight: 1,
      traffic: 'low'
    },
    'e28': {
      id: 'e28',
      source: 'residential_block',
      target: 'market_complex',
      weight: 2,
      traffic: 'high'
    },
    'e29': {
      id: 'e29',
      source: 'sports_complex',
      target: 'doon_hospital',
      weight: 2,
      traffic: 'low'
    },
    'e30': {
      id: 'e30',
      source: 'sports_complex',
      target: 'central_shelter',
      weight: 2,
      traffic: 'low'
    }
  }
};

// Traffic status colors
export const trafficColors = {
  low: '#34D399', // green
  medium: '#FBBF24', // yellow
  high: '#EF4444', // red
  blocked: '#1F2937' // dark gray
};

// Initial hazards (can be updated by users)
export const initialHazards = new Set<string>([
  'chemical_factory',
  'gas_leak',
  'forest_fire'
]);