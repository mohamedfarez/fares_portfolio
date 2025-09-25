'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Type, 
  Contrast, 
  Keyboard,
  MousePointer,
  Settings
} from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceEnabled: boolean;
  fontSize: number; // 14-24px
  lineHeight: number; // 1.4-2.0
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  voiceEnabled: false,
  fontSize: 16,
  lineHeight: 1.6,
};

export const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply settings to document
    applyAccessibilitySettings(settings);
  }, [settings]);

  const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduce motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Font size
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}px`);
    
    // Line height
    root.style.setProperty('--accessibility-line-height', settings.lineHeight.toString());
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility settings"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Accessibility Settings</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close accessibility settings"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Visual Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Visual
                    </h3>
                    
                    <div className="space-y-4">
                      {/* High Contrast */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">High Contrast</label>
                        <button
                          onClick={() => updateSetting('highContrast', !settings.highContrast)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          role="switch"
                          aria-checked={settings.highContrast}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Large Text */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Large Text</label>
                        <button
                          onClick={() => updateSetting('largeText', !settings.largeText)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.largeText ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          role="switch"
                          aria-checked={settings.largeText}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.largeText ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Font Size: {settings.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="14"
                          max="24"
                          value={settings.fontSize}
                          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>

                      {/* Line Height */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Line Height: {settings.lineHeight}
                        </label>
                        <input
                          type="range"
                          min="1.4"
                          max="2.0"
                          step="0.1"
                          value={settings.lineHeight}
                          onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Motion Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <MousePointer className="w-5 h-5 mr-2" />
                      Motion
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Reduce Motion</label>
                      <button
                        onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.reduceMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={settings.reduceMotion}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Audio Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Volume2 className="w-5 h-5 mr-2" />
                      Audio
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Voice Enabled</label>
                      <button
                        onClick={() => updateSetting('voiceEnabled', !settings.voiceEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.voiceEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={settings.voiceEnabled}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Navigation Settings */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Keyboard className="w-5 h-5 mr-2" />
                      Navigation
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Keyboard Navigation</label>
                      <button
                        onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={settings.keyboardNavigation}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetSettings}
                    className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Hook for accessing accessibility settings
export const useAccessibilitySettings = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const handleStorageChange = () => {
      const newSettings = localStorage.getItem('accessibility-settings');
      if (newSettings) {
        setSettings(JSON.parse(newSettings));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return settings;
};
