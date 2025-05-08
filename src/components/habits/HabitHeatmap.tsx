
import React from 'react';
import { HabitWithStats } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { format, subDays } from 'date-fns';

interface HabitHeatmapProps {
  habit: HabitWithStats;
  days?: number; // Number of days to show
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ 
  habit,
  days = 30 // Default to 30 days
}) => {
  // Generate dates in reverse order (from today backwards)
  const dates = Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date,
      dateString: formatDate(date),
      dayName: format(date, 'E'), // Short day name (e.g., Mon)
      dayNumber: format(date, 'd'), // Day number (e.g., 15)
    };
  }).reverse();
  
  const getStatusClass = (dateString: string) => {
    const status = habit.logs[dateString];
    
    if (status === 'completed') {
      return 'bg-vault-success';
    } else if (status === 'missed') {
      return 'bg-vault-danger';
    }
    
    return 'bg-muted/30';
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-medium mr-auto">{days} Day History</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-vault-success mr-1"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-vault-danger mr-1"></div>
            <span>Missed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-muted/30 mr-1"></div>
            <span>Untracked</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-1 overflow-x-auto pb-2">
        {dates.map(({ dateString, dayName, dayNumber }) => (
          <div key={dateString} className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground mb-1">{dayName}</div>
            <div 
              className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${getStatusClass(dateString)}`}
              title={dateString}
            >
              {dayNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
