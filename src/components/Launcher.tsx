import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { ApplicationDefinition } from '../types';
import * as Icons from 'lucide-react';

interface LauncherProps {
  apps: ApplicationDefinition[];
  onAppOpen: (app: ApplicationDefinition) => void;
  onClose: () => void;
}

export default function Launcher({ apps, onAppOpen, onClose }: LauncherProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (app: ApplicationDefinition) => {
    onAppOpen(app);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/10 dark:bg-black/30 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-4xl w-full mx-8 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Applications</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-white/15"
          />
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-6 gap-6 overflow-y-auto max-h-96">
          {filteredApps.map((app) => {
            const IconComponent = Icons[app.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
            
            return (
              <div
                key={app.id}
                className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => handleAppClick(app)}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/20">
                  <IconComponent size={32} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium text-center">{app.name}</span>
              </div>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}