const fs = require('fs').promises;
const path = require('path');

const files = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Development Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'package.json': `{
  "name": "ai-development-platform",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@types/node": "^20.11.24",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.2",
    "@headlessui/react": "^1.7.18",
    "@heroicons/react": "^2.1.1",
    "clsx": "^2.1.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@typescript-eslint/eslint-plugin": "^7.0.2",
    "@typescript-eslint/parser": "^7.0.2",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.1.4",
    "vitest": "^1.3.1"
  }
}`,

  'src/App.tsx': `import React, { useState, useCallback } from 'react';
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
      content: \`Agent status changed to \${newStatus}\`,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    // Update system status
    if (newStatus === 'error') {
      setSystemStatus(prev => ({
        ...prev,
        problems: [...prev.problems, \`\${agentName} encountered an error\`]
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
        content: \`Task received: "\${newTaskInput}". Processing request...\`,
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

export default App;`,

  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

  'src/types/index.ts': `export interface Agent {
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
}`,

  'src/components/AgentCard.tsx': `import React from 'react';
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
        <span className={\`px-3 py-1 rounded-full text-sm font-medium \${
          agent.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/50' :
          agent.status === 'idle' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
          'bg-red-500/20 text-red-300 border border-red-500/50'
        }\`}>
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
          className={\`w-full px-4 py-2 rounded-md transition-colors \${
            agent.status === 'active'
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }\`}
        >
          {agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
        </button>
      </div>
    </div>
  );
}`,

  'src/components/MessageLog.tsx': `import React from 'react';
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
                <span className={\`px-2 py-0.5 rounded-full text-xs \${
                  message.type === 'command' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' :
                  message.type === 'response' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' :
                  message.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
                  'bg-gray-500/20 text-gray-300 border border-gray-500/50'
                }\`}>
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
}`,

  'src/components/SystemStatus.tsx': `import React from 'react';
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
            className={\`px-3 py-2 rounded-lg \${bgColor} \${textColor} border \${borderColor} text-sm\`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthrough": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
};

async function createFiles() {
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(process.cwd(), filePath);
    
    // Create directories if they don't exist
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Write file content
    await fs.writeFile(fullPath, content);
    console.log(\`Created \${filePath}\`);
  }
}

createFiles().catch(console.error);