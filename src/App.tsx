import React, { useState, useRef, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import 'prismjs/themes/prism-tomorrow.css';
import './App.css';

// Import styled components
import {
  AppContainer,
  SlideSection,
  ProgressIndicator,
  ProgressBar,
  SlideCounter,
  FloatingElement
} from './components/ui/StyledComponents';

// Import components
import QuerySetupModal from './components/settings/QuerySetupModal';
import SearchResultsModal from './components/settings/SearchResultsModal';
import CostStructureModal from './components/settings/CostStructureModal';
import ApiEndpointsModal from './components/settings/ApiEndpointsModal';
import SlideRenderer from './components/slides/SlideRenderer';

// Import types and data
import { AppSettings } from './types';
import { slides } from './data/slides';
import { loadSettingsFromStorage, saveSettingsToStorage } from './utils/localStorage';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isQuerySetupOpen, setIsQuerySetupOpen] = useState(false);
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
  const [isCostStructureOpen, setIsCostStructureOpen] = useState(false);
  const [isApiEndpointsOpen, setIsApiEndpointsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettingsFromStorage());

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = loadSettingsFromStorage();
    setSettings(savedSettings);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
    // Save settings to localStorage whenever they change
    saveSettingsToStorage(newSettings);
  };

  return (
    <AppContainer ref={containerRef}>
      <ProgressIndicator>
        <ProgressBar style={{ width: progressWidth }} />
      </ProgressIndicator>

      <SlideCounter>
        {currentSlide + 1} / {slides.length}
      </SlideCounter>

      <QuerySetupModal
        isOpen={isQuerySetupOpen}
        onClose={() => setIsQuerySetupOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <SearchResultsModal
        isOpen={isSearchResultsOpen}
        onClose={() => setIsSearchResultsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <CostStructureModal
        isOpen={isCostStructureOpen}
        onClose={() => setIsCostStructureOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <ApiEndpointsModal
        isOpen={isApiEndpointsOpen}
        onClose={() => setIsApiEndpointsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      {slides.map((slide, index) => (
        <SlideSection
          key={slide.id}
          className={`slide-${index}`}
        >
          {/* Background floating elements */}
          <FloatingElement
            style={{ top: '10%', left: '10%' }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <FloatingElement
            style={{ top: '20%', right: '15%' }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <FloatingElement
            style={{ bottom: '30%', left: '20%' }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          <SlideRenderer 
            slide={slide} 
            index={index} 
            onSlideChange={handleSlideChange} 
            settings={settings}
            onOpenQuerySetupModal={() => setIsQuerySetupOpen(true)}
            onOpenSearchResultsModal={() => setIsSearchResultsOpen(true)}
            onOpenCostStructureModal={() => setIsCostStructureOpen(true)}
            onOpenApiEndpointsModal={() => setIsApiEndpointsOpen(true)}
          />
        </SlideSection>
      ))}
    </AppContainer>
  );
}

export default App;
