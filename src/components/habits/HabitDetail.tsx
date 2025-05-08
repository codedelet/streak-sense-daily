
import React, { useState } from 'react';
import { HabitWithStats } from '@/types';
import { Button } from '@/components/ui/button';
import { HabitForm } from './HabitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HabitCalendar } from './HabitCalendar';
import { HabitHeatmap } from './HabitHeatmap';
import { Calendar, Edit, X } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useHabits } from '@/contexts/HabitContext';

interface HabitDetailProps {
  habit: HabitWithStats;
  onClose: () => void;
}

export const HabitDetail: React.FC<HabitDetailProps> = ({ habit, onClose }) => {
  const [formOpen, setFormOpen] = useState(false);
  const { updateHabit } = useHabits();
  
  const handleSubmit = (habitData: Omit<HabitWithStats, 'id' | 'createdAt' | 'userId' | 'logs' | 'currentStreak' | 'longestStreak' | 'completionRate'>) => {
    updateHabit(habit.id, habitData);
    setFormOpen(false);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{habit.name}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setFormOpen(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardHeader className="py-2">
              <CardTitle className="text-sm">Current Streak</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-3xl font-bold">{habit.currentStreak}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="py-2">
              <CardTitle className="text-sm">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-3xl font-bold">{habit.longestStreak}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="py-2">
              <CardTitle className="text-sm">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-3xl font-bold">{habit.completionRate}%</div>
              <div className="text-xs text-muted-foreground">overall</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="heatmap">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="heatmap">
              <Calendar className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="heatmap" className="mt-4">
            <HabitHeatmap habit={habit} days={60} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <HabitCalendar habitId={habit.id} />
          </TabsContent>
        </Tabs>
        
        <HabitForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={habit}
        />
      </DialogContent>
    </Dialog>
  );
};
