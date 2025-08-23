import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Trophy, Coins } from 'lucide-react';
import { TimerSession, Task } from '../types';

interface TaskTimerProps {
  selectedTask?: Task;
  onSessionComplete: (session: TimerSession) => void;
  onPointsEarned: (points: number) => void;
}

export const TaskTimer: React.FC<TaskTimerProps> = ({ 
  selectedTask, 
  onSessionComplete, 
  onPointsEarned 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePoints = (durationInSeconds: number) => {
    const hours = durationInSeconds / 3600;
    return Math.floor(hours * 10); // 10 points per hour
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    setSessionStartTime(new Date().toISOString());
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleEnd = () => {
    if (seconds > 0 && sessionStartTime) {
      const pointsEarned = calculatePoints(seconds);
      const session: TimerSession = {
        id: Date.now().toString(),
        taskId: selectedTask?.id,
        taskTitle: selectedTask?.title || 'Study Session',
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        duration: seconds,
        pointsEarned,
        completed: true
      };

      onSessionComplete(session);
      onPointsEarned(pointsEarned);
    }

    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setSessionStartTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
    setSessionStartTime(null);
  };

  const currentPoints = calculatePoints(seconds);
  const progress = (seconds % 3600) / 3600 * 100; // Progress towards next hour

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInUp hover:shadow-lg transition-all duration-300">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg floating">
            <Trophy className="w-6 h-6 text-white animate-pulse-gentle" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">Study Timer</h3>
            <p className="text-sm text-gray-500">Earn points while you study!</p>
          </div>
        </div>

        {selectedTask && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 animate-slideInRight">
            <p className="text-sm text-blue-800 font-medium">Currently studying:</p>
            <p className="text-blue-900 font-semibold">{selectedTask.title}</p>
          </div>
        )}

        {/* Timer Display */}
        <div className="relative mb-6">
          <div className="w-48 h-48 mx-auto relative">
            {/* Circular Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${progress * 2.83} 283`}
                className={`transition-all duration-1000 ease-out ${
                  isRunning && !isPaused ? 'text-green-500' : 'text-blue-500'
                }`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-3xl font-bold transition-all duration-300 ${
                isRunning && !isPaused ? 'text-green-600 animate-pulse-gentle' : 'text-gray-900'
              }`}>
                {formatTime(seconds)}
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Coins className="w-4 h-4 mr-1 text-yellow-500 animate-pulse-gentle" />
                <span className="font-medium text-yellow-600">{currentPoints} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-3 mb-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Start
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={handlePause}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                >
                  <Pause className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Resume
                </button>
              )}
              
              <button
                onClick={handleEnd}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
              >
                <Square className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                End & Save
              </button>
            </>
          )}
          
          {(isRunning || seconds > 0) && (
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 group"
            >
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}
        </div>

        {/* Progress to Next Reward */}
        {seconds > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 animate-fadeInUp">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">Progress to next hour</span>
              <span className="text-sm text-yellow-600">{Math.floor(progress)}%</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              {Math.ceil((3600 - (seconds % 3600)) / 60)} minutes until +10 points!
            </p>
          </div>
        )}

        {/* Status Messages */}
        {isPaused && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg animate-bounce-gentle">
            <p className="text-yellow-800 text-sm font-medium flex items-center justify-center">
              ⏸️ Timer paused - Resume when ready!
            </p>
          </div>
        )}

        {isRunning && !isPaused && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-pulse-gentle">
            <p className="text-green-800 text-sm font-medium flex items-center justify-center">
              🔥 Great job! Keep studying to earn more points!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};