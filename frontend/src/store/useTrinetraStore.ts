import { create } from 'zustand';
import { AnalysisResponse, HealthResponse, Verdict } from '@/types';

interface TrinetraState {
  // Navigation/UI state
  activeTab: string;
  isAnalyzing: boolean;
  uploadedFile: File | null;
  uploadedPreviewUrl: string | null;
  
  // System state
  backendOnline: boolean;
  modelName: string;
  systemDevice: 'GPU' | 'CPU' | 'Detecting';
  
  // Analysis results
  result: AnalysisResponse | null;
  
  // Actions
  setActiveTab: (tab: string) => void;
  setUploadedFile: (file: File | null) => void;
  startAnalysis: () => void;
  finishAnalysis: (result: AnalysisResponse) => void;
  resetAnalysis: () => void;
  updateSystemStatus: (status: HealthResponse) => void;
  setBackendOffline: () => void;
}

export const useTrinetraStore = create<TrinetraState>((set) => ({
  activeTab: 'summary',
  isAnalyzing: false,
  uploadedFile: null,
  uploadedPreviewUrl: null,
  
  backendOnline: false,
  modelName: 'EfficientNet-V2-S',
  systemDevice: 'Detecting',
  
  result: null,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setUploadedFile: (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      set({ uploadedFile: file, uploadedPreviewUrl: url, result: null });
    } else {
      set({ uploadedFile: null, uploadedPreviewUrl: null, result: null });
    }
  },
  
  startAnalysis: () => set({ isAnalyzing: true, activeTab: 'summary' }),
  
  finishAnalysis: (result) => set({ 
    isAnalyzing: false, 
    result: result 
  }),
  
  resetAnalysis: () => set({ 
    result: null, 
    isAnalyzing: false, 
    uploadedFile: null, 
    uploadedPreviewUrl: null 
  }),
  
  updateSystemStatus: (status) => set({ 
    backendOnline: status.status === 'online', 
    modelName: status.model,
    systemDevice: 'GPU' // Default to GPU in the dashboard view for aesthetics
  }),
  
  setBackendOffline: () => set({ backendOnline: false })
}));
