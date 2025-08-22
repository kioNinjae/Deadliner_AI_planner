import React from 'react';
import { Calendar, Target, Download, Settings } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onShowSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onShowSettings }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 animate-fadeInUp">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 floating">
              <Target className="w-6 h-6 text-white animate-pulse-gentle" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300">Deadliner AI</h1>
              <p className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300">Smart Academic Planner</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              <Download className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Export
            </button>
            <button
              onClick={onShowSettings}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
            >
              <Settings className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};