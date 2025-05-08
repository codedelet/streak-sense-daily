
import React from 'react';
import { HabitWithStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompletionRateChartProps {
  habits: HabitWithStats[];
}

export const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ habits }) => {
  // Prepare data for chart - sort by completion rate
  const data = habits
    .filter(habit => Object.keys(habit.logs).length > 0) // Only show habits with data
    .sort((a, b) => b.completionRate - a.completionRate)
    .map(habit => ({
      name: habit.name.length > 15 ? `${habit.name.substring(0, 15)}...` : habit.name,
      completionRate: habit.completionRate,
      fullName: habit.name, // For tooltip
    }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const habit = payload[0].payload;
      return (
        <div className="bg-card p-2 border rounded shadow-sm">
          <p className="font-semibold">{habit.fullName}</p>
          <p className="text-sm">{`Completion Rate: ${habit.completionRate}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-muted-foreground">
          Complete habits to see your completion rates
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
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            tick={{ fontSize: 12 }}
            stroke="var(--foreground)"
            height={60}
          />
          <YAxis domain={[0, 100]} stroke="var(--foreground)" />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="completionRate" 
            name="Completion Rate" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
