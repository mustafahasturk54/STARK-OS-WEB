import { useState, useCallback } from 'react';
import { AppWindow, ApplicationDefinition } from '../types';

export function useWindowManager() {
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = useCallback((app: ApplicationDefinition) => {
    const existingWindow = windows.find(w => w.appId === app.id && !w.isMinimized);
    
    if (existingWindow) {
      // Focus existing window
      focusWindow(existingWindow.id);
      return;
    }

    const newWindow: AppWindow = {
      id: `${app.id}-${Date.now()}`,
      appId: app.id,
      title: app.name,
      isMinimized: false,
      isMaximized: false,
      isActive: true,
      position: { 
        x: 100 + Math.random() * 200, 
        y: 80 + Math.random() * 100 
      },
      size: app.defaultSize,
      zIndex: nextZIndex,
    };

    setWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(newWindow));
    setNextZIndex(prev => prev + 1);
  }, [windows, nextZIndex]);

  const closeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { ...w, isMinimized: true, isActive: false }
        : w
    ));
  }, []);

  const maximizeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { ...w, isMaximized: !w.isMaximized, isActive: true }
        : { ...w, isActive: false }
    ));
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === windowId) {
        return { ...w, isActive: true, isMinimized: false, zIndex: nextZIndex };
      }
      return { ...w, isActive: false };
    }));
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((windowId: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((windowId: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, size } : w
    ));
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  };
}