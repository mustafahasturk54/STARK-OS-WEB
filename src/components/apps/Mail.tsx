import React, { useState } from 'react';
import { Search, Star, Archive, Trash2, Reply, Forward, MoreHorizontal, Paperclip, Send, Plus } from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
}

const sampleEmails: Email[] = [
  {
    id: '1',
    sender: 'STARK OS Team',
    subject: 'Welcome to STARK OS Mail',
    preview: 'Thank you for using STARK OS Mail. Here are some tips to get started...',
    time: '10:30 AM',
    isRead: false,
    isStarred: true,
    isImportant: true,
  },
  {
    id: '2',
    sender: 'GitHub',
    subject: 'Your weekly digest',
    preview: 'Here\'s what happened in your repositories this week...',
    time: '9:15 AM',
    isRead: true,
    isStarred: false,
    isImportant: false,
  },
  {
    id: '3',
    sender: 'Design Team',
    subject: 'New UI Components Ready',
    preview: 'The new component library is ready for review. Please check the latest designs...',
    time: 'Yesterday',
    isRead: false,
    isStarred: false,
    isImportant: true,
  },
  {
    id: '4',
    sender: 'Newsletter',
    subject: 'Weekly Tech Updates',
    preview: 'Latest trends in technology and development...',
    time: '2 days ago',
    isRead: true,
    isStarred: false,
    isImportant: false,
  },
];

export default function Mail() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(sampleEmails[0]);
  const [emails, setEmails] = useState(sampleEmails);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: '',
  });

  const filteredEmails = emails.filter(email =>
    email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    markAsRead(email.id);
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleSendEmail = () => {
    // Simulate sending email
    console.log('Sending email:', composeData);
    setIsComposing(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  return (
    <div className="h-full flex bg-white dark:bg-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col p-4">
        <button
          onClick={handleCompose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center space-x-2 transition-colors mb-4"
        >
          <Plus size={18} />
          <span>Compose</span>
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-100 text-blue-700 font-semibold">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Inbox</span>
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full ml-auto">
                {emails.filter(e => !e.isRead).length}
              </span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 text-gray-600 cursor-pointer">
              <Star size={16} className="text-gray-400" />
              <span className="text-sm">Starred</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 text-gray-600 cursor-pointer">
              <Archive size={16} className="text-gray-400" />
              <span className="text-sm">Archive</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 text-gray-600 cursor-pointer">
              <Trash2 size={16} className="text-gray-400" />
              <span className="text-sm">Trash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-96 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
        <div className="p-3 border-b border-gray-200 dark:border-slate-700">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`
                p-3 border-b border-gray-200 dark:border-slate-700/50 cursor-pointer transition-colors
                ${selectedEmail?.id === email.id 
                  ? 'bg-blue-50 dark:bg-slate-900/50 border-r-2 border-r-blue-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }
              `}
              onClick={() => handleEmailClick(email)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${!email.isRead ? 'font-bold text-gray-800 dark:text-white' : 'text-gray-600 dark:text-slate-300'} truncate`}>
                      {email.sender}
                    </span>
                    {email.isImportant && !email.isRead && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <h3 className={`text-sm ${!email.isRead ? 'font-semibold text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300'} truncate mt-0.5`}>
                    {email.subject}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-1">
                    {email.preview}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                  <span className="text-xs text-gray-500 dark:text-slate-400">{email.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(email.id);
                    }}
                    className={`p-1 rounded ${email.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500 dark:text-slate-500 dark:hover:text-yellow-500'}`}
                  >
                    <Star size={14} fill={email.isStarred ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col bg-white">
        {isComposing ? (
          <div className="flex-1 flex flex-col bg-white text-black">
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">New Message</h2>
            </div>
            <div className="flex-1 flex flex-col p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                <input
                  type="email"
                  value={composeData.to}
                  onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Email subject"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea
                  value={composeData.body}
                  onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full h-full resize-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Write your message here..."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded">
                    <Paperclip size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsComposing(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Send size={16} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : selectedEmail ? (
          <>
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-gray-800">{selectedEmail.subject}</h2>
                <p className="text-sm text-gray-600">
                  From: <span className="font-medium text-gray-700">{selectedEmail.sender}</span>
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                  <Reply size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                  <Forward size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                  <Trash2 size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
                {selectedEmail.preview.replace('...', '\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <p className="text-lg">Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}