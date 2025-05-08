
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HabitList } from '@/components/habits/HabitList';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { QuoteBox } from '@/components/ui/QuoteBox';
import { HabitDetail } from '@/components/habits/HabitDetail';
import { HabitWithStats } from '@/types';
import { useHabits } from '@/contexts/HabitContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { usePreferences } from '@/contexts/PreferencesContext';

const DashboardPage: React.FC = () => {
  const { habits } = useHabits();
  const { preferences, updatePreferences } = usePreferences();
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 px-4">
        {preferences.showMotivationalQuote && (
          <div className="mb-6">
            <QuoteBox />
          </div>
        )}
        
        <Tabs 
          defaultValue="habits" 
          onValueChange={(value) => updatePreferences({ timeRange: value as any })}>
          <TabsList className="mb-6">
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="habits" className="space-y-6">
            <HabitList />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
      
      {selectedHabit && (
        <HabitDetail 
          habit={selectedHabit} 
          onClose={() => setSelectedHabit(null)} 
        />
      )}
    </div>
  );
};

export default DashboardPage;
