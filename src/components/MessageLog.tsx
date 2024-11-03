import React from 'react';
import { Message } from '../types';

interface MessageLogProps {
  messages: Message[];
}

export function MessageLog({ messages }: MessageLogProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-4 max-h-[500px] overflow-y-auto border border-white/10">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="border-b border-gray-700 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-blue-300">{message.from}</span>
                <span className="text-gray-500">→</span>
                <span className="font-medium text-green-300">{message.to}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  message.type === 'command' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' :
                  message.type === 'response' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' :
                  message.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
                  'bg-gray-500/20 text-gray-300 border border-gray-500/50'
                }`}>
                  {message.type}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-300">{message.content}</p>
            {message.contextNeeded && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.contextNeeded.map((context, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
                    {context}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}