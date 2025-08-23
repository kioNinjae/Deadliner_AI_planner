import React from 'react';
import { Wifi, WifiOff, Database } from 'lucide-react';

interface ConnectionStatusProps {
  useBackend: boolean;
  onToggleBackend: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  useBackend, 
  onToggleBackend 
}) => {
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <button
        onClick={onToggleBackend}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg
          transition-all duration-300 transform hover:scale-105
          ${useBackend 
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
          }
        `}
        title={useBackend ? 'Using Backend Database' : 'Using Local Storage'}
      >
        {useBackend ? (
          <>
            <Database className="w-4 h-4 animate-pulse-gentle" />
            <span className="text-sm font-medium">Backend</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 animate-bounce-gentle" />
            <span className="text-sm font-medium">Local</span>
          </>
        )}
      </button>
    </div>
  );
};