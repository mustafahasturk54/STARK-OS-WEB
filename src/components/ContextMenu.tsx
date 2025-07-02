import React from 'react';
import * as Icons from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  items: Array<{
    label: string;
    action: () => void;
    icon?: string;
  }>;
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  return (
    <div
      className="fixed bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 py-2 z-50 min-w-48"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => {
        const IconComponent = item.icon ? Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }> : null;
        
        return (
          <button
            key={index}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-blue-500/20 text-gray-700 dark:text-gray-200 transition-colors"
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            {IconComponent && <IconComponent size={16} />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}