
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, HabitLog, HabitStatus, HabitWithStats } from '@/types';
import { useAuth } from './AuthContext';
import { format, isToday, parseISO, subDays, addDays } from 'date-fns';
import { toast } from "sonner";

interface HabitContextProps {
  habits: HabitWithStats[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'userId'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitStatus: (habitId: string, date: string, status?: HabitStatus) => void;
  getHabitStatus: (habitId: string, date: string) => HabitStatus;
  loading: boolean;
}

const HabitContext = createContext<HabitContextProps | undefined>(undefined);

// Helper function to calculate streak
const calculateStreak = (logs: HabitLog, startDate: string): { current: number, longest: number } => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const sortedDates = Object.keys(logs).sort();
  
  if (sortedDates.length === 0) return { current: 0, longest: 0 };
  
  let currentStreak = 0;
  let longestStreak = 0;
  let currentDate = today;
  
  // Calculate current streak
  while (true) {
    const status = logs[currentDate];
    
    if (status === 'completed') {
      currentStreak++;
      currentDate = format(subDays(parseISO(currentDate), 1), 'yyyy-MM-dd');
      
      // Don't count streaks before start date
      if (currentDate < startDate) break;
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  let tempStreak = 0;
  for (const date of sortedDates) {
    if (logs[date] === 'completed') {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  return { current: currentStreak, longest: longestStreak };
};

// Helper function to calculate completion rate
const calculateCompletionRate = (logs: HabitLog): number => {
  const totalEntries = Object.keys(logs).length;
  if (totalEntries === 0) return 0;
  
  const completedEntries = Object.values(logs).filter(
    status => status === 'completed'
  ).length;
  
  return Math.round((completedEntries / totalEntries) * 100);
};

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Load habits from localStorage when user changes
  useEffect(() => {
    if (user) {
      const loadHabits = () => {
        try {
          const savedHabits = localStorage.getItem(`habitvault_habits_${user.id}`);
          if (savedHabits) {
            const parsedHabits: Habit[] = JSON.parse(savedHabits);
            
            // Load habit logs
            const habitsWithStats = parsedHabits.map(habit => {
              const savedLogs = localStorage.getItem(`habitvault_logs_${habit.id}`);
              const logs: HabitLog = savedLogs ? JSON.parse(savedLogs) : {};
              
              const { current, longest } = calculateStreak(logs, habit.startDate);
              const completionRate = calculateCompletionRate(logs);
              
              return {
                ...habit,
                logs,
                currentStreak: current,
                longestStreak: longest,
                completionRate,
              };
            });
            
            setHabits(habitsWithStats);
          }
        } catch (error) {
          console.error('Failed to load habits', error);
          toast.error('Failed to load habits');
        }
        setLoading(false);
      };
      
      loadHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user]);
  
  // Save habits whenever they change
  useEffect(() => {
    if (user && !loading) {
      const habitsToSave = habits.map(({ logs, currentStreak, longestStreak, completionRate, ...habit }) => habit);
      localStorage.setItem(`habitvault_habits_${user.id}`, JSON.stringify(habitsToSave));
      
      // Save logs separately
      habits.forEach(habit => {
        localStorage.setItem(`habitvault_logs_${habit.id}`, JSON.stringify(habit.logs));
      });
    }
  }, [habits, user, loading]);
  
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    const newHabit: Habit = {
      ...habitData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      userId: user.id,
    };
    
    const habitWithStats: HabitWithStats = {
      ...newHabit,
      logs: {},
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
    };
    
    setHabits(prev => [...prev, habitWithStats]);
    toast.success('Habit created successfully');
  };
  
  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id === id) {
          const updatedHabit = { ...habit, ...updates };
          return {
            ...updatedHabit,
            logs: habit.logs, // Preserve logs
            currentStreak: calculateStreak(habit.logs, updatedHabit.startDate).current,
            longestStreak: calculateStreak(habit.logs, updatedHabit.startDate).longest,
            completionRate: calculateCompletionRate(habit.logs),
          };
        }
        return habit;
      })
    );
    toast.success('Habit updated successfully');
  };
  
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    localStorage.removeItem(`habitvault_logs_${id}`);
    toast.success('Habit deleted successfully');
  };
  
  const toggleHabitStatus = (habitId: string, date: string, statusOverride?: HabitStatus) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id === habitId) {
          const currentStatus = habit.logs[date];
          
          // Determine new status based on toggle or override
          let newStatus: HabitStatus;
          if (statusOverride !== undefined) {
            newStatus = statusOverride;
          } else if (currentStatus === 'completed') {
            newStatus = null; // reset if already completed
          } else {
            newStatus = 'completed';
          }
          
          // Create updated logs
          const updatedLogs = {
            ...habit.logs,
            [date]: newStatus,
          };
          
          // If status is null, remove the entry
          if (newStatus === null) {
            delete updatedLogs[date];
          }
          
          const { current, longest } = calculateStreak(updatedLogs, habit.startDate);
          const completionRate = calculateCompletionRate(updatedLogs);
          
          return {
            ...habit,
            logs: updatedLogs,
            currentStreak: current,
            longestStreak: longest,
            completionRate,
          };
        }
        return habit;
      })
    );
  };
  
  const getHabitStatus = (habitId: string, date: string): HabitStatus => {
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.logs[date] || null : null;
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitStatus,
        getHabitStatus,
        loading,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
