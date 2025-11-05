export type ConnectorType = 'linkedin' | 'github' | 'upwork' | 'resume';

export type ConnectionStatus = 
  | 'idle' 
  | 'connecting' 
  | 'connected' 
  | 'error' 
  | 'syncing';

export interface Connector {
  id: ConnectorType;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Hex color
  isRequired: boolean;
  status: ConnectionStatus;
  lastSync?: Date;
  dataPoints?: number;
  error?: string;
}

export interface OAuthConfig {
  provider: ConnectorType;
  authUrl: string;
  scopes: string[];
  clientId: string;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  connectors: ConnectorType[];
  isOptional: boolean;
}

export interface WizardState {
  currentStep: number;
  totalSteps: number;
  connectors: Connector[];
  isComplete: boolean;
}

export interface DataConnectionContextType {
  state: WizardState;
  connectProvider: (provider: ConnectorType) => Promise<void>;
  disconnectProvider: (provider: ConnectorType) => void;
  uploadResume: (file: File) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  completeWizard: () => void;
}
