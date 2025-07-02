import React, { useState } from 'react';
import { Folder, FileText, Music, Calculator, Mail, Globe, Bot, Grid3X3 } from 'lucide-react';
import { ApplicationDefinition } from '../types';

interface DockProps {
  onAppOpen: (app: ApplicationDefinition) => void;
  runningApps: string[];
  onLauncherOpen: () => void;
}

const dockApps: ApplicationDefinition[] = [
  {
    id: 'file-explorer',
    name: 'Files',
    icon: 'Folder',
    component: () => null,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: 'Globe',
    component: () => null,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 800, height: 600 },
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: 'FileText',
    component: () => null,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'media-player',
    name: 'Music',
    icon: 'Music',
    component: () => null,
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    component: () => null,
    defaultSize: { width: 320, height: 480 },
    minSize: { width: 300, height: 450 },
  },
  {
    id: 'mail',
    name: 'Mail',
    icon: 'Mail',
    component: () => null,
    defaultSize: { width: 1000, height: 700 },
    minSize: { width: 600, height: 500 },
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: 'Bot',
    component: () => null,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
  },
];

const iconComponents = {
  Folder,
  FileText,
  Music,
  Calculator,
  Mail,
  Globe,
  Bot,
  Grid3X3,
};

export default function Dock({ onAppOpen, runningApps, onLauncherOpen }: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const handleAppClick = (app: ApplicationDefinition) => {
    onAppOpen(app);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/10 dark:bg-black/30 backdrop-blur-2xl rounded-2xl px-3 py-2 border border-white/20 shadow-2xl">
        <div className="flex items-end space-x-1">
          {/* Launcher Button */}
          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredApp('launcher')}
            onMouseLeave={() => setHoveredApp(null)}
            onClick={onLauncherOpen}
          >
            <div
              className={`
                w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:scale-110 hover:shadow-lg
                ${hoveredApp === 'launcher' ? 'transform -translate-y-3 shadow-2xl' : ''}
              `}
            >
              <Grid3X3 size={24} className="text-white" />
            </div>
            
            {hoveredApp === 'launcher' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap">
                Launcher
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-12 bg-white/20 mx-1"></div>

          {/* App Icons */}
          {dockApps.map((app) => {
            const IconComponent = iconComponents[app.icon as keyof typeof iconComponents];
            const isRunning = runningApps.includes(app.id);
            const isHovered = hoveredApp === app.id;
            
            return (
              <div
                key={app.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
                onClick={() => handleAppClick(app)}
              >
                <div
                  className={`
                    w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10
                    dark:from-gray-700/50 dark:to-gray-800/50 backdrop-blur-sm
                    border border-white/30 dark:border-gray-600/50
                    flex items-center justify-center
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:bg-white/30 hover:shadow-lg
                    ${isHovered ? 'transform -translate-y-3 shadow-2xl' : ''}
                    ${isRunning ? 'ring-2 ring-blue-400/60 bg-white/25' : ''}
                  `}
                >
                  <IconComponent 
                    size={26} 
                    className="text-gray-800 dark:text-gray-100" 
                  />
                </div>
                
                {/* Running indicator */}
                {isRunning && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-lg"></div>
                )}
                
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap">
                    {app.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}