import React, { useState } from 'react';
import { Wallet, Trophy, Gift, TrendingUp, Clock, Star, Coins, Award } from 'lucide-react';
import { UserWallet, RewardTier, TimerSession } from '../types';

interface WalletDashboardProps {
  wallet: UserWallet;
  sessions: TimerSession[];
  onRedeemReward: (tier: RewardTier) => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ 
  wallet, 
  sessions, 
  onRedeemReward 
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const rewardTiers: RewardTier[] = [
    { points: 1000, amount: 50, label: 'Starter Reward', color: 'from-green-400 to-green-600' },
    { points: 3000, amount: 150, label: 'Study Champion', color: 'from-blue-400 to-blue-600' },
    { points: 5000, amount: 300, label: 'Academic Star', color: 'from-purple-400 to-purple-600' },
    { points: 10000, amount: 600, label: 'Study Master', color: 'from-yellow-400 to-orange-500' }
  ];

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getNextReward = () => {
    return rewardTiers.find(tier => tier.points > wallet.totalPoints);
  };

  const nextReward = getNextReward();
  const progressToNext = nextReward ? (wallet.totalPoints / nextReward.points) * 100 : 100;

  const recentSessions = sessions
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeInUp hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg floating">
            <Wallet className="w-5 h-5 text-white animate-pulse-gentle" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rewards Wallet</h3>
            <p className="text-sm text-gray-500">Track your study achievements</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline"
        >
          {showHistory ? 'Hide' : 'Show'} History
        </button>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2 animate-bounce-gentle" />
          <p className="text-2xl font-bold text-yellow-700">{wallet.totalPoints}</p>
          <p className="text-xs text-yellow-600">Total Points</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2 animate-pulse-gentle" />
          <p className="text-2xl font-bold text-green-700">₹{wallet.totalEarnings}</p>
          <p className="text-xs text-green-600">Total Earned</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2 floating" />
          <p className="text-2xl font-bold text-blue-700">{formatDuration(wallet.totalStudyTime)}</p>
          <p className="text-xs text-blue-600">Study Time</p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <Star className="w-8 h-8 text-purple-600 mx-auto mb-2 animate-pulse-gentle" />
          <p className="text-2xl font-bold text-purple-700">{wallet.sessionsCompleted}</p>
          <p className="text-xs text-purple-600">Sessions</p>
        </div>
      </div>

      {/* Progress to Next Reward */}
      {nextReward && (
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 animate-slideInRight">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-800">Next Reward: {nextReward.label}</span>
            <span className="text-sm text-indigo-600">₹{nextReward.amount}</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-3 overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-indigo-700">
            {nextReward.points - wallet.totalPoints} points to go!
          </p>
        </div>
      )}

      {/* Reward Tiers */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
          <Gift className="w-4 h-4 mr-2 text-pink-500 animate-bounce-gentle" />
          Available Rewards
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rewardTiers.map((tier, index) => {
            const canRedeem = wallet.totalPoints >= tier.points;
            const isCompleted = wallet.rewardsRedeemed.some(r => r.points === tier.points);
            
            return (
              <div
                key={tier.points}
                className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                  isCompleted 
                    ? 'border-green-300 bg-green-50 opacity-75'
                    : canRedeem 
                    ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 hover:shadow-lg animate-pulse-gentle'
                    : 'border-gray-200 bg-gray-50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Award className={`w-5 h-5 ${
                      isCompleted ? 'text-green-600' : canRedeem ? 'text-yellow-600' : 'text-gray-400'
                    } transition-colors duration-300`} />
                    <span className={`font-medium ${
                      isCompleted ? 'text-green-800' : canRedeem ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {tier.label}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${
                    isCompleted ? 'text-green-700' : canRedeem ? 'text-yellow-700' : 'text-gray-500'
                  }`}>
                    ₹{tier.amount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{tier.points} points</span>
                  {isCompleted ? (
                    <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full">
                      ✅ Redeemed
                    </span>
                  ) : canRedeem ? (
                    <button
                      onClick={() => onRedeemReward(tier)}
                      className="text-xs px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                    >
                      Redeem
                    </button>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study History */}
      {showHistory && (
        <div className="border-t border-gray-200 pt-6 animate-slideInRight">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500 animate-pulse-gentle" />
            Recent Study Sessions
          </h4>
          
          {recentSessions.length === 0 ? (
            <div className="text-center py-6 animate-fadeInUp">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 floating" />
              <p className="text-gray-500 text-sm">No study sessions yet</p>
              <p className="text-xs text-gray-400">Start your first timer to begin earning points!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 transition-all duration-300 transform hover:scale-[1.02] group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                      {session.taskTitle}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                      {new Date(session.endTime!).toLocaleDateString()} • {formatDuration(session.duration)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center text-sm font-medium text-yellow-600 group-hover:text-yellow-700 transition-colors duration-300">
                      <Coins className="w-4 h-4 mr-1 animate-pulse-gentle" />
                      +{session.pointsEarned}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};