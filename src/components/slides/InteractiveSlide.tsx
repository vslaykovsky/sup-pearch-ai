import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SlideContent,
  AnimatedHeader,
  SlideDescription,
  FeatureGrid,
  FeatureCard
} from '../ui/StyledComponents';
import { headerVariants, fadeInUp, staggerContainer } from '../ui/AnimationVariants';
import { SlideProps } from '../../types';

const InteractiveSlide: React.FC<SlideProps> = ({ slide, index, onSlideChange }) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  React.useEffect(() => {
    if (inView) {
      onSlideChange(index);
    }
  }, [inView, index, onSlideChange]);

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
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <FeatureGrid>
          <FeatureCard
            variants={fadeInUp}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3>🎯 Hover Me</h3>
            <p>This card responds to your interactions</p>
          </FeatureCard>
          <FeatureCard
            variants={fadeInUp}
            whileHover={{ 
              scale: 1.1, 
              rotate: -5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3>✨ Magic Effects</h3>
            <p>Watch the magic happen as you interact</p>
          </FeatureCard>
        </FeatureGrid>
      </motion.div>
    </SlideContent>
  );
};

export default InteractiveSlide; 