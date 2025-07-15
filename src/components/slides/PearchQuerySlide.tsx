import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import {
  SlideContent,
  AnimatedHeader,
  SlideDescription,
  PearchContainer,
  LeftPanel,
  RightPanel,
  PanelTitle,
  TabContainer,
  Tab,
  CodeArea,
  QueryInput,
  SearchButton,
  FilterContainer,
  FilterButton,
  FilterDropdown,
  FilterItem,
  FilterInput,
  FilterValueInput,
  RemoveFilterButton,
  FilterGroupContainer,
  FilterGroupHeader,
  FilterOperatorSelect,
  NotConditionButton,
  ResultContainer,
  RenderedResult,
  JsonResult,
  GearIcon
} from '../ui/StyledComponents';
import { headerVariants, fadeInUp } from '../ui/AnimationVariants';
import { SlideProps, SearchResults } from '../../types';
import { ProfileRenderer } from '../profile';

// Define filter types
interface Filter {
  id: string;
  name: string;
  value: string;
  not: boolean;
}

interface FilterGroup {
  id: string;
  name: string;
  operator: 'and' | 'or';
  filters: Filter[];
  not: boolean;
}

const PearchQuerySlide: React.FC<SlideProps> = ({ 
  slide, 
  index, 
  onSlideChange, 
  settings,
  onOpenQuerySetupModal,
  onOpenSearchResultsModal
}) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  const [queryText, setQueryText] = useState('Seeking a CEO who co-founded a $1B startup');
  const [leftTab, setLeftTab] = useState<'text' | 'curl' | 'python'>('text');
  const [rightTab, setRightTab] = useState<'rendered' | 'json'>('rendered');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Available filter options
  const getFilterOptions = () => {
    return [
      { value: 'Location', label: 'Location' },
      { value: 'Title', label: 'Title' },
      { value: 'Company', label: 'Company' },
      { value: 'Industry', label: 'Industry' },
      { value: 'Language', label: 'Language' },
      { value: 'Degree', label: 'Degree' },
      { value: 'University', label: 'University' },
    ];
  };

  const filterOptions = getFilterOptions();

  // Function to get readable name for search speed mode
  const getSearchSpeedReadableName = (mode: string | undefined) => {
    if (!mode) return 'Unknown';
    switch (mode) {
      case 'super_fast':
        return 'Super Fast';
      case 'fast':
        return 'Fast';
      case 'deep_research':
        return 'Deep Research';
      case 'auto_mode':
        return 'Auto Mode';
      case 'custom':
        return 'Custom';
      default:
        return mode;
    }
  };

  React.useEffect(() => {
    if (inView) {
      onSlideChange(index);
    }
  }, [inView, index, onSlideChange]);

  // Cleanup effect to abort any ongoing requests when component unmounts
  React.useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  // Filter group management functions
  const addFilterGroup = () => {
    const newGroup: FilterGroup = {
      id: Date.now().toString(),
      name: 'Language',
      operator: 'and',
      filters: [{
        id: (Date.now() + 1).toString(),
        name: 'Language',
        value: '',
        not: false
      }],
      not: false
    };
    setFilterGroups([...filterGroups, newGroup]);
  };

  const updateFilterGroup = (groupId: string, field: 'name' | 'operator' | 'not', value: string | boolean) => {
    setFilterGroups(filterGroups.map(group => 
      group.id === groupId ? { ...group, [field]: value } : group
    ));
  };

  const removeFilterGroup = (groupId: string) => {
    setFilterGroups(filterGroups.filter(group => group.id !== groupId));
  };

  const addFilterToGroup = (groupId: string) => {
    setFilterGroups(filterGroups.map(group => {
      if (group.id === groupId) {
        const newFilter: Filter = {
          id: Date.now().toString(),
          name: group.name,
          value: '',
          not: false
        };
        return {
          ...group,
          filters: [...group.filters, newFilter]
        };
      }
      return group;
    }));
  };

  const updateFilterInGroup = (groupId: string, filterId: string, field: 'name' | 'value' | 'not', value: string | boolean) => {
    setFilterGroups(filterGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          filters: group.filters.map(filter => 
            filter.id === filterId ? { ...filter, [field]: value } : filter
          )
        };
      }
      return group;
    }));
  };

  const removeFilterFromGroup = (groupId: string, filterId: string) => {
    setFilterGroups(filterGroups.map(group => {
      if (group.id === groupId) {
        const updatedFilters = group.filters.filter(filter => filter.id !== filterId);
        // If this was the last filter in the group, remove the entire group
        if (updatedFilters.length === 0) {
          return null;
        }
        return {
          ...group,
          filters: updatedFilters
        };
      }
      return group;
    }).filter(Boolean) as FilterGroup[]);
  };

  // Function to build filters object for API request
  const buildFiltersForRequest = () => {
    const filters: Record<string, any> = {};
    
    filterGroups.forEach(group => {
      const validFilters = group.filters.filter(filter => filter.value.trim() !== '');
      if (validFilters.length === 0) return;
      
      const filterKey = group.name.toLowerCase();
      const filterValues = validFilters.map(filter => ({
        value: filter.value,
        not: filter.not
      }));
      
      if (filterValues.length === 1) {
        // Single filter
        if (filterValues[0].not) {
          filters[filterKey] = { not: filterValues[0].value };
        } else {
          filters[filterKey] = filterValues[0].value;
        }
      } else {
        // Multiple filters with operator
        const operatorValues = filterValues.map(fv => 
          fv.not ? { not: fv.value } : fv.value
        );
        
        if (group.not) {
          // Group has NOT condition
          filters[filterKey] = {
            [group.operator]: operatorValues,
            not: true
          };
        } else {
          // Group without NOT condition
          filters[filterKey] = {
            [group.operator]: operatorValues
          };
        }
      }
    });
    
    return filters;
  };

  // Function to filter profile data based on search results settings
  const getFilteredProfile = (profile: any) => {
    if (!profile) return null;
    
    const searchResultsSettings: SearchResults = settings?.searchResults || {};
    
    // Start with basic profile structure
    let filteredProfile: any = {
      linkedin_slug: profile.linkedin_slug,
      first_name: profile.first_name,
      last_name: profile.last_name,
      title: profile.title,
    };
    
    // Add additional fields based on search results settings
    
    // 1. Profile filter: if enabled, add profile fields
    if (searchResultsSettings.profile) {
      filteredProfile = {
        ...filteredProfile,
        experiences: profile.experiences ? profile.experiences.map((exp: any) => {
          const { company_info, ...rest } = exp;
          return rest;
        }) : undefined
      };
    }
    
    // 2. Enriched company data filter: if enabled, add company_info records
    if (searchResultsSettings.enrichedCompanyData && profile.experiences) {
      if (!filteredProfile.experiences) {
        filteredProfile.experiences = profile.experiences;
      } else {
        // Merge company_info back into existing experiences
        filteredProfile.experiences = filteredProfile.experiences.map((exp: any, index: number) => ({
          ...exp,
          company_info: profile.experiences[index]?.company_info
        }));
      }
    }
    
    // 3. Matching insights filter: if enabled, add insighter field
    if (searchResultsSettings.matchingInsights && profile.insighter) {
      filteredProfile.insighter = profile.insighter;
    }
    
    // 4. Handle emails filter
    if (searchResultsSettings.businessEmails || searchResultsSettings.personalEmails) {
      const allEmails = profile.emails || [];
      
      const businessEmails = allEmails.filter((email: string) => {
        const emailLower = email.toLowerCase();
        return emailLower.includes('@') && (
          !emailLower.includes('gmail.com') && 
          !emailLower.includes('yahoo.com') && 
          !emailLower.includes('hotmail.com') && 
          !emailLower.includes('outlook.com') &&
          !emailLower.includes('icloud.com')
        );
      });
      
      const personalEmails = allEmails.filter((email: string) => {
        const emailLower = email.toLowerCase();
        return emailLower.includes('@') && (
          emailLower.includes('gmail.com') || 
          emailLower.includes('yahoo.com') || 
          emailLower.includes('hotmail.com') || 
          emailLower.includes('outlook.com') ||
          emailLower.includes('icloud.com')
        );
      });
      
      const filteredEmails = [];
      if (searchResultsSettings.businessEmails) {
        filteredEmails.push(...businessEmails);
      }
      if (searchResultsSettings.personalEmails) {
        filteredEmails.push(...personalEmails);
      }
      
      if (filteredEmails.length > 0) {
        filteredProfile.emails = filteredEmails;
      }
    }
    
    // 5. Handle phone numbers filter
    if (searchResultsSettings.phoneNumbers && profile.phoneNumbers) {
      filteredProfile.phoneNumbers = profile.phoneNumbers;
    }
    
    return filteredProfile;
  };



  // Function to build request body based on search speed settings
  const buildRequestBody = (limit: number = 30) => {
    const requestBody: any = {
      query: queryText,
      limit: limit,
      with_contacts: true
    };

    // Set type and custom_filters based on search speed mode
    const searchSpeedMode = settings?.searchSpeed?.mode || 'fast';
    
    if (searchSpeedMode === 'super_fast') {
      requestBody.type = 'fast';
      requestBody.custom_filters = [];
      requestBody.profile_scoring = false;
      requestBody.insights = true;
    } else if (searchSpeedMode === 'fast') {
      requestBody.type = 'fast';
      requestBody.profile_scoring = true;
      requestBody.insights = true;
    } else {
      requestBody.type = 'pro';
      requestBody.profile_scoring = true;
      requestBody.insights = true;
    }

    // Add pick_top1 for actual search (not for code generation)
    if (limit > 1) {
      requestBody.pick_top1 = true;
    }

    // Add filters if any exist and filters are enabled
    if (settings?.queryOptions?.filters) {
      const filters = buildFiltersForRequest();
      if (Object.keys(filters).length > 0) {
        requestBody.filters = filters;
      }
    }

    return requestBody;
  };

  const generateCurlCommand = () => {
    // Build request body with filters
    const requestBody = buildRequestBody(1);

    const apiUrl = process.env.REACT_APP_PEARCH_API_URL || 'https://api.pearch.ai/v1/search';
    const curlCode = `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <PEARCH_API_KEY>" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`;

    try {
      return Prism.highlight(curlCode, Prism.languages.bash, 'bash');
    } catch (error) {
      console.error('Syntax highlighting error:', error);
      return curlCode;
    }
  };

  const generatePythonCode = () => {
    // Build request body with filters
    const requestBody = buildRequestBody(1);

    const apiUrl = process.env.REACT_APP_PEARCH_API_URL || 'https://api.pearch.ai/v1/search';
    const pythonCode = `import requests

url = "${apiUrl}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer <PEARCH_API_KEY>"
}
data = ${JSON.stringify(requestBody, null, 4).replace(/"/g, '"')}

response = requests.post(url, json=data, headers=headers)
results = response.json()
print(results)`;

    try {
      return Prism.highlight(pythonCode, Prism.languages.python, 'python');
    } catch (error) {
      console.error('Syntax highlighting error:', error);
      return pythonCode;
    }
  };

  const handleSearch = async () => {
    // If already searching, cancel the search
    if (isSearching && abortController) {
      abortController.abort();
      setIsSearching(false);
      setAbortController(null);
      return;
    }

    // Start new search
    const controller = new AbortController();
    setAbortController(controller);
    setIsSearching(true);
    setError(null);
    
    // Build request body with filters
    const requestBody = buildRequestBody(1);
    
    try {
      const apiUrl = process.env.REACT_APP_PEARCH_API_URL || 'https://api.pearch.ai/v1/search';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_api_key123467'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Search was cancelled');
        setError('Search was cancelled');
      } else {
        console.error('Search error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred during search');
      }
    } finally {
      setIsSearching(false);
      setAbortController(null);
    }
  };

  const renderLeftContent = () => {
    switch (leftTab) {
      case 'text':
        return (
          <>
            {/* Natural Language Query Input - Only show if enabled */}
            {settings?.queryOptions?.naturalLanguage && (
              <QueryInput
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Enter your search query here..."
              />
            )}
            
            {/* Filters - Only show if enabled */}
            {settings?.queryOptions?.filters && (
              <FilterContainer>
                <FilterButton
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showFilters ? 'Hide Filters' : 'Add Filters'}
                </FilterButton>
                
                {showFilters && (
                  <FilterDropdown>
                    {filterGroups.map((group) => (
                      <FilterGroupContainer key={group.id}>
                        {/* Group Header */}
                        <FilterGroupHeader>
                          <FilterInput
                            value={group.name}
                            onChange={(e) => updateFilterGroup(group.id, 'name', e.target.value)}
                            style={{ flex: 1 }}
                          >
                            {filterOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </FilterInput>
                          
                          {group.filters.length > 1 && (
                            <FilterOperatorSelect
                              value={group.operator}
                              onChange={(e) => updateFilterGroup(group.id, 'operator', e.target.value as 'and' | 'or')}
                            >
                              <option value="and">AND</option>
                              <option value="or">OR</option>
                            </FilterOperatorSelect>
                          )}
                          
                          <NotConditionButton
                            active={group.not}
                            onClick={() => updateFilterGroup(group.id, 'not', !group.not)}
                            title={group.not ? 'Remove NOT condition' : 'Add NOT condition'}
                          >
                            NOT
                          </NotConditionButton>
                          
                          <RemoveFilterButton onClick={() => removeFilterGroup(group.id)}>
                            ✕
                          </RemoveFilterButton>
                        </FilterGroupHeader>
                        
                        {/* Group Filters */}
                        {group.filters.map((filter) => (
                          <FilterItem key={filter.id} style={{ marginBottom: '0.5rem' }}>
                            <FilterValueInput
                              value={filter.value}
                              onChange={(e) => updateFilterInGroup(group.id, filter.id, 'value', e.target.value)}
                              placeholder="Enter filter value..."
                              style={{ flex: 1 }}
                            />
                            
                            <NotConditionButton
                              active={filter.not}
                              onClick={() => updateFilterInGroup(group.id, filter.id, 'not', !filter.not)}
                              title={filter.not ? 'Remove NOT condition' : 'Add NOT condition'}
                            >
                              NOT
                            </NotConditionButton>
                            
                            <RemoveFilterButton onClick={() => removeFilterFromGroup(group.id, filter.id)}>
                              ✕
                            </RemoveFilterButton>
                          </FilterItem>
                        ))}
                        
                        {/* Add Filter to Group */}
                        <FilterButton
                          onClick={() => addFilterToGroup(group.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ 
                            marginTop: '0.5rem', 
                            fontSize: '0.8rem', 
                            padding: '0.4rem 0.8rem',
                            background: 'rgba(255,255,255,0.1)'
                          }}
                        >
                          + Add Filter to Group
                        </FilterButton>
                      </FilterGroupContainer>
                    ))}
                    
                    <FilterButton
                      onClick={addFilterGroup}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      + Add Filter Group
                    </FilterButton>
                  </FilterDropdown>
                )}
              </FilterContainer>
            )}
            
            {/* Show message if no query options are enabled */}
            {!settings?.queryOptions?.naturalLanguage && !settings?.queryOptions?.filters && (
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px', 
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: 0, opacity: 0.8 }}>
                  ⚙️ Please enable Natural Language Query or Filters in Query Setup settings
                </p>
              </div>
            )}
            
            <SearchButton
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSearching ? 'Cancel' : 'Search'}
            </SearchButton>
          </>
        );
      case 'curl':
        return (
          <CodeArea>
            <pre>
              <code dangerouslySetInnerHTML={{ __html: generateCurlCommand() }} />
            </pre>
          </CodeArea>
        );
      case 'python':
        return (
          <CodeArea>
            <pre>
              <code dangerouslySetInnerHTML={{ __html: generatePythonCode() }} />
            </pre>
          </CodeArea>
        );
      default:
        return null;
    }
  };

  const renderRightContent = () => {
    if (error) {
      return (
        <RenderedResult>
          <div style={{ color: '#ff6b6b', padding: '1rem', background: 'rgba(255,107,107,0.1)', borderRadius: '8px', border: '1px solid rgba(255,107,107,0.3)' }}>
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </RenderedResult>
      );
    }

    console.log('searchResults', searchResults);
    if (!searchResults) {
      return (
        <RenderedResult>
          <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
            <p>Click "Search" to perform a search query</p>
          </div>
        </RenderedResult>
      );
    }

    // Handle empty results
    if (!searchResults.search_results || searchResults.search_results.length === 0) {
      return (
        <RenderedResult>
          <h3>Search Results for "{searchResults.query}"</h3>
          <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
            <p>No results found for your search query.</p>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        </RenderedResult>
      );
    }

    const filteredSearchResults = searchResults.search_results.map((result: any) => (getFilteredProfile(result)));

    
    switch (rightTab) {
      case 'rendered':
        return (
          <RenderedResult>
            {filteredSearchResults.map((result: any, idx: number) => (
              <ProfileRenderer 
                key={result.docid}
                result={result}
                filteredProfile={result}
                settings={settings}
              />
            ))}
          </RenderedResult>
        );
      case 'json':
        if (!searchResults) {
          return (
            <JsonResult>
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
                <p>No search results to display</p>
              </div>
            </JsonResult>
          );
        }
        
        // Create filtered JSON data using the same filtered results
        const jsonData = {
          uuid: searchResults.uuid,
          query: searchResults.query,
          status: searchResults.status,
          total_estimate: searchResults.total_estimate,
          search_results: filteredSearchResults
        };
        
        const jsonString = JSON.stringify(jsonData, null, 2);
        try {
          const highlightedJson = Prism.highlight(jsonString, Prism.languages.json, 'json');
          return (
            <JsonResult>
              <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
            </JsonResult>
          );
        } catch (error) {
          console.error('JSON syntax highlighting error:', error);
          return (
            <JsonResult>
              {jsonString}
            </JsonResult>
          );
        }
      default:
        return null;
    }
  };

  return (
    <SlideContent ref={ref}>
      <AnimatedHeader
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {slide.title}
      </AnimatedHeader>
      <SlideDescription
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
      >
        {slide.description}
      </SlideDescription>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        style={{ width: '100%' }}
      >
        <PearchContainer>
          <LeftPanel>
            <PanelTitle style={{ display: 'flex', alignItems: 'center' }}>
              <span>Query Setup</span>
              {onOpenQuerySetupModal && (
                <GearIcon
                  onClick={onOpenQuerySetupModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
                  </svg>
                </GearIcon>
              )}
            </PanelTitle>
            <TabContainer>
              <Tab 
                active={leftTab === 'text'} 
                onClick={() => setLeftTab('text')}
              >
                Text
              </Tab>
              <Tab 
                active={leftTab === 'curl'} 
                onClick={() => setLeftTab('curl')}
              >
                cURL
              </Tab>
              <Tab 
                active={leftTab === 'python'} 
                onClick={() => setLeftTab('python')}
              >
                Python
              </Tab>
            </TabContainer>          
            {renderLeftContent()}
          </LeftPanel>
          
          <RightPanel>
            <PanelTitle style={{ display: 'flex', alignItems: 'center' }}>
              <span>Search Results</span>
              {onOpenSearchResultsModal && (
                <GearIcon
                  onClick={onOpenSearchResultsModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ marginLeft: '0.5rem' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
                  </svg>
                </GearIcon>
              )}
            </PanelTitle>
            <TabContainer>
              <Tab 
                active={rightTab === 'rendered'} 
                onClick={() => setRightTab('rendered')}
              >
                Rendered
              </Tab>
              <Tab 
                active={rightTab === 'json'} 
                onClick={() => setRightTab('json')}
              >
                JSON
              </Tab>
            </TabContainer>
            {searchResults && (
              <p style={{ 
                margin: '0.5rem 0 1rem 0', 
                textAlign: 'left',
                fontSize: '0.9rem', 
                opacity: 0.8,
                color: '#fff'
              }}>
                Mode: {getSearchSpeedReadableName(settings?.searchSpeed?.mode)}. Found {searchResults.total_estimate} results. Showing {searchResults.search_results?.length || 0} profiles
              </p>
            )}            
            <ResultContainer>
              {renderRightContent()}
            </ResultContainer>
          </RightPanel>
        </PearchContainer>
      </motion.div>
    </SlideContent>
  );
};

export default PearchQuerySlide; 