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

const SearchResultsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSearchResultOptionChange = (option: 'linkedinProfileUrl' | 'fullJson' | 'matchingInsights' | 'enrichedCompanyData' | 'enrichedProfile' | 'businessEmails' | 'personalEmails' | 'phoneNumbers', checked: boolean) => {
    const newSettings = {
      ...settings,
      searchResults: {
        ...settings.searchResults,
        [option]: checked
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
                Search Results Settings
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
              <ApiEndpointsTitle>Select Data to Get</ApiEndpointsTitle>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="linkedinProfileUrl"
                  checked={settings.searchResults?.linkedinProfileUrl ?? true}
                  onChange={(e) => handleSearchResultOptionChange('linkedinProfileUrl', e.target.checked)}
                />
                <CheckboxLabel htmlFor="linkedinProfileUrl">
                  🔗 LinkedIn Profile URL
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="fullJson"
                  checked={settings.searchResults?.fullJson ?? false}
                  onChange={(e) => handleSearchResultOptionChange('fullJson', e.target.checked)}
                />
                <CheckboxLabel htmlFor="fullJson">
                  📄 Full JSON
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="matchingInsights"
                  checked={settings.searchResults?.matchingInsights ?? true}
                  onChange={(e) => handleSearchResultOptionChange('matchingInsights', e.target.checked)}
                />
                <CheckboxLabel htmlFor="matchingInsights">
                  💡 Matching Insights
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="enrichedCompanyData"
                  checked={settings.searchResults?.enrichedCompanyData ?? true}
                  onChange={(e) => handleSearchResultOptionChange('enrichedCompanyData', e.target.checked)}
                />
                <CheckboxLabel htmlFor="enrichedCompanyData">
                  🏢 Enriched Company Data
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="enrichedProfile"
                  checked={settings.searchResults?.enrichedProfile ?? true}
                  onChange={(e) => handleSearchResultOptionChange('enrichedProfile', e.target.checked)}
                />
                <CheckboxLabel htmlFor="enrichedProfile">
                  👤 Enriched Profile
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="businessEmails"
                  checked={settings.searchResults?.businessEmails ?? true}
                  onChange={(e) => handleSearchResultOptionChange('businessEmails', e.target.checked)}
                />
                <CheckboxLabel htmlFor="businessEmails">
                  📧 Business Emails
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="personalEmails"
                  checked={settings.searchResults?.personalEmails ?? false}
                  onChange={(e) => handleSearchResultOptionChange('personalEmails', e.target.checked)}
                />
                <CheckboxLabel htmlFor="personalEmails">
                  📧 Personal Emails
                </CheckboxLabel>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="phoneNumbers"
                  checked={settings.searchResults?.phoneNumbers ?? true}
                  onChange={(e) => handleSearchResultOptionChange('phoneNumbers', e.target.checked)}
                />
                <CheckboxLabel htmlFor="phoneNumbers">
                  📱 Phone Numbers
                </CheckboxLabel>
              </CheckboxContainer>
            </ApiEndpointsSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default SearchResultsModal; 