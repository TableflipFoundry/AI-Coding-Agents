import React from 'react';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  onStatusChange: (status: Agent['status']) => void;
}

export function AgentCard({ agent, onStatusChange }: AgentCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          agent.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/50' :
          agent.status === 'idle' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
          'bg-red-500/20 text-red-300 border border-red-500/50'
        }`}>
          {agent.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-300">Role: {agent.role}</p>
        <p className="text-sm text-gray-300">Model: {agent.model}</p>
      </div>
      <div className="mt-4">
        <button
          onClick={() => onStatusChange(agent.status === 'active' ? 'idle' : 'active')}
          className={`w-full px-4 py-2 rounded-md transition-colors ${
            agent.status === 'active'
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
        </button>
      </div>
    </div>
  );
}