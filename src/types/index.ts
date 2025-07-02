export interface AppWindow {
  id: string;
  appId: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface ApplicationDefinition {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<{ windowId: string }>;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

export interface DockItem {
  id: string;
  name: string;
  icon: string;
  isRunning: boolean;
  bouncing: boolean;
}

export type Theme = 'light' | 'dark';