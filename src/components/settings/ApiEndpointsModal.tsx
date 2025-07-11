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
  CheckboxContainer,
  Checkbox,
  CheckboxLabel
} from '../ui/StyledComponents';
import { modalVariants } from '../ui/AnimationVariants';
import { SettingsModalProps } from '../../types';
import { saveSettingsToStorage } from '../../utils/localStorage';

const ApiEndpointsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleApiEndpointGroupChange = (groupKey: keyof typeof settings.apiEndpointGroups, checked: boolean) => {
    const newSettings = {
      ...settings,
      apiEndpointGroups: {
        ...settings.apiEndpointGroups,
        [groupKey]: checked
      }
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
                API Endpoints Settings
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
              <ApiEndpointsTitle>API Endpoint Groups</ApiEndpointsTitle>
              <ApiEndpointsDescription>
                Select which API endpoint groups to display on the API Endpoints slide
              </ApiEndpointsDescription>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="search"
                  checked={settings.apiEndpointGroups.search}
                  onChange={(e) => handleApiEndpointGroupChange('search', e.target.checked)}
                />
                <CheckboxLabel htmlFor="search">
                  🔍 Search APIs (Fast, Pro, Auto)
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="jobRecommendations"
                  checked={settings.apiEndpointGroups.jobRecommendations}
                  onChange={(e) => handleApiEndpointGroupChange('jobRecommendations', e.target.checked)}
                />
                <CheckboxLabel htmlFor="jobRecommendations">
                  💼 Job Recommendations
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="customIndex"
                  checked={settings.apiEndpointGroups.customIndex}
                  onChange={(e) => handleApiEndpointGroupChange('customIndex', e.target.checked)}
                />
                <CheckboxLabel htmlFor="customIndex">
                  🗂️ Custom Index Management
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="profileEnrichment"
                  checked={settings.apiEndpointGroups.profileEnrichment}
                  onChange={(e) => handleApiEndpointGroupChange('profileEnrichment', e.target.checked)}
                />
                <CheckboxLabel htmlFor="profileEnrichment">
                  👤 Profile Enrichment
                </CheckboxLabel>
              </CheckboxContainer>
            </ApiEndpointsSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default ApiEndpointsModal; 