
import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserPreferences, MotivationalQuote } from '@/types';
import { useAuth } from './AuthContext';

interface PreferencesContextProps {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  dailyQuote: MotivationalQuote;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
  darkMode: false,
  timeRange: 'week',
  showMotivationalQuote: true,
};

// Some motivational quotes for habit building
const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "Habits are the compound interest of self-improvement.",
    author: "James Clear"
  },
  {
    text: "You'll never change your life until you change something you do daily. The secret of your success is found in your daily routine.",
    author: "John C. Maxwell"
  },
  {
    text: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Rohn"
  },
  {
    text: "First forget inspiration. Habit is more dependable. Habit will sustain you whether you're inspired or not.",
    author: "Octavia Butler"
  },
  {
    text: "The chains of habit are too weak to be felt until they are too strong to be broken.",
    author: "Samuel Johnson"
  },
  {
    text: "Habits are first cobwebs, then cables.",
    author: "Spanish Proverb"
  },
  {
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear"
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    author: "Alan Watts"
  }
];

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [dailyQuote, setDailyQuote] = useState<MotivationalQuote>(MOTIVATIONAL_QUOTES[0]);
  
  // Load preferences from localStorage
  useEffect(() => {
    if (user) {
      const savedPreferences = localStorage.getItem(`habitvault_preferences_${user.id}`);
      
      if (savedPreferences) {
        try {
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...JSON.parse(savedPreferences)
          });
        } catch (error) {
          console.error('Failed to parse preferences', error);
        }
      }
    } else {
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, [user]);
  
  // Set dark mode based on preferences
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);
  
  // Set daily quote based on today's date
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
    
    setDailyQuote(MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);
  
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    
    if (user) {
      localStorage.setItem(`habitvault_preferences_${user.id}`, JSON.stringify(updatedPreferences));
    }
  };
  
  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        dailyQuote,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
