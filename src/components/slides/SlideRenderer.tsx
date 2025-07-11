import React from 'react';
import PearchQuerySlide from './PearchQuerySlide';
import WelcomeSlide from './WelcomeSlide';
import FeaturesSlide from './FeaturesSlide';
import InteractiveSlide from './InteractiveSlide';
import FinalSlide from './FinalSlide';
import CostStructureSlide from './CostStructureSlide';
import ApiEndpointsSlide from './ApiEndpointsSlide';
import { SlideProps, AppSettings } from '../../types';

interface SlideRendererProps extends SlideProps {
  settings?: AppSettings;
  onOpenQuerySetupModal?: () => void;
  onOpenSearchResultsModal?: () => void;
  onOpenCostStructureModal?: () => void;
  onOpenApiEndpointsModal?: () => void;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  index, 
  onSlideChange, 
  settings,
  onOpenQuerySetupModal,
  onOpenSearchResultsModal,
  onOpenCostStructureModal,
  onOpenApiEndpointsModal
}) => {
  switch (slide.type) {
    case 'pearch':
      return <PearchQuerySlide 
        slide={slide} 
        index={index} 
        onSlideChange={onSlideChange} 
        settings={settings}
        onOpenQuerySetupModal={onOpenQuerySetupModal}
        onOpenSearchResultsModal={onOpenSearchResultsModal}
      />;
    case 'welcome':
      return <WelcomeSlide slide={slide} index={index} onSlideChange={onSlideChange} settings={settings} />;
    case 'features':
      return <FeaturesSlide slide={slide} index={index} onSlideChange={onSlideChange} settings={settings} />;
    case 'interactive':
      return <InteractiveSlide slide={slide} index={index} onSlideChange={onSlideChange} settings={settings} />;
    case 'final':
      return <FinalSlide slide={slide} index={index} onSlideChange={onSlideChange} settings={settings} />;
    case 'cost':
      return <CostStructureSlide 
        slide={slide} 
        index={index} 
        onSlideChange={onSlideChange} 
        settings={settings}
        onOpenCostStructureModal={onOpenCostStructureModal}
      />;
    case 'api-endpoints':
      return <ApiEndpointsSlide 
        slide={slide} 
        index={index} 
        onSlideChange={onSlideChange} 
        settings={settings}
        onOpenApiEndpointsModal={onOpenApiEndpointsModal}
      />;
    default:
      return <WelcomeSlide slide={slide} index={index} onSlideChange={onSlideChange} settings={settings} />;
  }
};

export default SlideRenderer; 