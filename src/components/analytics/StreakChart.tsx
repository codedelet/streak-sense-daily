
import React from 'react';
import { HabitWithStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StreakChartProps {
  habits: HabitWithStats[];
}

export const StreakChart: React.FC<StreakChartProps> = ({ habits }) => {
  // Prepare data for chart - sort by current streak
  const data = habits
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .map(habit => ({
      name: habit.name.length > 15 ? `${habit.name.substring(0, 15)}...` : habit.name,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      fullName: habit.name, // For tooltip
    }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const habit = payload[0].payload;
      return (
        <div className="bg-card p-2 border rounded shadow-sm">
          <p className="font-semibold">{habit.fullName}</p>
          <p className="text-sm">{`Current Streak: ${habit.currentStreak} days`}</p>
          <p className="text-sm">{`Longest Streak: ${habit.longestStreak} days`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-muted-foreground">
          Add habits to see your streaks
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 30 }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            tick={{ fontSize: 12 }}
            height={60}
            stroke="var(--foreground)"
          />
          <YAxis stroke="var(--foreground)" />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="currentStreak" 
            name="Current Streak" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
