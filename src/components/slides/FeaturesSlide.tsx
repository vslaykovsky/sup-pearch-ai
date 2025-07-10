import React from 'react';
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

const FeaturesSlide: React.FC<SlideProps> = ({ slide, index, onSlideChange }) => {
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
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <FeatureGrid>
          <FeatureCard
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3>🎨 Beautiful Animations</h3>
            <p>Smooth, performant animations powered by Framer Motion</p>
          </FeatureCard>
          <FeatureCard
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3>📱 Responsive Design</h3>
            <p>Looks great on all devices and screen sizes</p>
          </FeatureCard>
          <FeatureCard
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h3>⚡ Performance Optimized</h3>
            <p>Built with modern React and optimized for speed</p>
          </FeatureCard>
        </FeatureGrid>
      </motion.div>
    </SlideContent>
  );
};

export default FeaturesSlide; 