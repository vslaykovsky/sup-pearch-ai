import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SlideContent,
  AnimatedHeader,
  FeatureGrid,
  FeatureCard
} from '../ui/StyledComponents';
import { headerVariants, staggerContainer, fadeInUp } from '../ui/AnimationVariants';
import { SlideProps } from '../../types';
import styled from 'styled-components';

// API Endpoint specific styled components
const ApiContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const EndpointGroup = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const GroupIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const GroupTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const GroupDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.5;
`;

const EndpointsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const EndpointCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const EndpointMethod = styled.span<{ method: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.method) {
      case 'GET': return 'rgba(34, 197, 94, 0.3)';
      case 'POST': return 'rgba(59, 130, 246, 0.3)';
      case 'PUT': return 'rgba(245, 158, 11, 0.3)';
      case 'DELETE': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  }};
  color: ${props => {
    switch (props.method) {
      case 'GET': return '#22c55e';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  border: 1px solid ${props => {
    switch (props.method) {
      case 'GET': return 'rgba(34, 197, 94, 0.5)';
      case 'POST': return 'rgba(59, 130, 246, 0.5)';
      case 'PUT': return 'rgba(245, 158, 11, 0.5)';
      case 'DELETE': return 'rgba(239, 68, 68, 0.5)';
      default: return 'rgba(107, 114, 128, 0.5)';
    }
  }};
`;

const EndpointPath = styled.div`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1rem;
  color: #f1fa8c;
  margin: 0.5rem 0;
  word-break: break-all;
`;

const EndpointDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

const ApiEndpointsSlide: React.FC<SlideProps> = ({ slide, index, onSlideChange, settings }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  React.useEffect(() => {
    if (inView) {
      onSlideChange(index);
    }
  }, [inView, index, onSlideChange]);

  const allEndpointGroups = [
    {
      id: 1,
      title: "Search APIs",
      description: "Powerful semantic search capabilities with different performance tiers",
      icon: "🔍",
      endpoints: [
        {
          method: "POST",
          path: "/v1/search/fast",
          description: "High-speed search with basic semantic matching"
        },
        {
          method: "POST", 
          path: "/v1/search/pro",
          description: "Advanced search with enhanced relevance and filtering"
        },
        {
          method: "POST",
          path: "/v1/search/auto",
          description: "Intelligent auto-complete and suggestions"
        }
      ]
    },
    {
      id: 2,
      title: "Job Recommendations",
      description: "AI-powered job matching and recommendation system",
      icon: "💼",
      endpoints: [
        {
          method: "POST",
          path: "/v1/upsert_jobs",
          description: "Add or update job listings in the recommendation engine"
        },
        {
          method: "POST",
          path: "/v1/find_relevant_jobs",
          description: "Find jobs that match candidate profiles and preferences"
        }
      ]
    },
    {
      id: 3,
      title: "Custom Index Management",
      description: "Create and manage custom search indices for your data",
      icon: "🗂️",
      endpoints: [
        {
          method: "POST",
          path: "/v1/upsert_profiles",
          description: "Add or update candidate profiles in custom indices"
        }
      ]
    },
    {
      id: 4,
      title: "Profile Enrichment",
      description: "Get comprehensive profile information and contact details",
      icon: "👤",
      endpoints: [
        {
          method: "GET",
          path: "/v1/profile",
          description: "Retrieve enriched profile data including contacts, social links, and enhanced information"
        }
      ]
    }
  ];

  // Filter endpoint groups based on settings
  const endpointGroups = settings?.apiEndpointGroups 
    ? allEndpointGroups.filter(group => {
        switch (group.id) {
          case 1: return settings.apiEndpointGroups.search;
          case 2: return settings.apiEndpointGroups.jobRecommendations;
          case 3: return settings.apiEndpointGroups.customIndex;
          case 4: return settings.apiEndpointGroups.profileEnrichment;
          default: return true;
        }
      })
    : allEndpointGroups;

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
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <ApiContainer>
          {endpointGroups.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>No API Groups Selected</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Please enable at least one API endpoint group in the settings to view endpoints.
              </p>
            </motion.div>
          ) : (
            endpointGroups.map((group, groupIndex) => (
            <EndpointGroup
              key={group.id}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
            >
              <GroupHeader>
                <GroupIcon>{group.icon}</GroupIcon>
                <div>
                  <GroupTitle>{group.title}</GroupTitle>
                  <GroupDescription>{group.description}</GroupDescription>
                </div>
              </GroupHeader>
              
              <EndpointsGrid>
                {group.endpoints.map((endpoint, endpointIndex) => (
                  <EndpointCard
                    key={`${group.id}-${endpointIndex}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <EndpointMethod method={endpoint.method}>
                        {endpoint.method}
                      </EndpointMethod>
                    </div>
                    <EndpointPath>{endpoint.path}</EndpointPath>
                    <EndpointDescription>{endpoint.description}</EndpointDescription>
                  </EndpointCard>
                ))}
              </EndpointsGrid>
            </EndpointGroup>
          ))
          )}
        </ApiContainer>
      </motion.div>
    </SlideContent>
  );
};

export default ApiEndpointsSlide; 