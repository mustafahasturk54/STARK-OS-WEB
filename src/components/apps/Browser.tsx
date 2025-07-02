import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Lock, Star, Plus, X, Search, Globe, Shield, Bookmark } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export default function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'STARK OS Browser',
      url: 'stark://home',
      isActive: true,
    }
  ]);

  const [currentUrl, setCurrentUrl] = useState('stark://home');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [bookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'Google', url: 'https://google.com', favicon: '🔍' },
    { id: '2', title: 'GitHub', url: 'https://github.com', favicon: '🐙' },
    { id: '3', title: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: '📚' },
    { id: '4', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', favicon: '📖' },
  ]);

  const activeTab = tabs.find(tab => tab.isActive);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let urlToLoad = currentUrl;
    if (!urlToLoad.startsWith('http://') && !urlToLoad.startsWith('https://') && !urlToLoad.startsWith('stark://')) {
      urlToLoad = `https://${urlToLoad}`;
    }
    
    setIframeError(false);
    setIsLoading(true);

    if (activeTab) {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTab.id 
          ? { ...tab, url: urlToLoad, title: getPageTitle(urlToLoad) }
          : tab
      ));
      setCurrentUrl(urlToLoad);
    }
  };

  const getPageTitle = (url: string) => {
    if (url === 'stark://home') return 'STARK OS Browser';
    if (url.includes('google.com')) return 'Google';
    if (url.includes('github.com')) return 'GitHub';
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  };

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'stark://home',
      isActive: true,
    };
    
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: false })).concat(newTab));
    setCurrentUrl('stark://home');
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== tabId);
      if (filtered.length === 0) {
        return [{
          id: Date.now().toString(),
          title: 'New Tab',
          url: 'stark://home',
          isActive: true,
        }];
      }
      
      const closedTab = prev.find(tab => tab.id === tabId);
      if (closedTab?.isActive && filtered.length > 0) {
        filtered[0].isActive = true;
        setCurrentUrl(filtered[0].url);
      }
      
      return filtered;
    });
  };

  const switchTab = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
    
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setCurrentUrl(tab.url);
    }
  };

  const renderContent = () => {
    let content;

    if (currentUrl.startsWith('stark://')) {
      content = (
        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome to STARK Browser</h1>
            <p className="text-gray-600 dark:text-gray-400">Fast, secure, and modern web browsing experience</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                onClick={() => {
                  setCurrentUrl(bookmark.url);
                  const form = document.querySelector('form');
                  if (form) handleUrlSubmit(new Event('submit', { cancelable: true }) as any);
                }}
              >
                <div className="text-2xl mb-2">{bookmark.favicon}</div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{bookmark.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{bookmark.url}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-blue-600 dark:text-blue-400" size={24} />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Privacy & Security</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              STARK Browser protects your privacy with advanced security features and built-in ad blocking.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enhanced Protection</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚫</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ad Blocking</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure Browsing</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (iframeError) {
      content = (
        <div className="flex items-center justify-center h-full text-center p-8">
          <div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Failed to load page</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The website at <strong className="font-semibold">{currentUrl}</strong> may be down or it might have blocked requests.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (Some websites use <code>X-Frame-Options</code> to prevent being embedded).
            </p>
          </div>
        </div>
      );
    } else {
      content = (
        <iframe
          src={currentUrl}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          title={activeTab?.title || 'Browser'}
          onLoad={() => {
            setIsLoading(false);
            setIframeError(false);
          }}
          onError={() => {
            setIsLoading(false);
            setIframeError(true);
          }}
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation"
        />
      );
    }

    return (
      <div className="flex-1 relative bg-white dark:bg-gray-800">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        )}
        {content}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#181e2a]" style={{minHeight:'0', minWidth:'0'}}>
      {/* Tab Bar */}
      <div className="flex items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center space-x-2 px-4 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer min-w-0 max-w-xs
                ${tab.isActive 
                  ? 'bg-gray-50 dark:bg-gray-750 text-gray-800 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
              onClick={() => switchTab(tab.id)}
            >
              <Globe size={14} className="flex-shrink-0" />
              <span className="truncate text-sm">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addNewTab}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <ArrowLeft size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <ArrowRight size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <RotateCcw size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <Home size={16} />
          </button>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Lock size={14} className="text-green-500" />
            </div>
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
              placeholder="Search or enter website URL"
            />
          </div>
        </form>

        <div className="flex items-center space-x-1">
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <Star size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 min-w-0 relative overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}