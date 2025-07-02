import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface DesktopFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon: string;
  position: { x: number; y: number };
}

interface DesktopIconProps {
  file: DesktopFile;
  onDoubleClick: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  selected?: boolean;
}

export default function DesktopIcon({ file, onDoubleClick, onPositionChange, selected }: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const IconComponent = Icons[file.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsSelected(true);
    setDragStart({
      x: e.clientX - file.position.x,
      y: e.clientY - file.position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(20, Math.min(window.innerWidth - 100, e.clientX - dragStart.x));
        const newY = Math.max(60, Math.min(window.innerHeight - 150, e.clientY - dragStart.y));
        onPositionChange({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDragging, dragStart, onPositionChange]);

  return (
    <div
      ref={iconRef}
      className={`
        absolute flex flex-col items-center cursor-pointer select-none
        ${isSelected ? 'bg-blue-500/20 rounded-lg' : ''}
        ${isDragging ? 'opacity-75' : ''}
        transition-all duration-200
        ${selected ? 'bg-blue-500/20 border-2 border-blue-500 shadow-lg' : ''}
      `}
      style={{ left: file.position.x, top: file.position.y, width: 64, height: 64, borderRadius: 8, zIndex: selected ? 20 : 10 }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-1 border border-white/30">
        <IconComponent 
          size={24} 
          className={file.type === 'folder' ? 'text-blue-300' : 'text-white'} 
        />
      </div>
      <span className="text-white text-xs text-center max-w-20 truncate bg-black/30 px-2 py-1 rounded">
        {file.name}
      </span>
    </div>
  );
}