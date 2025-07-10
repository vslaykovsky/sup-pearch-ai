# Local Storage Settings Documentation

## Overview

The scrollytelling app now automatically saves all modal settings to the browser's localStorage. This ensures that user preferences persist across browser sessions and page refreshes.

## Features

### Automatic Saving
- **API Endpoint Groups**: Checkbox selections for search, job recommendations, custom index, and profile enrichment APIs
- **Profile Display Settings**: Radio button selection for LinkedIn only, contacts, or full profile display
- **Package Pricing Configuration**: All package settings including names, limits, and pricing

### Visual Feedback
- "💾 Saving..." indicator appears in the modal title when settings are being saved
- Settings are saved immediately when changed (no manual save required)
- Console logging for debugging (check browser developer tools)

### Data Persistence
- Settings are automatically loaded when the app starts
- If no saved settings exist, default values are used
- Settings survive browser restarts and page refreshes

## Technical Implementation

### Storage Key
Settings are stored under the key: `scrollytelling-app-settings`

### Data Structure
```typescript
interface AppSettings {
  animationsEnabled: boolean;
  darkMode: boolean;
  autoPlay: boolean;
  animationSpeed: number;
  theme: string;
  packages: PackagesConfig;
  apiEndpointGroups: ApiEndpointGroups;
  profileDisplay: ProfileDisplaySettings;
}
```

### Utility Functions

#### `saveSettingsToStorage(settings: AppSettings)`
Saves the complete settings object to localStorage.

#### `loadSettingsFromStorage(): AppSettings`
Loads settings from localStorage, merging with defaults if needed.

#### `exportSettings(): string`
Exports current settings as a JSON string for backup.

#### `importSettings(jsonString: string): boolean`
Imports settings from a JSON string.

#### `clearSettingsFromStorage(): void`
Clears all saved settings from localStorage.

## Usage Examples

### Check Current Settings
Open browser developer tools (F12) and check the console for settings logs:
```
📋 Settings loaded from localStorage: {...}
💾 Settings saved to localStorage: {...}
```

### Export Settings
```javascript
// In browser console
import { exportSettings } from './utils/localStorage';
const settingsJson = exportSettings();
console.log(settingsJson);
```

### Import Settings
```javascript
// In browser console
import { importSettings } from './utils/localStorage';
const success = importSettings('{"packages": {...}}');
```

### Reset to Defaults
```javascript
// In browser console
import { clearSettingsFromStorage } from './utils/localStorage';
clearSettingsFromStorage();
location.reload(); // Reload page to apply defaults
```

## Integration Points

### App Component
- Loads settings on mount using `useEffect`
- Automatically saves settings when they change via `handleSettingsChange`

### SettingsModal Component
- Saves settings immediately when any checkbox or radio button changes
- Shows saving indicator during localStorage operations
- Auto-saves package changes when modal is closed

### Slide Components
- `CostStructureSlide`: Uses package settings from localStorage
- `ApiEndpointsSlide`: Filters endpoint groups based on localStorage settings

## Error Handling

- Graceful fallback to default settings if localStorage is unavailable
- Console error logging for debugging
- Automatic merging with defaults to ensure data integrity

## Browser Compatibility

- Works in all modern browsers that support localStorage
- Gracefully degrades to default settings in older browsers
- No impact on app functionality if localStorage fails 