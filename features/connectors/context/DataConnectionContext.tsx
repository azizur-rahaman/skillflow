'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  DataConnectionContextType,
  WizardState,
  Connector,
  ConnectorType,
  WizardStep,
} from '../types/connector.types';

const DataConnectionContext = createContext<DataConnectionContextType | undefined>(undefined);

interface DataConnectionProviderProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: 'Connect Professional Profiles',
    description: 'Link your LinkedIn and GitHub to extract skills automatically',
    connectors: ['linkedin', 'github'],
    isOptional: false,
  },
  {
    id: 2,
    title: 'Upload Resume',
    description: 'Upload your resume for AI-powered skill extraction',
    connectors: ['resume'],
    isOptional: true,
  },
  {
    id: 3,
    title: 'Additional Sources (Optional)',
    description: 'Connect freelance platforms for comprehensive skill analysis',
    connectors: ['upwork'],
    isOptional: true,
  },
];

const initialConnectors: Connector[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Import your professional experience, skills, and endorsements',
    icon: 'Linkedin',
    color: '#0A66C2',
    isRequired: true,
    status: 'idle',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Analyze your repositories, contributions, and coding skills',
    icon: 'Github',
    color: '#4F46E5',
    isRequired: true,
    status: 'idle',
  },
  {
    id: 'resume',
    name: 'Resume',
    description: 'Upload PDF or DOCX for comprehensive skill extraction',
    icon: 'FileText',
    color: '#A855F7',
    isRequired: false,
    status: 'idle',
  },
  {
    id: 'upwork',
    name: 'Upwork',
    description: 'Import freelance projects and client reviews',
    icon: 'Briefcase',
    color: '#22D3EE',
    isRequired: false,
    status: 'idle',
  },
];

export function DataConnectionProvider({ children, onComplete }: DataConnectionProviderProps) {
  const [state, setState] = useState<WizardState>({
    currentStep: 0,
    totalSteps: wizardSteps.length,
    connectors: initialConnectors,
    isComplete: false,
  });

  const connectProvider = useCallback(async (provider: ConnectorType) => {
    setState((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.id === provider ? { ...c, status: 'connecting' } : c
      ),
    }));

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setState((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.id === provider
          ? {
              ...c,
              status: 'connected',
              lastSync: new Date(),
              dataPoints: Math.floor(Math.random() * 100) + 50,
            }
          : c
      ),
    }));
  }, []);

  const disconnectProvider = useCallback((provider: ConnectorType) => {
    setState((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.id === provider ? { ...c, status: 'idle', lastSync: undefined, dataPoints: undefined } : c
      ),
    }));
  }, []);

  const uploadResume = useCallback(async (file: File) => {
    setState((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.id === 'resume' ? { ...c, status: 'connecting' } : c
      ),
    }));

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setState((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.id === 'resume'
          ? {
              ...c,
              status: 'connected',
              lastSync: new Date(),
              dataPoints: Math.floor(Math.random() * 50) + 20,
            }
          : c
      ),
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep < prev.totalSteps - 1) {
        return { ...prev, currentStep: prev.currentStep + 1 };
      }
      return prev;
    });
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const completeWizard = useCallback(() => {
    setState((prev) => ({ ...prev, isComplete: true }));
    onComplete?.();
  }, [onComplete]);

  const value: DataConnectionContextType = {
    state,
    connectProvider,
    disconnectProvider,
    uploadResume,
    nextStep,
    previousStep,
    skipStep,
    completeWizard,
  };

  return (
    <DataConnectionContext.Provider value={value}>
      {children}
    </DataConnectionContext.Provider>
  );
}

export function useDataConnection() {
  const context = useContext(DataConnectionContext);
  if (!context) {
    throw new Error('useDataConnection must be used within DataConnectionProvider');
  }
  return context;
}

export { wizardSteps };
