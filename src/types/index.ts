export interface Agent {
  name: string;
  role: 'manager' | 'worker';
  model: string;
  status: 'active' | 'idle' | 'error';
}

export interface Message {
  from: string;
  to: string;
  type: 'command' | 'response' | 'error' | 'status';
  priority: 1 | 2 | 3 | 4 | 5;
  requiresResponse: boolean;
  content: string;
  contextNeeded?: string[];
  timestamp: Date;
}

export interface SystemStatus {
  complete: string[];
  inProgress: string[];
  problems: string[];
  pendingDecisions: string[];
}