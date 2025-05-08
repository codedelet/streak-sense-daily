
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, getDay, isToday, isSameMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import { formatDate } from '@/utils/dateUtils';

interface HabitCalendarProps {
  habitId: string;
}

export const HabitCalendar: React.FC<HabitCalendarProps> = ({ habitId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { habits, toggleHabitStatus } = useHabits();
  
  const habit = habits.find(h => h.id === habitId);
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  if (!habit) return null;
  
  // Generate calendar days
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayOfWeek = getDay(firstDayOfMonth); // 0 = Sunday
  
  // Generate array of days
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayOffset = i - startingDayOfWeek;
    const day = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1 + dayOffset
    );
    
    const dateString = formatDate(day);
    const isCurrentMonth = isSameMonth(day, currentMonth);
    const status = habit.logs[dateString];
    
    return { day, dateString, isCurrentMonth, status };
  });
  
  const handleDayClick = (dateString: string) => {
    toggleHabitStatus(habitId, dateString);
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs text-center font-medium py-1">
            {day}
          </div>
        ))}
        
        {calendarDays.map(({ day, dateString, isCurrentMonth, status }, index) => {
          const isToday = new Date().toDateString() === day.toDateString();
          
          let cellClass = "aspect-square flex items-center justify-center text-xs rounded cursor-pointer ";
          
          if (!isCurrentMonth) {
            cellClass += "text-muted-foreground opacity-30 ";
          } else if (status === 'completed') {
            cellClass += "bg-vault-success/20 text-vault-success ";
          } else if (status === 'missed') {
            cellClass += "bg-vault-danger/20 text-vault-danger ";
          } else if (isToday) {
            cellClass += "bg-muted ";
          } else {
            cellClass += "hover:bg-muted ";
          }
          
          return (
            <button
              key={index}
              className={cellClass}
              onClick={() => isCurrentMonth && handleDayClick(dateString)}
              disabled={!isCurrentMonth}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
