import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

// For a simple A/B test, we just assign variants randomly on the client,
// or fetch assigned variants from the backend. For this implementation,
// we will randomly assign and persist in localStorage to maintain consistency.

interface ExperimentContextType {
  getVariant: (experimentId: string) => string;
  trackEvent: (experimentId: string, event: 'VIEW' | 'CLICK' | 'ACTION_COMPLETED', metadata?: any) => void;
}

const ExperimentContext = createContext<ExperimentContextType | null>(null);

export const ExperimentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [variants, setVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('serveStock_experiments');
    if (saved) {
      setVariants(JSON.parse(saved));
    }
  }, []);

  const getVariant = (experimentId: string): string => {
    if (variants[experimentId]) return variants[experimentId];

    // Assign randomly if not set (50/50 split)
    const newVariant = Math.random() > 0.5 ? 'A' : 'B';
    const updatedVariants = { ...variants, [experimentId]: newVariant };
    
    setVariants(updatedVariants);
    localStorage.setItem('serveStock_experiments', JSON.stringify(updatedVariants));
    
    return newVariant;
  };

  const trackEvent = (experimentId: string, event: 'VIEW' | 'CLICK' | 'ACTION_COMPLETED', metadata?: any) => {
    const variant = getVariant(experimentId);
    
    // Fire and forget
    api.post('/experiments/events', {
      experimentId,
      variant,
      event,
      metadata
    }).catch(err => console.error('Failed to track experiment event', err));
  };

  return (
    <ExperimentContext.Provider value={{ getVariant, trackEvent }}>
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiment = (experimentId: string) => {
  const context = useContext(ExperimentContext);
  if (!context) throw new Error('useExperiment must be used within an ExperimentProvider');
  
  const variant = context.getVariant(experimentId);
  const track = (event: 'VIEW' | 'CLICK' | 'ACTION_COMPLETED', metadata?: any) => context.trackEvent(experimentId, event, metadata);

  // Automatically track VIEW on first mount
  useEffect(() => {
    track('VIEW');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { variant, track };
};
