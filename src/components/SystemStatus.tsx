import React from 'react';
import { SystemStatus } from '../types';

interface StatusDisplayProps {
  status: SystemStatus;
}

export function StatusDisplay({ status }: StatusDisplayProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
      <div className="space-y-6">
        <StatusSection 
          title="Complete" 
          items={status.complete}
          bgColor="bg-green-500/20"
          borderColor="border-green-500/50"
          textColor="text-green-300"
        />
        <StatusSection 
          title="In Progress" 
          items={status.inProgress}
          bgColor="bg-blue-500/20"
          borderColor="border-blue-500/50"
          textColor="text-blue-300"
        />
        <StatusSection 
          title="Problems" 
          items={status.problems}
          bgColor="bg-red-500/20"
          borderColor="border-red-500/50"
          textColor="text-red-300"
        />
        <StatusSection 
          title="Pending Decisions" 
          items={status.pendingDecisions}
          bgColor="bg-yellow-500/20"
          borderColor="border-yellow-500/50"
          textColor="text-yellow-300"
        />
      </div>
    </div>
  );
}

interface StatusSectionProps {
  title: string;
  items: string[];
  bgColor: string;
  borderColor: string;
  textColor: string;
}

function StatusSection({ title, items, bgColor, borderColor, textColor }: StatusSectionProps) {
  if (items.length === 0) return null;
  
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li 
            key={index} 
            className={`px-3 py-2 rounded-lg ${bgColor} ${textColor} border ${borderColor} text-sm`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}