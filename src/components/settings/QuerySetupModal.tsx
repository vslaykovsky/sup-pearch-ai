import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  CloseButton,
  ApiEndpointsSection,
  ApiEndpointsTitle,
  ApiEndpointsDescription,
  RadioGroup,
  RadioContainer,
  RadioInput,
  RadioLabel,
  RadioDescription,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  RangeSlider,
  RangeValue
} from '../ui/StyledComponents';
import { modalVariants } from '../ui/AnimationVariants';
import { SettingsModalProps } from '../../types';
import { saveSettingsToStorage } from '../../utils/localStorage';

const QuerySetupModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleQueryOptionChange = (option: 'naturalLanguage' | 'filters', checked: boolean) => {
    const newSettings = {
      ...settings,
      queryOptions: {
        ...settings.queryOptions,
        [option]: checked
      }
    };
    onSettingsChange(newSettings);
    
    // Save to localStorage
    setIsSaving(true);
    saveSettingsToStorage(newSettings);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSearchSpeedChange = (speed: 'super_fast' | 'fast' | 'deep_research' | 'auto_mode' | 'custom') => {
    const newSettings = {
      ...settings,
      searchSpeed: {
        ...settings.searchSpeed,
        mode: speed
      }
    };
    onSettingsChange(newSettings);
    
    // Save to localStorage
    setIsSaving(true);
    saveSettingsToStorage(newSettings);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleResultLimitChange = (limit: number) => {
    const newSettings = {
      ...settings,
      resultLimit: limit
    };
    onSettingsChange(newSettings);
    
    // Save to localStorage
    setIsSaving(true);
    saveSettingsToStorage(newSettings);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                Query Setup Settings
                {isSaving && (
                  <span style={{ 
                    fontSize: '0.8rem', 
                    marginLeft: '10px', 
                    color: '#4CAF50',
                    fontWeight: 'normal'
                  }}>
                    💾 Saving...
                  </span>
                )}
              </ModalTitle>
              <CloseButton onClick={onClose}>×</CloseButton>
            </ModalHeader>

            <ApiEndpointsSection>
              <ApiEndpointsTitle>Search Input Types</ApiEndpointsTitle>
              <ApiEndpointsDescription>
                Configure how queries are processed and filtered
              </ApiEndpointsDescription>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="naturalLanguage"
                  checked={settings.queryOptions?.naturalLanguage ?? true}
                  onChange={(e) => handleQueryOptionChange('naturalLanguage', e.target.checked)}
                />
                <CheckboxLabel htmlFor="naturalLanguage">
                  🔤 Natural Language Query
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="filters"
                  checked={settings.queryOptions?.filters ?? true}
                  onChange={(e) => handleQueryOptionChange('filters', e.target.checked)}
                />
                <CheckboxLabel htmlFor="filters">
                  🔍 Filters
                </CheckboxLabel>
              </CheckboxContainer>
            </ApiEndpointsSection>

            <ApiEndpointsSection style={{ borderTop: '2px solid #f0f0f0' }}>
              <ApiEndpointsTitle>Limit Number of Results</ApiEndpointsTitle>
              <ApiEndpointsDescription>
                Set the maximum number of results returned per search
              </ApiEndpointsDescription>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <RangeSlider
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={settings.resultLimit ?? 100}
                  onChange={(e) => handleResultLimitChange(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    background: 'rgba(102, 126, 234, 0.2)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <RangeValue>{settings.resultLimit ?? 100}</RangeValue>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
                <span>10</span>
                <span>10,000</span>
              </div>
            </ApiEndpointsSection>

            <ApiEndpointsSection style={{ borderTop: '2px solid #f0f0f0' }}>
              <ApiEndpointsTitle>Relevance/Speed Trade-Off</ApiEndpointsTitle>
              <ApiEndpointsDescription>
                Choose the balance between speed and quality for your searches
              </ApiEndpointsDescription>
              
              <CheckboxContainer style={{ marginBottom: '1rem' }}>
                <Checkbox
                  type="checkbox"
                  id="enableInsights"
                  checked={settings.searchSpeed?.enableInsights ?? true}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings,
                      searchSpeed: {
                        ...settings.searchSpeed,
                        enableInsights: e.target.checked
                      }
                    };
                    onSettingsChange(newSettings);
                    
                    // Save to localStorage
                    setIsSaving(true);
                    saveSettingsToStorage(newSettings);
                    setTimeout(() => setIsSaving(false), 1000);
                  }}
                />
                <CheckboxLabel htmlFor="enableInsights">
                  💡 Enable Insights
                </CheckboxLabel>
              </CheckboxContainer>
              
              <RadioGroup>
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="super_fast"
                    name="searchSpeed"
                    value="super_fast"
                    checked={settings.searchSpeed?.mode === 'super_fast'}
                    onChange={() => handleSearchSpeedChange('super_fast')}
                  />
                  <RadioLabel htmlFor="super_fast">
                    Super Fast
                    <RadioDescription>(2–15 sec) - moderate quality.</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
                
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="fast"
                    name="searchSpeed"
                    value="fast"
                    checked={settings.searchSpeed?.mode === 'fast'}
                    onChange={() => handleSearchSpeedChange('fast')}
                  />
                  <RadioLabel htmlFor="fast">
                    Fast
                    <RadioDescription>(30–60 sec) - good quality.</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
                
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="deep_research"
                    name="searchSpeed"
                    value="deep_research"
                    checked={settings.searchSpeed?.mode === 'deep_research'}
                    onChange={() => handleSearchSpeedChange('deep_research')}
                  />
                  <RadioLabel htmlFor="deep_research">
                    Deep research
                    <RadioDescription>(3–10 min) - great quality.</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
                
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="auto_mode"
                    name="searchSpeed"
                    value="auto_mode"
                    checked={settings.searchSpeed?.mode === 'auto_mode'}
                    onChange={() => handleSearchSpeedChange('auto_mode')}
                  />
                  <RadioLabel htmlFor="auto_mode">
                    Auto-mode
                    <RadioDescription>(2 sec to 10 min) - let AI decide.</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
                
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="custom"
                    name="searchSpeed"
                    value="custom"
                    checked={settings.searchSpeed?.mode === 'custom'}
                    onChange={() => handleSearchSpeedChange('custom')}
                  />
                  <RadioLabel htmlFor="custom">
                    Custom
                    <RadioDescription>Built for your unique use case.</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
              </RadioGroup>
            </ApiEndpointsSection>

          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default QuerySetupModal; 