// Package interface
export interface PackageConfig {
  name: string;
  limit: number;
  monthlyPrice: number;
  perCandidatePrice: number;
}

export interface PackagesConfig {
  starter: PackageConfig;
  professional: PackageConfig;
  enterprise: PackageConfig;
}

// API Endpoint Groups interface
export interface ApiEndpointGroups {
  search: boolean;
  jobRecommendations: boolean;
  customIndex: boolean;
  profileEnrichment: boolean;
}

// Profile Display Settings interface
export interface ProfileDisplaySettings {
  mode: 'linkedin_only' | 'contacts' | 'full_profile';
}

// Query Options interface
export interface QueryOptions {
  naturalLanguage: boolean;
  filters: boolean;
}

// Search Speed interface
export interface SearchSpeed {
  mode: 'super_fast' | 'fast' | 'deep_research' | 'auto_mode' | 'custom';
}

// Search Results interface
export interface SearchResults {
  enrichedProfile: boolean;
  businessEmails: boolean;
  personalEmails: boolean;
  mobilePhones: boolean;
}

// Settings interface
export interface AppSettings {
  animationsEnabled: boolean;
  darkMode: boolean;
  autoPlay: boolean;
  animationSpeed: number;
  theme: string;
  packages: PackagesConfig;
  apiEndpointGroups: ApiEndpointGroups;
  profileDisplay: ProfileDisplaySettings;
  queryOptions: QueryOptions;
  searchSpeed: SearchSpeed;
  searchResults: SearchResults;
}

// Slide interface
export interface Slide {
  id: number;
  title: string;
  description: string;
  type: string;
}

// Slide props interface
export interface SlideProps {
  slide: Slide;
  index: number;
  onSlideChange: (index: number) => void;
  settings?: AppSettings;
  onOpenQuerySetupModal?: () => void;
  onOpenSearchResultsModal?: () => void;
  onOpenCostStructureModal?: () => void;
  onOpenApiEndpointsModal?: () => void;
}

// Settings Modal props interface
export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
} 