import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, RotateCcw } from 'lucide-react';
import { AppWindow } from '../types';

interface WindowProps {
  window: AppWindow;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export default function Window({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  children,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y,
      });
      onFocus();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height,
    });
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        const newX = Math.max(0, Math.min(globalThis.window.innerWidth - window.size.width, e.clientX - dragStart.x));
        const newY = Math.max(32, Math.min(globalThis.window.innerHeight - window.size.height - 100, e.clientY - dragStart.y));
        onPositionChange({ x: newX, y: newY });
      }
      
      if (isResizing && !window.isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(300, resizeStart.width + deltaX);
        const newHeight = Math.max(200, resizeStart.height + deltaY);
        onSizeChange({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, window, onPositionChange, onSizeChange]);

  if (window.isMinimized) return null;

  const windowStyle = window.isMaximized
    ? {
        left: 0,
        top: 32,
        width: '100vw',
        height: 'calc(100vh - 132px)',
        zIndex: window.zIndex,
      }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`
        fixed bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl 
        border border-white/20 dark:border-gray-700/50
        ${window.isActive ? 'ring-2 ring-blue-500/30' : ''}
        ${isDragging ? 'cursor-move' : ''}
        transition-all duration-200 ease-out
      `}
      style={windowStyle}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between h-10 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-xl px-4 border-b border-gray-200/50 dark:border-gray-700/50 select-none" onMouseDown={handleMouseDown}>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center group"
          >
            <X size={8} className="text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={onMinimize}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors flex items-center justify-center group"
          >
            <Minus size={8} className="text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={onMaximize}
            className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center group"
          >
            {window.isMaximized ? (
              <RotateCcw size={8} className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Square size={6} className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
        
        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate mx-4">
          {window.title}
        </div>
        
        <div className="w-12"></div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden rounded-b-xl" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-3 h-3">
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="absolute bottom-0 right-2 w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="absolute bottom-2 right-0 w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}