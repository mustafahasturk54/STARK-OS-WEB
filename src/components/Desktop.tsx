import React, { useState } from 'react';
import { useWindowManager } from '../hooks/useWindowManager';
import { ApplicationDefinition } from '../types';
import Window from './Window';
import FileExplorer from './apps/FileExplorer';
import Notes from './apps/Notes';
import MediaPlayer from './apps/MediaPlayer';
import Browser from './apps/Browser';
import Calculator from './apps/Calculator';
import Mail from './apps/Mail';
import AIAssistant from './apps/AIAssistant';
import DesktopIcon from './DesktopIcon';

const apps: ApplicationDefinition[] = [
  {
    id: 'file-explorer',
    name: 'Files',
    icon: 'Folder',
    component: FileExplorer,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: 'FileText',
    component: Notes,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'media-player',
    name: 'Music',
    icon: 'Music',
    component: MediaPlayer,
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: 'Globe',
    component: Browser,
    defaultSize: { width: 1200, height: 800 },
    minSize: { width: 800, height: 600 },
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'Calculator',
    component: Calculator,
    defaultSize: { width: 320, height: 480 },
    minSize: { width: 300, height: 450 },
  },
  {
    id: 'mail',
    name: 'Mail',
    icon: 'Mail',
    component: Mail,
    defaultSize: { width: 1000, height: 700 },
    minSize: { width: 600, height: 500 },
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    icon: 'Bot',
    component: AIAssistant,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
  },
];

interface DesktopProps {
  onAppOpen: (app: ApplicationDefinition) => void;
  onAppClose: (appId: string) => void;
  runningApps: string[];
  onContextMenu: (e: React.MouseEvent) => void;
}

interface DesktopFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon: string;
  position: { x: number; y: number };
}

export default function Desktop({ onAppOpen, onAppClose, runningApps, onContextMenu }: DesktopProps) {
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();

  const [desktopFiles, setDesktopFiles] = useState<DesktopFile[]>([
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      icon: 'Folder',
      position: { x: 50, y: 100 }
    },
    {
      id: 'readme',
      name: 'README.txt',
      type: 'file',
      icon: 'FileText',
      position: { x: 50, y: 200 }
    },
    {
      id: 'ai-assistant',
      name: 'AI Assistant',
      type: 'file',
      icon: 'Bot',
      position: { x: 50, y: 300 }
    }
  ]);

  // Çoklu seçim için state
  const [selectionBox, setSelectionBox] = useState<null | {x1:number, y1:number, x2:number, y2:number}>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectionRef = React.useRef<HTMLDivElement>(null);

  // Mouse eventleri
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    // Sadece ikonların olduğu alanda başlat
    if ((e.target as HTMLElement).closest('.desktop-icon')) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setSelectionBox({ x1: e.clientX - rect.left, y1: e.clientY - rect.top, x2: e.clientX - rect.left, y2: e.clientY - rect.top });
    setSelectedIds([]);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    setSelectionBox(box => box ? { ...box, x2: e.clientX - selectionRef.current!.getBoundingClientRect().left, y2: e.clientY - selectionRef.current!.getBoundingClientRect().top } : null);
  };
  const handleMouseUp = () => {
    setSelectionBox(null);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Seçim kutusu ile çakışan ikonları bul
  React.useEffect(() => {
    if (!selectionBox) return;
    const xMin = Math.min(selectionBox.x1, selectionBox.x2);
    const xMax = Math.max(selectionBox.x1, selectionBox.x2);
    const yMin = Math.min(selectionBox.y1, selectionBox.y2);
    const yMax = Math.max(selectionBox.y1, selectionBox.y2);
    const selected = desktopFiles.filter(file => {
      // İkonun pozisyonu ve boyutu (varsayalım 64x64)
      const { x, y } = file.position;
      const size = 64;
      return (
        x + size > xMin && x < xMax &&
        y + size > yMin && y < yMax
      );
    }).map(f => f.id);
    setSelectedIds(selected);
  }, [selectionBox, desktopFiles]);

  React.useEffect(() => {
    (window as any).openDesktopApp = (appId: string) => {
      const app = apps.find(a => a.id === appId);
      if (app) {
        openWindow(app);
      }
    };
  }, [openWindow]);

  const handleWindowClose = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (window) {
      onAppClose(window.appId);
    }
    closeWindow(windowId);
  };

  const getAppComponent = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app?.component || (() => <div>App not found</div>);
  };

  const handleDesktopIconDoubleClick = (file: DesktopFile) => {
    if (file.id === 'ai-assistant') {
      const aiApp = apps.find(a => a.id === 'ai-assistant');
      if (aiApp) {
        onAppOpen(aiApp);
      }
      return;
    }
    if (file.type === 'folder') {
      const fileExplorerApp = apps.find(a => a.id === 'file-explorer');
      if (fileExplorerApp) {
        onAppOpen(fileExplorerApp);
      }
    } else {
      const notesApp = apps.find(a => a.id === 'notes');
      if (notesApp) {
        onAppOpen(notesApp);
      }
    }
  };

  return (
    <div className="absolute inset-0 pt-8" ref={selectionRef} onMouseDown={handleMouseDown}>
      {/* Desktop Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://wallpapercave.com/wp/azJxcqB.jpg')`,
        }}
        onContextMenu={onContextMenu}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Seçim kutusu */}
      {selectionBox && (
        <div
          className="absolute border-2 border-blue-400 bg-blue-400/20 rounded-md pointer-events-none"
          style={{
            left: Math.min(selectionBox.x1, selectionBox.x2),
            top: Math.min(selectionBox.y1, selectionBox.y2),
            width: Math.abs(selectionBox.x2 - selectionBox.x1),
            height: Math.abs(selectionBox.y2 - selectionBox.y1),
            zIndex: 30
          }}
        />
      )}

      {/* Desktop Icons */}
      {desktopFiles.map((file) => (
        <DesktopIcon
          key={file.id}
          file={file}
          onDoubleClick={() => handleDesktopIconDoubleClick(file)}
          onPositionChange={(position) => {
            setDesktopFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, position } : f
            ));
          }}
          selected={selectedIds.includes(file.id)}
        />
      ))}

      {/* Windows */}
      {windows.map((window) => {
        const AppComponent = getAppComponent(window.appId);
        return (
          <Window
            key={window.id}
            window={window}
            onClose={() => handleWindowClose(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onMaximize={() => maximizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            onPositionChange={(position) => updateWindowPosition(window.id, position)}
            onSizeChange={(size) => updateWindowSize(window.id, size)}
          >
            <AppComponent windowId={window.id} />
          </Window>
        );
      })}
    </div>
  );
}