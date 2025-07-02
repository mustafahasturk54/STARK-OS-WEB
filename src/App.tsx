import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import MenuBar from './components/MenuBar';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import Launcher from './components/Launcher';
import ContextMenu from './components/ContextMenu';
import { ApplicationDefinition } from './types';
import LockScreen from './components/LockScreen';

const apps: ApplicationDefinition[] = [
  {
    id: 'file-explorer',
    name: 'Files',
    icon: 'Folder',
    component: () => null,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 500, height: 400 },
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
    id: 'browser',
    name: 'Browser',
    icon: 'Globe',
    component: () => null,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 800, height: 600 },
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

function App() {
  const [runningApps, setRunningApps] = React.useState<string[]>([]);
  const [showLauncher, setShowLauncher] = React.useState(false);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    items: Array<{ label: string; action: () => void; icon?: string }>;
  } | null>(null);
  const [locked, setLocked] = React.useState(true);

  const handleAppOpen = (app: ApplicationDefinition) => {
    if (!runningApps.includes(app.id)) {
      setRunningApps(prev => [...prev, app.id]);
    }
    
    if ((window as any).openDesktopApp) {
      (window as any).openDesktopApp(app.id);
    }
  };

  const handleAppClose = (appId: string) => {
    setRunningApps(prev => prev.filter(id => id !== appId));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        {
          label: 'New Folder',
          icon: 'FolderPlus',
          action: () => {
            // Create new folder logic
            setContextMenu(null);
          }
        },
        {
          label: 'New File',
          icon: 'FilePlus',
          action: () => {
            // Create new file logic
            setContextMenu(null);
          }
        },
        {
          label: 'Paste',
          icon: 'Clipboard',
          action: () => {
            // Paste logic
            setContextMenu(null);
          }
        },
        {
          label: 'Refresh',
          icon: 'RefreshCw',
          action: () => {
            // Refresh logic
            setContextMenu(null);
          }
        },
      ]
    });
  };

  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
        setShowLauncher(false);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden bg-gray-900 relative">
        {locked && (
          <LockScreen onUnlock={() => setLocked(false)} />
        )}
        {!locked && (
          <>
            <MenuBar onLauncherToggle={() => setShowLauncher(!showLauncher)} />
            <Desktop 
              onAppOpen={handleAppOpen} 
              onAppClose={handleAppClose}
              runningApps={runningApps}
              onContextMenu={handleContextMenu}
            />
            <Dock 
              onAppOpen={handleAppOpen} 
              runningApps={runningApps}
              onLauncherOpen={() => setShowLauncher(true)}
            />
            {showLauncher && (
              <Launcher 
                apps={apps}
                onAppOpen={handleAppOpen}
                onClose={() => setShowLauncher(false)}
              />
            )}
            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                items={contextMenu.items}
                onClose={() => setContextMenu(null)}
              />
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;