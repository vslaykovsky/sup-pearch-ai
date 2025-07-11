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
import { SlideProps } from '../../types';

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

  // Available filter options
  const filterOptions = [
    { value: 'Language', label: 'Language' },
    { value: 'Location', label: 'Location' },
    { value: 'Title', label: 'Title' },
    { value: 'Industry', label: 'Industry' },
    { value: 'Degree', label: 'Degree' },
    { value: 'University', label: 'University' },
    { value: 'Company', label: 'Company' }
  ];

  React.useEffect(() => {
    if (inView) {
      onSlideChange(index);
    }
  }, [inView, index, onSlideChange]);

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

  // Function to filter profile data based on display mode
  const getFilteredProfile = (profile: any) => {
    if (!profile) return null;
    
    const displayMode = settings?.profileDisplay?.mode || 'full_profile';
    
    switch (displayMode) {
      case 'linkedin_only':
        return {
          name: profile.name,
          title: profile.title,
          linkedin: profile.linkedin
        };
      case 'contacts':
        return {
          name: profile.name,
          title: profile.title,
          summary: profile.summary,
          location: profile.location,
          email: profile.email,
          phone: profile.phone,
          linkedin: profile.linkedin
        };
      case 'full_profile':
      default:
        return profile;
    }
  };

  // Function to get filtered search results for JSON output
  const getFilteredSearchResults = () => {
    if (!searchResults) return null;
    
    const filteredResults = searchResults.results.map((result: any) => ({
      ...result,
      profile: result.profile ? getFilteredProfile(result.profile) : undefined
    }));
    
    return {
      ...searchResults,
      results: filteredResults
    };
  };

  const generateCurlCommand = () => {
    // Build request body with filters
    const requestBody: any = {
      query: queryText,
      limit: 1,
      type: 'fast',
      with_contacts: true
    };

    // Add filters if any exist
    const filters = buildFiltersForRequest();
    if (Object.keys(filters).length > 0) {
      requestBody.filters = filters;
    }

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
    const requestBody: any = {
      query: queryText,
      limit: 1,
      type: 'fast',
      with_contacts: true
    };

    // Add filters if any exist
    const filters = buildFiltersForRequest();
    if (Object.keys(filters).length > 0) {
      requestBody.filters = filters;
    }

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

  // Transform API response to match our expected format
  const transformApiResponse = (apiData: any[]) => {
    // Handle empty or null data gracefully
    if (!apiData || apiData.length === 0) {
      return {
        query: queryText,
        total_results: 0,
        results: []
      };
    }
    
    return {
      query: queryText,
      total_results: apiData.length,
      results: apiData.map((profile, index) => ({
        id: profile.docid || `profile_${index}`,
        title: `${profile.first_name} ${profile.last_name} - ${profile.title}`,
        content: profile.title || 'Professional profile',
        score: 0.95, // API doesn't provide score, using default
        metadata: {
          author: `${profile.first_name} ${profile.last_name}`,
          date: new Date().toISOString().split('T')[0],
          type: "professional_profile"
        },
        profile: {
          name: `${profile.first_name} ${profile.last_name}`,
          title: profile.title,
          summary: profile.title,
          location: profile.location,
          email: profile.emails?.[0] || '',
          phone: '',
          linkedin: profile.linkedin_slug ? `linkedin.com/in/${profile.linkedin_slug}` : '',
          work_experience: profile.experiences?.map((exp: any) => ({
            company: exp.company_info?.name || 'Unknown Company',
            position: exp.company_roles?.[0]?.title || 'Unknown Position',
            duration: `${exp.company_roles?.[0]?.duration_years || 0} years`,
            description: exp.company_roles?.[0]?.experience_summary || ''
          })) || [],
          education: profile.educations?.map((edu: any) => ({
            institution: edu.campus || 'Unknown Institution',
            degree: 'Education',
            duration: `${edu.start_date} - ${edu.end_date}`,
            focus: 'Education'
          })) || [],
          skills: profile.experiences?.flatMap((exp: any) => 
            exp.company_roles?.[0]?.experience_summary?.split(',').map((skill: string) => skill.trim()) || []
          ).slice(0, 10) || [],
          publications: [],
          patents: []
        }
      }))
    };
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    
    // Build request body with filters
    const requestBody: any = {
      query: queryText,
      limit: 30,
      type: 'fast',
      pick_top1: true,
      with_contacts: true
    };

    // Add filters if any exist
    const filters = buildFiltersForRequest();
    if (Object.keys(filters).length > 0) {
      requestBody.filters = filters;
    }
    
    try {
      const apiUrl = process.env.REACT_APP_PEARCH_API_URL || 'https://api.pearch.ai/v1/search';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_api_key123467'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      const transformedData = transformApiResponse(data);
      setSearchResults(transformedData);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      
      // For demo purposes, show mock data when API fails
      const mockData = [
        {
          docid: 'mock_1',
          first_name: 'John',
          last_name: 'Doe',
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          emails: ['john.doe@example.com'],
          linkedin_slug: 'johndoe',
          experiences: [
            {
              company_info: { name: 'Tech Corp' },
              company_roles: [
                {
                  title: 'Senior Software Engineer',
                  duration_years: 3,
                  experience_summary: 'JavaScript, React, Node.js, Python'
                }
              ]
            }
          ],
          educations: [
            {
              campus: 'Stanford University',
              start_date: '2015',
              end_date: '2019'
            }
          ]
        }
      ];
      
      const transformedData = transformApiResponse(mockData);
      setSearchResults(transformedData);
    } finally {
      setIsSearching(false);
    }
  };

  const renderLeftContent = () => {
    switch (leftTab) {
      case 'text':
        return (
          <>
            <QueryInput
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Enter your search query here..."
            />
            
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
            
            <SearchButton
              onClick={handleSearch}
              disabled={isSearching}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSearching ? 'Searching...' : 'Search'}
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
    if (searchResults.total_results === 0) {
      return (
        <RenderedResult>
          <h3>Search Results for "{queryText}"</h3>
          <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
            <p>No results found for your search query.</p>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        </RenderedResult>
      );
    }

    switch (rightTab) {
      case 'rendered':
        return (
          <RenderedResult>
            <h3>Search Results for "{queryText}"</h3>
            <p>Found {searchResults.total_results} results</p>
            {searchResults.results.map((result: any, idx: number) => {
              const filteredProfile = result.profile ? getFilteredProfile(result.profile) : null;
              
              return (
                <div key={result.id} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{result.title}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9 }}>{result.content.substring(0, 150)}...</p>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    <span>Score: {(result.score * 100).toFixed(1)}%</span>
                    <span style={{ marginLeft: '1rem' }}>By: {result.metadata.author}</span>
                    <span style={{ marginLeft: '1rem' }}>Type: {result.metadata.type}</span>
                  </div>
                  
                  {/* Professional Profile Display */}
                  {filteredProfile && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginRight: '1rem' }}>
                          {filteredProfile.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <h5 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '1.1rem' }}>{filteredProfile.name}</h5>
                          <p style={{ margin: '0 0 0.25rem 0', opacity: 0.9, fontSize: '0.9rem' }}>{filteredProfile.title}</p>
                          {filteredProfile.location && (
                            <p style={{ margin: '0', opacity: 0.7, fontSize: '0.8rem' }}>{filteredProfile.location}</p>
                          )}
                        </div>
                      </div>
                      
                      {filteredProfile.summary && (
                        <p style={{ margin: '0 0 1rem 0', opacity: 0.9, fontSize: '0.9rem', lineHeight: '1.5' }}>{filteredProfile.summary}</p>
                      )}
                      
                      {(filteredProfile.email || filteredProfile.phone || filteredProfile.linkedin) && (
                        <div style={{ marginBottom: '1rem', fontSize: '0.8rem', opacity: 0.8 }}>
                          {filteredProfile.email && <div style={{ marginBottom: '0.5rem' }}>📧 {filteredProfile.email}</div>}
                          {filteredProfile.phone && <div style={{ marginBottom: '0.5rem' }}>📱 {filteredProfile.phone}</div>}
                          {filteredProfile.linkedin && <div style={{ marginBottom: '0.5rem' }}>💼 {filteredProfile.linkedin}</div>}
                        </div>
                      )}
                      
                      {filteredProfile.work_experience && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Work Experience</h6>
                          {filteredProfile.work_experience.map((exp: any, expIdx: number) => (
                            <div key={expIdx} style={{ marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{exp.position} at {exp.company}</div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>{exp.duration}</div>
                              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{exp.description}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {filteredProfile.education && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Education</h6>
                          {filteredProfile.education.map((edu: any, eduIdx: number) => (
                            <div key={eduIdx} style={{ marginBottom: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{edu.degree}</div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{edu.institution} • {edu.duration}</div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{edu.focus}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {filteredProfile.skills && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Skills</h6>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {filteredProfile.skills.map((skill: string, skillIdx: number) => (
                              <span key={skillIdx} style={{ 
                                background: 'rgba(255,255,255,0.1)', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '12px', 
                                fontSize: '0.75rem',
                                border: '1px solid rgba(255,255,255,0.2)'
                              }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {filteredProfile.publications && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Publications</h6>
                          {filteredProfile.publications.map((pub: string, pubIdx: number) => (
                            <div key={pubIdx} style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                              • {pub}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {filteredProfile.patents && (
                        <div>
                          <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Patents</h6>
                          {filteredProfile.patents.map((patent: string, patentIdx: number) => (
                            <div key={patentIdx} style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                              • {patent}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </RenderedResult>
        );
      case 'json':
        const filteredResults = getFilteredSearchResults();
        if (!filteredResults) {
          return (
            <JsonResult>
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
                <p>No search results to display</p>
              </div>
            </JsonResult>
          );
        }
        
        const jsonString = JSON.stringify(filteredResults, null, 2);
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
            <PanelTitle>
              {onOpenQuerySetupModal && (
                <GearIcon
                  onClick={onOpenQuerySetupModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
                  </svg>
                </GearIcon>
              )}
              Query Setup
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
            <PanelTitle>
              {onOpenSearchResultsModal && (
                <GearIcon
                  onClick={onOpenSearchResultsModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
                  </svg>
                </GearIcon>
              )}
              Search Results
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