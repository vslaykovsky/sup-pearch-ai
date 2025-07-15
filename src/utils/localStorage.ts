import { AppSettings } from '../types';

const SETTINGS_STORAGE_KEY = 'scrollytelling-app-settings';

// Default settings that will be used if no settings are found in localStorage
export const defaultSettings: AppSettings = {
  animationsEnabled: true,
  darkMode: false,
  autoPlay: false,
  animationSpeed: 1,
  theme: 'default',
  packages: {
    starter: {
      name: 'Starter',
      limit: 10000,
      monthlyPrice: 99,
      perCandidatePrice: 0.01
    },
    professional: {
      name: 'Professional',
      limit: 100000,
      monthlyPrice: 499,
      perCandidatePrice: 0.005
    },
    enterprise: {
      name: 'Enterprise',
      limit: 1000000,
      monthlyPrice: 1999,
      perCandidatePrice: 0.002
    }
  },
  apiEndpointGroups: {
    search: true,
    jobRecommendations: true,
    customIndex: true,
    profileEnrichment: true
  },
  profileDisplay: {
    mode: 'full_profile'
  },
  queryOptions: {
    naturalLanguage: true,
    filters: true,
    filterMode: {
      mode: 'basic'
    }
  },
  searchSpeed: {
    mode: 'fast'
  },
  searchResults: {
    linkedinProfileUrl: true,
    fullJson: false,
    matchingInsights: true,
    enrichedCompanyData: true,
    enrichedProfile: true,
    businessEmails: true,
    personalEmails: false,
    phoneNumbers: true
  }
};

/**
 * Save settings to localStorage
 */
export const saveSettingsToStorage = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    console.log('💾 Settings saved to localStorage:', settings);
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

/**
 * Load settings from localStorage
 */
export const loadSettingsFromStorage = (): AppSettings => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      // Merge with default settings to ensure all properties exist
      const mergedSettings = {
        ...defaultSettings,
        ...parsedSettings,
              // Ensure nested objects are properly merged
      packages: {
        ...defaultSettings.packages,
        ...parsedSettings.packages
      },
      apiEndpointGroups: {
        ...defaultSettings.apiEndpointGroups,
        ...parsedSettings.apiEndpointGroups
      },
      profileDisplay: {
        ...defaultSettings.profileDisplay,
        ...parsedSettings.profileDisplay
      },
      queryOptions: {
        ...defaultSettings.queryOptions,
        ...parsedSettings.queryOptions
      },
      searchSpeed: {
        ...defaultSettings.searchSpeed,
        ...parsedSettings.searchSpeed
      },
      searchResults: {
        ...defaultSettings.searchResults,
        ...parsedSettings.searchResults
      }
      };
      
      console.log('📋 Settings loaded from localStorage:', mergedSettings);
      return mergedSettings;
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
  }
  
  console.log('📋 Using default settings');
  return defaultSettings;
};

/**
 * Clear settings from localStorage
 */
export const clearSettingsFromStorage = (): void => {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear settings from localStorage:', error);
  }
};

/**
 * Export settings as JSON string
 */
export const exportSettings = (): string => {
  try {
    const settings = loadSettingsFromStorage();
    return JSON.stringify(settings, null, 2);
  } catch (error) {
    console.error('Failed to export settings:', error);
    return '';
  }
};

/**
 * Import settings from JSON string
 */
export const importSettings = (jsonString: string): boolean => {
  try {
    const settings = JSON.parse(jsonString);
    saveSettingsToStorage(settings);
    return true;
  } catch (error) {
    console.error('Failed to import settings:', error);
    return false;
  }
}; 