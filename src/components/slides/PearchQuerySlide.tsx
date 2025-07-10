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
  ResultContainer,
  RenderedResult,
  JsonResult
} from '../ui/StyledComponents';
import { headerVariants, fadeInUp } from '../ui/AnimationVariants';
import { SlideProps } from '../../types';

const PearchQuerySlide: React.FC<SlideProps> = ({ slide, index, onSlideChange, settings }) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  const [queryText, setQueryText] = useState('machine learning');
  const [leftTab, setLeftTab] = useState<'text' | 'curl' | 'python'>('text');
  const [rightTab, setRightTab] = useState<'rendered' | 'json'>('rendered');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (inView) {
      onSlideChange(index);
    }
  }, [inView, index, onSlideChange]);

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
    const curlCode = `curl -X POST "https://api.pearch.ai/v1/search" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer test_api_key123467" \\
  -d '{
    "query": "${queryText}",
    "limit": 1,
    "type": "fast",
    "with_contacts": true
  }'`;

    try {
      return Prism.highlight(curlCode, Prism.languages.bash, 'bash');
    } catch (error) {
      console.error('Syntax highlighting error:', error);
      return curlCode;
    }
  };

  const generatePythonCode = () => {
    const pythonCode = `import requests

// url = "https://api.pearch.ai/v1/search"
url = "http://vlads-gpu:8082/v1/search"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer test_api_key123467"
}
data = {
    "query": "${queryText}",
    "limit": 1,
    "type": "fast",
    "with_contacts": True
}

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
    if (!apiData || apiData.length === 0) return null;
    
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
    
    try {
      // const response = await fetch('https://api.pearch.ai/v1/search', {
      const response = await fetch('http://vlads-gpu:8082/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_api_key123467'
        },
        body: JSON.stringify({
          query: queryText,
          limit: 1,
          type: 'fast',
          with_contacts: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const transformedData = transformApiResponse(data);
      setSearchResults(transformedData);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during search');
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
        animate={inView ? "visible" : "hidden"}
        variants={headerVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {slide.title}
      </AnimatedHeader>
      <SlideDescription
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ delay: 0.3 }}
      >
        {slide.description}
      </SlideDescription>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <PearchContainer>
          <LeftPanel>
            <PanelTitle>Query Setup</PanelTitle>
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
            <PanelTitle>Search Results</PanelTitle>
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