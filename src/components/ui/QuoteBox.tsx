
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MotivationalQuote } from '@/types';
import { usePreferences } from '@/contexts/PreferencesContext';
import { X } from 'lucide-react';

export const QuoteBox: React.FC = () => {
  const { dailyQuote, preferences, updatePreferences } = usePreferences();
  
  if (!preferences.showMotivationalQuote) return null;
  
  const handleDismiss = () => {
    updatePreferences({ showMotivationalQuote: false });
  };
  
  return (
    <Card className="bg-vault-dark text-white overflow-hidden">
      <CardContent className="p-5 relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/70 hover:text-white"
          aria-label="Dismiss quote"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex flex-col gap-2">
          <blockquote className="font-medium italic">
            "{dailyQuote.text}"
          </blockquote>
          <cite className="text-sm text-white/70 not-italic text-right">
            — {dailyQuote.author}
          </cite>
        </div>
      </CardContent>
    </Card>
  );
};
