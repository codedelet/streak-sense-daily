
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isToday,
  isSameDay,
  parseISO,
  getDay
} from 'date-fns';

// Get array of dates for a week
export const getWeekDays = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start, end });
};

// Get array of dates for a month
export const getMonthDays = (date: Date = new Date()) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  return eachDayOfInterval({ start, end });
};

// Format date to string
export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd') => {
  return format(date, formatStr);
};

// Check if date should be included based on habit target
export const shouldIncludeDate = (
  date: Date,
  target: string,
  customDays?: number[]
) => {
  const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, ...
  
  switch (target) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return customDays ? customDays.includes(dayOfWeek) : false;
    default:
      return false;
  }
};

// Navigation utilities
export const nextWeek = (date: Date) => addWeeks(date, 1);
export const prevWeek = (date: Date) => subWeeks(date, 1);
export const nextMonth = (date: Date) => addMonths(date, 1);
export const prevMonth = (date: Date) => subMonths(date, 1);

// Day name formatter
export const getDayName = (date: Date, options: 'short' | 'long' = 'short') => {
  return format(date, options === 'short' ? 'E' : 'EEEE');
};

// Month name formatter
export const getMonthName = (date: Date, options: 'short' | 'long' = 'long') => {
  return format(date, options === 'short' ? 'MMM' : 'MMMM');
};

// Check if date is today
export const isDateToday = (date: Date | string) => {
  if (typeof date === 'string') {
    return isToday(parseISO(date));
  }
  return isToday(date);
};

// Check if two dates are the same day
export const isSameDate = (date1: Date | string, date2: Date | string) => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};
