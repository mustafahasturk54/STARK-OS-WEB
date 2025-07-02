import React, { useState } from 'react';
import { Folder, File, ChevronRight, Home, Download, Image, Music } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  icon: React.ElementType;
}

const sampleFiles: FileItem[] = [
  { name: 'Documents', type: 'folder', modified: '2 days ago', icon: Folder },
  { name: 'Downloads', type: 'folder', modified: '1 hour ago', icon: Download },
  { name: 'Pictures', type: 'folder', modified: '3 days ago', icon: Image },
  { name: 'Music', type: 'folder', modified: '1 week ago', icon: Music },
  { name: 'Project Report.pdf', type: 'file', size: '2.4 MB', modified: '2 hours ago', icon: File },
  { name: 'Presentation.pptx', type: 'file', size: '5.1 MB', modified: '1 day ago', icon: File },
  { name: 'Budget.xlsx', type: 'file', size: '156 KB', modified: '3 days ago', icon: File },
  { name: 'Notes.txt', type: 'file', size: '12 KB', modified: '1 hour ago', icon: File },
];

export default function FileExplorer() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPath] = useState('Home');

  const handleItemClick = (name: string, event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      setSelectedItems(prev => 
        prev.includes(name) 
          ? prev.filter(item => item !== name)
          : [...prev, name]
      );
    } else {
      setSelectedItems([name]);
    }
  };

  return (
    <div className="h-full flex bg-white dark:bg-slate-800">
      {/* Sidebar */}
      <div className="w-56 bg-gray-100 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700/50 p-2">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 px-2">FAVORITES</h3>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-slate-200 font-medium">
            <Home size={16} />
            <span className="text-sm">Home</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 cursor-pointer">
            <Download size={16} />
            <span className="text-sm">Downloads</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 cursor-pointer">
            <Image size={16} />
            <span className="text-sm">Pictures</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 cursor-pointer">
            <Music size={16} />
            <span className="text-sm">Music</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 p-3 border-b border-gray-200 dark:border-slate-700/50">
          <Home size={16} className="text-gray-500 dark:text-slate-400" />
          <ChevronRight size={14} className="text-gray-500 dark:text-slate-500" />
          <span className="text-sm font-medium text-gray-800 dark:text-slate-200">{currentPath}</span>
        </div>

        {/* File List Header */}
        <div className="flex items-center p-2 border-b border-gray-200 dark:border-slate-700/50 text-xs font-semibold text-gray-500 dark:text-slate-400">
          <div className="flex-1 pl-10">Name</div>
          <div className="w-32 text-right">Size</div>
          <div className="w-48 text-right pr-4">Date Modified</div>
        </div>

        {/* File List */}
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="grid grid-cols-1">
            {sampleFiles.map((file) => {
              const IconComponent = file.icon;
              const isSelected = selectedItems.includes(file.name);
              
              return (
                <div
                  key={file.name}
                  className={`
                    flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors
                    ${isSelected 
                      ? 'bg-blue-100 dark:bg-slate-700' 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700/50'
                    }
                  `}
                  onClick={(e) => handleItemClick(file.name, e)}
                >
                  <IconComponent 
                    size={20} 
                    className={file.type === 'folder' 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : (isSelected ? 'text-blue-600 dark:text-slate-200' : 'text-gray-500 dark:text-slate-400')
                    } 
                  />
                  <div className={`flex-1 min-w-0 font-medium truncate ${isSelected ? 'text-blue-700 dark:text-slate-100' : 'text-gray-800 dark:text-slate-200'}`}>
                    {file.name}
                  </div>
                  <div className={`w-32 text-sm text-right ${isSelected ? 'text-blue-600 dark:text-slate-200' : 'text-gray-600 dark:text-slate-400'}`}>
                    {file.size}
                  </div>
                  <div className={`w-48 text-sm text-right pr-4 ${isSelected ? 'text-blue-600 dark:text-slate-200' : 'text-gray-600 dark:text-slate-400'}`}>
                    {file.modified}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}