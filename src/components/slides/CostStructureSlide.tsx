import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import {
  SlideContent,
  AnimatedHeader,
  SlideDescription,
  PearchContainer,
  LeftPanel,
  RightPanel,
  RangeValue,
  GearIcon,
  PanelTitle
} from '../ui/StyledComponents';
import { headerVariants, fadeInUp, staggerContainer } from '../ui/AnimationVariants';
import { SlideProps } from '../../types';

// Cost breakdown item component
const CostBreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
    font-weight: 600;
    font-size: 1.1rem;
    padding-top: 1rem;
    border-top: 2px solid rgba(255, 255, 255, 0.2);
  }
`;

const CostLabel = styled.span`
  color: rgba(255, 255, 255, 0.9);
`;

const CostValue = styled.span`
  color: white;
  font-weight: 500;
`;

const TotalCost = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #50fa7b;
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(80, 250, 123, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(80, 250, 123, 0.3);
`;

const PackageSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PackageOption = styled.div<{ selected: boolean }>`
  background: ${props => props.selected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.selected ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SliderContainer = styled.div`
  margin-bottom: 2rem;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
  font-weight: 500;
`;

const SearchVolumeDisplay = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #50fa7b;
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(80, 250, 123, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(80, 250, 123, 0.3);
`;

const StyledRangeSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #50fa7b;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #50fa7b;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const CompactPackageName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
`;

const CompactPackagePrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #50fa7b;
  margin-bottom: 0.5rem;
`;

const CompactPackageLimit = styled.p`
  margin: 0 0 0.5rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
`;

const CompactPerCandidatePrice = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
`;

const CostStructureSlide: React.FC<SlideProps> = ({ 
  slide, 
  index, 
  onSlideChange, 
  settings,
  onOpenCostStructureModal
}) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'professional' | 'enterprise'>('starter');
  const [searchVolume, setSearchVolume] = useState(50000);
  const [candidatesPerSearch, setCandidatesPerSearch] = useState(50);

  // Use packages from settings if available, otherwise use defaults
  const packages = settings?.packages || {
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
  };

  React.useEffect(() => {
    if (inView) {
      onSlideChange(index);
    }
  }, [inView, index, onSlideChange]);

  const currentPackage = packages[selectedPackage];
  
  // Calculate costs
  const monthlyBaseCost = currentPackage.monthlyPrice;
  const totalCandidates = searchVolume * candidatesPerSearch;
  const overageCandidates = Math.max(0, totalCandidates - currentPackage.limit);
  const overageCost = overageCandidates * currentPackage.perCandidatePrice;
  const totalCost = monthlyBaseCost + overageCost;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <SlideContent ref={ref}>
      <AnimatedHeader
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={headerVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {onOpenCostStructureModal && (
          <GearIcon
            onClick={onOpenCostStructureModal}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
            </svg>
          </GearIcon>
        )}
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
            <PanelTitle>
              {onOpenCostStructureModal && (
                <GearIcon
                  onClick={onOpenCostStructureModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/>
                  </svg>
                </GearIcon>
              )}
              Cost Calculator
            </PanelTitle>
            
            <SliderContainer>
              <SliderLabel>
                <span>Estimated Monthly Searches</span>
                <RangeValue>{formatNumber(searchVolume)}</RangeValue>
              </SliderLabel>
              
              <SearchVolumeDisplay>
                {formatNumber(searchVolume)} searches
              </SearchVolumeDisplay>
              
              <StyledRangeSlider
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={searchVolume}
                onChange={(e) => setSearchVolume(parseInt(e.target.value))}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <span>1K</span>
                <span>1M</span>
              </div>
            </SliderContainer>

            <SliderContainer>
              <SliderLabel>
                <span>Candidates per Search</span>
                <RangeValue>{candidatesPerSearch}</RangeValue>
              </SliderLabel>
              
              <SearchVolumeDisplay>
                {candidatesPerSearch} candidates per search
              </SearchVolumeDisplay>
              
              <StyledRangeSlider
                type="range"
                min="10"
                max="1000"
                step="10"
                value={candidatesPerSearch}
                onChange={(e) => setCandidatesPerSearch(parseInt(e.target.value))}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <span>10</span>
                <span>1K</span>
              </div>
            </SliderContainer>

            <div style={{ 
              marginBottom: '2rem', 
              padding: '1rem', 
              background: 'rgba(80, 250, 123, 0.1)', 
              borderRadius: '12px', 
              border: '1px solid rgba(80, 250, 123, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#50fa7b', marginBottom: '0.5rem' }}>
                Total Monthly Candidates: {formatNumber(totalCandidates)}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                {formatNumber(searchVolume)} searches × {candidatesPerSearch} candidates = {formatNumber(totalCandidates)} candidates
              </div>
            </div>
            
            <PackageSelector>
              {Object.entries(packages).map(([key, pkg]) => (
                <PackageOption
                  key={key}
                  selected={selectedPackage === key}
                  onClick={() => setSelectedPackage(key as any)}
                >
                  <CompactPackageName>{pkg.name}</CompactPackageName>
                  <CompactPackagePrice>{formatCurrency(pkg.monthlyPrice)}/month</CompactPackagePrice>
                  <CompactPackageLimit>Up to {formatNumber(pkg.limit)} candidates</CompactPackageLimit>
                  <CompactPerCandidatePrice>${pkg.perCandidatePrice.toFixed(3)} per additional candidate</CompactPerCandidatePrice>
                </PackageOption>
              ))}
            </PackageSelector>
          </LeftPanel>
          
          <RightPanel>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <CostBreakdownItem>
                <CostLabel>Base Package ({currentPackage.name})</CostLabel>
                <CostValue>{formatCurrency(monthlyBaseCost)}</CostValue>
              </CostBreakdownItem>
              
              {overageCandidates > 0 && (
                <CostBreakdownItem>
                  <CostLabel>
                    Overage ({formatNumber(overageCandidates)} candidates × ${currentPackage.perCandidatePrice.toFixed(3)})
                  </CostLabel>
                  <CostValue>{formatCurrency(overageCost)}</CostValue>
                </CostBreakdownItem>
              )}
              
              <CostBreakdownItem>
                <CostLabel>Total Monthly Cost</CostLabel>
                <CostValue>{formatCurrency(totalCost)}</CostValue>
              </CostBreakdownItem>
              
              <TotalCost>
                {formatCurrency(totalCost)} / month
              </TotalCost>
              
              {overageCandidates > 0 && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: 'rgba(255, 193, 7, 0.1)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  color: '#ffc107',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  ⚠️ You're exceeding the {currentPackage.name} package limit by {formatNumber(overageCandidates)} candidates
                </div>
              )}
              
              {totalCandidates <= currentPackage.limit && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: 'rgba(80, 250, 123, 0.1)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(80, 250, 123, 0.3)',
                  color: '#50fa7b',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  ✅ Within package limits - no overage charges
                </div>
              )}
            </motion.div>
          </RightPanel>
        </PearchContainer>
      </motion.div>
    </SlideContent>
  );
};

export default CostStructureSlide; 