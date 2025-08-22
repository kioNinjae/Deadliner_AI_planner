import React, { useState } from 'react';
import { X, User, Clock, BookOpen, Settings } from 'lucide-react';
import { StudyProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudyProfile;
  onUpdateProfile: (profile: StudyProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [formData, setFormData] = useState<StudyProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    onClose();
  };

  const addSubject = () => {
    const newSubject = prompt('Enter a new subject:');
    if (newSubject && !formData.subjects.includes(newSubject)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject]
      }));
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const toggleStudyTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferredStudyTimes: prev.preferredStudyTimes.includes(time)
        ? prev.preferredStudyTimes.filter(t => t !== time)
        : [...prev.preferredStudyTimes, time]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeInUp">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto transform animate-slideInRight">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Settings className="w-5 h-5 text-white animate-pulse-gentle" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300">Study Profile Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3 hover:text-blue-600 transition-colors duration-300">
              <Clock className="w-4 h-4 animate-pulse-gentle" />
              <span>Daily Study Hours</span>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={formData.dailyStudyHours}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyStudyHours: parseFloat(e.target.value) }))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-lg font-semibold text-blue-600 w-16 animate-pulse-gentle">
                {formData.dailyStudyHours}h
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This helps the AI schedule your tasks appropriately
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3 hover:text-blue-600 transition-colors duration-300">
              <User className="w-4 h-4 animate-pulse-gentle" />
              <span>Preferred Study Times</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => toggleStudyTime(time)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-300 transform hover:scale-105 ${
                    formData.preferredStudyTimes.includes(time)
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3 hover:text-blue-600 transition-colors duration-300">
              <BookOpen className="w-4 h-4 animate-pulse-gentle" />
              <span>Subjects</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="ml-2 text-blue-600 hover:text-red-500 transition-all duration-300 transform hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={addSubject}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-105"
            >
              + Add Subject
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Study Style
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  value: 'focused', 
                  label: 'Focused Sessions', 
                  description: 'Longer, concentrated study periods' 
                },
                { 
                  value: 'distributed', 
                  label: 'Distributed Learning', 
                  description: 'Shorter, spaced-out sessions' 
                }
              ].map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, studyStyle: style.value as 'focused' | 'distributed' }))}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                    formData.studyStyle === style.value
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-300">{style.label}</div>
                  <div className="text-sm text-gray-500 mt-1 hover:text-gray-600 transition-colors duration-300">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};