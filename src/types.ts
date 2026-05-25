export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isAudio?: boolean; // Whether sent/received via speech
}

export interface ViabilityAspect {
  score: number;
  analysis: string;
}

export interface ViabilityDetails {
  marketFit: ViabilityAspect;
  executionContext: ViabilityAspect;
  scalability: ViabilityAspect;
}

export interface RoadmapPhase {
  phaseName: string;
  timeline: string;
  description: string;
  tasks: string[];
}

export interface BusinessIssue {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  description: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  targetDate: string;
}

export interface BusinessReport {
  businessName: string;
  category: string;
  summary: string;
  overallScore: number;
  viabilityDetails: ViabilityDetails;
  roadmap: RoadmapPhase[];
  issues: BusinessIssue[];
  milestones: Milestone[];
}
