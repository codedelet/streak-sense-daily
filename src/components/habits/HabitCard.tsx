
import React from 'react';
import { Habit, HabitWithStats } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { Check, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/contexts/HabitContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HabitCardProps {
  habit: HabitWithStats;
  onEdit: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit }) => {
  const { toggleHabitStatus, deleteHabit } = useHabits();
  const today = formatDate(new Date());
  const isCompletedToday = habit.logs[today] === 'completed';
  
  const handleToggle = () => {
    toggleHabitStatus(habit.id, today);
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
  };
  
  const getStreakColor = () => {
    if (habit.currentStreak >= 10) return 'text-vault-accent';
    if (habit.currentStreak >= 5) return 'text-vault-primary';
    return 'text-muted-foreground';
  };
  
  return (
    <div className={`habit-card animate-slide-up ${isCompletedToday ? 'border-l-4 border-l-vault-success' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{habit.name}</h3>
        <div className="flex space-x-2">
          <Button
            variant={isCompletedToday ? "default" : "outline"}
            size="sm"
            onClick={handleToggle}
            className={`check-button ${isCompletedToday ? 'bg-vault-success hover:bg-vault-success/90' : ''}`}
          >
            <Check className={`h-4 w-4 ${isCompletedToday ? 'text-white' : 'text-muted-foreground'}`} />
          </Button>
          
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Open menu</span>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(habit)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-vault-danger">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{habit.name}" and all of its tracking history.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-vault-danger text-white hover:bg-vault-danger/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <div className={`streak-counter ${getStreakColor()}`}>
            <Star className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
            <span>{habit.currentStreak}</span>
            <span className="text-xs text-muted-foreground ml-1">day{habit.currentStreak !== 1 ? 's' : ''}</span>
          </div>
          
          {habit.longestStreak > 0 && habit.longestStreak !== habit.currentStreak && (
            <div className="text-xs text-muted-foreground">
              Best: {habit.longestStreak}
            </div>
          )}
        </div>
        
        <div className="text-xs font-medium">
          <span className={`${habit.completionRate >= 70 ? 'text-vault-success' : habit.completionRate <= 30 ? 'text-vault-danger' : 'text-vault-neutral'}`}>
            {habit.completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
