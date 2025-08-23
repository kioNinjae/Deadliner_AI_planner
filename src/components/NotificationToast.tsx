import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      textColor: 'text-white'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-white'
    },
    info: {
      icon: Info,
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-white'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${config.bgColor} ${config.textColor}
          px-6 py-4 rounded-lg shadow-2xl
          flex items-center space-x-3 max-w-md
          transform transition-all duration-300 ease-out
          ${isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
          animate-slideInRight
        `}
      >
        <Icon className="w-5 h-5 animate-pulse-gentle" />
        <p className="font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsAnimating(false);
            setTimeout(onClose, 300);
          }}
          className="text-white hover:text-gray-200 transition-colors duration-200 transform hover:scale-110"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};