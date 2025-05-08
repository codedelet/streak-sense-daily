
import React, { useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CompletionRateChart } from './CompletionRateChart';
import { StreakChart } from './StreakChart';

export const AnalyticsDashboard: React.FC = () => {
  const { habits } = useHabits();
  
  const stats = useMemo(() => {
    // Total habits
    const totalHabits = habits.length;
    
    // Overall completion rate
    const allStatuses = habits.flatMap(habit => Object.values(habit.logs));
    const completedCount = allStatuses.filter(status => status === 'completed').length;
    const overallCompletionRate = allStatuses.length > 0 
      ? Math.round((completedCount / allStatuses.length) * 100)
      : 0;
    
    // Best performing habit
    let bestHabit = habits.length > 0 ? habits[0] : null;
    let bestCompletionRate = habits.length > 0 ? habits[0].completionRate : 0;
    
    habits.forEach(habit => {
      if (habit.completionRate > bestCompletionRate) {
        bestHabit = habit;
        bestCompletionRate = habit.completionRate;
      }
    });
    
    // Total entries
    const totalEntries = allStatuses.length;
    
    // Total days tracked
    const uniqueDates = new Set(
      habits.flatMap(habit => Object.keys(habit.logs))
    );
    const totalDaysTracked = uniqueDates.size;
    
    // Longest streak across all habits
    const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
    
    // Current active streaks count (habit with at least 1 day streak)
    const activeStreaksCount = habits.filter(h => h.currentStreak >= 1).length;
    
    return {
      totalHabits,
      overallCompletionRate,
      bestHabit,
      bestCompletionRate,
      totalEntries,
      totalDaysTracked,
      longestStreak,
      activeStreaksCount,
    };
  }, [habits]);
  
  if (habits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            Your habit tracking analytics will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Add habits to start seeing analytics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-3xl">
              {stats.overallCompletionRate}%
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Longest Streak</CardDescription>
            <CardTitle className="text-3xl">
              {stats.longestStreak} days
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Habits</CardDescription>
            <CardTitle className="text-3xl">
              {stats.totalHabits}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Streaks</CardDescription>
            <CardTitle className="text-3xl">
              {stats.activeStreaksCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Completion Rates</CardTitle>
            <CardDescription>
              How consistently you complete each habit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionRateChart habits={habits} />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Current Streaks</CardTitle>
            <CardDescription>
              Your ongoing streaks for each habit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StreakChart habits={habits} />
          </CardContent>
        </Card>
      </div>
      
      {stats.bestHabit && (
        <Card>
          <CardHeader>
            <CardTitle>Best Performing Habit</CardTitle>
            <CardDescription>
              Your most consistent habit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{stats.bestHabit.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {stats.bestCompletionRate}% completion rate
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold">Current streak:</div>
                <div className="text-xl">{stats.bestHabit.currentStreak} days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
