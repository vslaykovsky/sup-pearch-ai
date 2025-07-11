import styled from 'styled-components';
import { motion } from 'framer-motion';

// Base App Components
export const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

export const SlideSection = styled(motion.section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  padding-bottom: 4rem;
`;

export const SlideContent = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  color: white;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Pearch.AI specific styled components
export const PearchContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 80vh;
  max-height: 2000px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
`;

export const LeftPanel = styled.div`
  flex: 1;
  padding: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
`;

export const RightPanel = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

export const PanelTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  position: relative;
`;

export const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
`;

export const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const CodeArea = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #e0e0e0;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  code {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
  
  /* Prism.js syntax highlighting styles */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #6272a4;
    font-style: italic;
  }
  
  .token.punctuation {
    color: #f8f8f2;
  }
  
  .token.namespace {
    opacity: 0.7;
  }
  
  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #bd93f9;
  }
  
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #f1fa8c;
  }
  
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #ff79c6;
  }
  
  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #ff79c6;
  }
  
  .token.function,
  .token.class-name {
    color: #50fa7b;
  }
  
  .token.regex,
  .token.important,
  .token.variable {
    color: #f8f8f2;
  }
  
  .token.important,
  .token.bold {
    font-weight: bold;
  }
  
  .token.italic {
    font-style: italic;
  }
  
  .token.entity {
    cursor: help;
  }
`;

export const QueryInput = styled.textarea`
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  resize: none;
  text-align: left;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const SearchButton = styled(motion.button)`
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export const FilterContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FilterButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const FilterDropdown = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  backdrop-filter: blur(10px);
`;

export const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const FilterInput = styled.select`
  flex: 1;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 0.85rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  option {
    background: #1a1a1a;
    color: white;
  }
`;

export const FilterValueInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 0.85rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const RemoveFilterButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 4px;
  color: #ff6b6b;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 107, 107, 0.3);
    border-color: rgba(255, 107, 107, 0.5);
  }
`;

export const FilterGroupContainer = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const FilterGroupHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
`;

export const FilterOperatorSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  option {
    background: #1a1a1a;
    color: white;
  }
`;

export const NotConditionButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.2)'};
  }
`;

export const ResultContainer = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const RenderedResult = styled.div`
  color: white;
  line-height: 1.6;
  text-align: left;
`;

export const JsonResult = styled.pre`
  color: #e0e0e0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
  margin: 0;
  
  code {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
  
  /* Prism.js syntax highlighting styles */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #6272a4;
    font-style: italic;
  }
  
  .token.punctuation {
    color: #f8f8f2;
  }
  
  .token.namespace {
    opacity: 0.7;
  }
  
  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #bd93f9;
  }
  
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #f1fa8c;
  }
  
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #ff79c6;
  }
  
  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #ff79c6;
  }
  
  .token.function,
  .token.class-name {
    color: #50fa7b;
  }
  
  .token.regex,
  .token.important,
  .token.variable {
    color: #f8f8f2;
  }
  
  .token.important,
  .token.bold {
    font-weight: bold;
  }
  
  .token.italic {
    font-style: italic;
  }
  
  .token.entity {
    cursor: help;
  }
`;

// Header and Description Components
export const AnimatedHeader = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
`;

export const SlideDescription = styled(motion.p)`
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

// Progress and Navigation Components
export const ProgressIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1000;
`;

export const ProgressBar = styled(motion.div)`
  height: 100%;
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

export const SlideCounter = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

export const SettingsButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1000;
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

export const GearIcon = styled(motion.button)`
  position: relative;
  width: auto;
  height: auto;
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-right: 0.5rem;
  padding: 0.2rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
  
  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

// Modal Components
export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

// Settings Components
export const SettingGroup = styled.div`
  margin-bottom: 2rem;
`;

export const SettingLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 500;
`;

export const ToggleSwitch = styled.div<{ active: boolean }>`
  width: 50px;
  height: 26px;
  background: ${props => props.active ? '#667eea' : '#ccc'};
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.active ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const Select = styled.select`
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const RangeSlider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

export const RangeValue = styled.span`
  color: #667eea;
  font-weight: 600;
  margin-left: 1rem;
`;

// Pricing Components
export const PricingSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
`;

export const PricingTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
`;

export const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const PackageCard = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

export const PackageName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const PackageLimit = styled.p`
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
`;

export const PackagePrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

export const PerCandidatePrice = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

export const PriceNote = styled.div`
  font-size: 0.8rem;
  color: #999;
  font-style: italic;
`;

export const PackageForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const FormInput = styled.input`
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const SaveButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const PackageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

export const PackageTitle = styled.h4`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
`;

// Feature Components
export const FloatingElement = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  z-index: 1;
`;

export const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

// Checkbox Components
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ApiEndpointsSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
`;

export const ApiEndpointsTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
`;

export const ApiEndpointsDescription = styled.p`
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
  }
`;

export const RadioInput = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #007bff;
  cursor: pointer;
`;

export const RadioLabel = styled.label`
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  flex: 1;
`;

export const RadioDescription = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-left: 0.5rem;
`; 