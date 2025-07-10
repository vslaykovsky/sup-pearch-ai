import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  CloseButton,
  PricingSection,
  PricingTitle,
  PackageCard,
  PackageForm,
  FormField,
  FormLabel,
  FormInput,
  SaveButton,
  PackageHeader,
  PackageTitle,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  ApiEndpointsSection,
  ApiEndpointsTitle,
  ApiEndpointsDescription,
  RadioGroup,
  RadioContainer,
  RadioInput,
  RadioLabel,
  RadioDescription
} from '../ui/StyledComponents';
import { modalVariants } from '../ui/AnimationVariants';
import { SettingsModalProps, PackagesConfig, PackageConfig } from '../../types';

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) => {
  const [packageSettings, setPackageSettings] = useState<PackagesConfig>(settings.packages);
  const [hasChanges, setHasChanges] = useState(false);





  const handleApiEndpointGroupChange = (groupKey: keyof typeof settings.apiEndpointGroups, checked: boolean) => {
    onSettingsChange({
      ...settings,
      apiEndpointGroups: {
        ...settings.apiEndpointGroups,
        [groupKey]: checked
      }
    });
  };

  const handleProfileDisplayChange = (mode: 'linkedin_only' | 'contacts' | 'full_profile') => {
    onSettingsChange({
      ...settings,
      profileDisplay: {
        ...settings.profileDisplay,
        mode
      }
    });
  };

  const handlePackageChange = (packageKey: keyof PackagesConfig, field: keyof PackageConfig, value: string | number) => {
    const newPackageSettings = {
      ...packageSettings,
      [packageKey]: {
        ...packageSettings[packageKey],
        [field]: field === 'limit' || field === 'monthlyPrice' || field === 'perCandidatePrice' ? Number(value) : value
      }
    };
    setPackageSettings(newPackageSettings);
    setHasChanges(true);
  };

  const handleSavePackages = () => {
    onSettingsChange({
      ...settings,
      packages: packageSettings
    });
    setHasChanges(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return num.toString();
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
              <ModalTitle>Settings</ModalTitle>
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

            <ApiEndpointsSection>
              <ApiEndpointsTitle>Profile Display Settings</ApiEndpointsTitle>
              <ApiEndpointsDescription>
                Select what parts of profiles to show in search results
              </ApiEndpointsDescription>
              
              <RadioGroup>
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="linkedin_only"
                    name="profileDisplay"
                    value="linkedin_only"
                    checked={settings.profileDisplay.mode === 'linkedin_only'}
                    onChange={() => handleProfileDisplayChange('linkedin_only')}
                  />
                  <RadioLabel htmlFor="linkedin_only">
                    LinkedIn ID Only
                    <RadioDescription>Show only the LinkedIn profile URL</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
                
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="contacts"
                    name="profileDisplay"
                    value="contacts"
                    checked={settings.profileDisplay.mode === 'contacts'}
                    onChange={() => handleProfileDisplayChange('contacts')}
                  />
                  <RadioLabel htmlFor="contacts">
                    Contacts
                    <RadioDescription>Show basic info and contact details (email, phone, LinkedIn)</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
                
                <RadioContainer>
                  <RadioInput
                    type="radio"
                    id="full_profile"
                    name="profileDisplay"
                    value="full_profile"
                    checked={settings.profileDisplay.mode === 'full_profile'}
                    onChange={() => handleProfileDisplayChange('full_profile')}
                  />
                  <RadioLabel htmlFor="full_profile">
                    Full Profile
                    <RadioDescription>Show complete profile including experience, education, skills, publications, and patents</RadioDescription>
                  </RadioLabel>
                </RadioContainer>
              </RadioGroup>
            </ApiEndpointsSection>

            <PricingSection>
              <PricingTitle>Package Pricing Configuration</PricingTitle>
              
              {Object.entries(packageSettings).map(([packageKey, packageData]) => (
                <PackageCard key={packageKey} style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                  <PackageHeader>
                    <PackageTitle>{packageData.name}</PackageTitle>
                  </PackageHeader>
                  
                  <PackageForm>
                    <FormField>
                      <FormLabel>Package Name</FormLabel>
                      <FormInput
                        type="text"
                        value={packageData.name}
                        onChange={(e) => handlePackageChange(packageKey as keyof PackagesConfig, 'name', e.target.value)}
                      />
                    </FormField>
                    
                    <FormField>
                      <FormLabel>Profile Limit</FormLabel>
                      <FormInput
                        type="number"
                        value={packageData.limit}
                        onChange={(e) => handlePackageChange(packageKey as keyof PackagesConfig, 'limit', e.target.value)}
                        placeholder="e.g., 10000"
                      />
                    </FormField>
                    
                    <FormField>
                      <FormLabel>Monthly Price ($)</FormLabel>
                      <FormInput
                        type="number"
                        value={packageData.monthlyPrice}
                        onChange={(e) => handlePackageChange(packageKey as keyof PackagesConfig, 'monthlyPrice', e.target.value)}
                        placeholder="e.g., 99"
                      />
                    </FormField>
                    
                    <FormField>
                      <FormLabel>Per Candidate Price ($)</FormLabel>
                      <FormInput
                        type="number"
                        step="0.001"
                        value={packageData.perCandidatePrice}
                        onChange={(e) => handlePackageChange(packageKey as keyof PackagesConfig, 'perCandidatePrice', e.target.value)}
                        placeholder="e.g., 0.01"
                      />
                    </FormField>
                  </PackageForm>
                  
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <div><strong>Preview:</strong> {packageData.name} - Under {formatNumber(packageData.limit)} profiles</div>
                    <div>${packageData.monthlyPrice}/month - ${packageData.perCandidatePrice} per additional candidate</div>
                  </div>
                </PackageCard>
              ))}
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <SaveButton 
                  onClick={handleSavePackages}
                  disabled={!hasChanges}
                >
                  {hasChanges ? 'Save Package Changes' : 'No Changes'}
                </SaveButton>
              </div>
            </PricingSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal; 