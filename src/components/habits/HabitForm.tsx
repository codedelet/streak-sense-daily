
import React, { useState, useEffect } from 'react';
import { Habit, HabitTarget } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt' | 'userId'>) => void;
  initialData?: Habit;
}

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export const HabitForm: React.FC<HabitFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState<HabitTarget>('daily');
  const [targetDays, setTargetDays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  
  // Reset form or populate with initial data when dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setTarget(initialData.target);
        setTargetDays(initialData.targetDays || []);
        setStartDate(new Date(initialData.startDate));
      } else {
        // Reset form for new habit
        setName('');
        setTarget('daily');
        setTargetDays([]);
        setStartDate(new Date());
      }
    }
  }, [open, initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const habit = {
      name,
      target,
      targetDays: target === 'custom' ? targetDays : undefined,
      startDate: startDate.toISOString(),
    };
    
    onSubmit(habit);
    onClose();
  };
  
  const handleDayToggle = (day: number) => {
    setTargetDays(current => 
      current.includes(day)
        ? current.filter(d => d !== day)
        : [...current, day]
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Habit' : 'Create New Habit'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Drink 2L of water"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Target Days</Label>
              <Select
                value={target}
                onValueChange={(value) => setTarget(value as HabitTarget)}
              >
                <SelectTrigger id="target">
                  <SelectValue placeholder="Select target days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Every day</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {target === 'custom' && (
              <div className="space-y-2">
                <Label>Select Days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={targetDays.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <Label
                        htmlFor={`day-${day.value}`}
                        className="cursor-pointer"
                      >
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
