import React, { useState, useCallback } from 'react';
import { AgentCard } from './components/AgentCard';
import { MessageLog } from './components/MessageLog';
import { StatusDisplay } from './components/SystemStatus';
import { Agent, Message, SystemStatus } from './types';

const initialAgents: Agent[] = [
  {
    name: 'Claude 3.5 Sonnet',
    role: 'manager',
    model: 'anthropic/claude-3-sonnet',
    status: 'active',
  },
  {
    name: 'Llama 70B',
    role: 'worker',
    model: 'llama2-70b-4bit',
    status: 'active',
  },
];

const initialMessages: Message[] = [
  {
    from: 'Claude 3.5 Sonnet',
    to: 'Llama 70B',
    type: 'command',
    priority: 1,
    requiresResponse: true,
    content: 'Initialize system and verify hardware configuration.',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    from: 'Llama 70B',
    to: 'Claude 3.5 Sonnet',
    type: 'response',
    priority: 1,
    requiresResponse: false,
    content: 'Hardware verification complete. NVIDIA RTX 4090 detected with 24GB VRAM. Running in 4-bit quantization mode.',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    from: 'Claude 3.5 Sonnet',
    to: 'System',
    type: 'status',
    priority: 2,
    requiresResponse: false,
    content: 'System initialization in progress. Setting up RAG components.',
    contextNeeded: ['vector_store', 'embeddings'],
    timestamp: new Date(Date.now() - 180000),
  },
];

const initialStatus: SystemStatus = {
  complete: [
    'Hardware verification',
    'Model loading',
    'Basic system setup'
  ],
  inProgress: [
    'RAG system initialization',
    'Vector database setup',
    'Communication protocol testing'
  ],
  problems: [],
  pendingDecisions: [
    'Embedding model selection',
    'Vector store configuration',
    'Context window optimization'
  ],
};

function App() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(initialStatus);
  const [newTaskInput, setNewTaskInput] = useState('');

  const handleAgentStatusChange = (agentName: string, newStatus: Agent['status']) => {
    setAgents(agents.map(agent =>
      agent.name === agentName ? { ...agent, status: newStatus } : agent
    ));

    // Add status change message
    const newMessage: Message = {
      from: 'System',
      to: agentName,
      type: 'status',
      priority: 3,
      requiresResponse: false,
      content: `Agent status changed to ${newStatus}`,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    // Update system status
    if (newStatus === 'error') {
      setSystemStatus(prev => ({
        ...prev,
        problems: [...prev.problems, `${agentName} encountered an error`]
      }));
    }
  };

  const addNewTask = useCallback(() => {
    if (!newTaskInput.trim()) return;

    // Add new task to messages
    const newMessage: Message = {
      from: 'User',
      to: 'Claude 3.5 Sonnet',
      type: 'command',
      priority: 2,
      requiresResponse: true,
      content: newTaskInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);

    // Add to system status
    setSystemStatus(prev => ({
      ...prev,
      inProgress: [...prev.inProgress, newTaskInput]
    }));

    // Clear input
    setNewTaskInput('');

    // Simulate response after 1 second
    setTimeout(() => {
      const response: Message = {
        from: 'Claude 3.5 Sonnet',
        to: 'User',
        type: 'response',
        priority: 2,
        requiresResponse: false,
        content: `Task received: "${newTaskInput}". Processing request...`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  }, [newTaskInput]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">AI Development Platform</h1>
          <div className="px-4 py-2 bg-green-500 text-white rounded-full text-sm">
            System Online
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map(agent => (
            <AgentCard
              key={agent.name}
              agent={agent}
              onStatusChange={(status) => handleAgentStatusChange(agent.name, status)}
            />
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/10">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
              placeholder="Enter a new task..."
              className="flex-1 bg-black/20 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addNewTask}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Send Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Communication Log</h2>
              <span className="text-sm text-gray-300">{messages.length} messages</span>
            </div>
            <MessageLog messages={messages} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">System Status</h2>
            <StatusDisplay status={systemStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;