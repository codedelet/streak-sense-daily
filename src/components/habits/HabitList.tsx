
import React, { useState } from 'react';
import { Habit } from '@/types';
import { HabitCard } from './HabitCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { HabitForm } from './HabitForm';
import { useHabits } from '@/contexts/HabitContext';

export const HabitList: React.FC = () => {
  const { habits, addHabit, updateHabit } = useHabits();
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  
  const handleOpenForm = () => {
    setEditingHabit(undefined);
    setFormOpen(true);
  };
  
  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormOpen(true);
  };
  
  const handleSubmit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'userId'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Habits</h2>
        <Button onClick={handleOpenForm} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Habit</span>
        </Button>
      </div>
      
      {habits.length === 0 ? (
        <div className="bg-muted/40 text-center rounded-lg p-8 border border-dashed">
          <h3 className="font-semibold mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your first habit to track
          </p>
          <Button onClick={handleOpenForm} variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Habit
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onEdit={handleEditHabit} 
            />
          ))}
        </div>
      )}
      
      <HabitForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingHabit}
      />
    </div>
  );
};
