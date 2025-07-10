import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SlideContent,
  AnimatedHeader,
  SlideDescription
} from '../ui/StyledComponents';
import { headerVariants, fadeInUp } from '../ui/AnimationVariants';
import { SlideProps } from '../../types';

const FinalSlide: React.FC<SlideProps> = ({ slide, index, onSlideChange }) => {
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
      <motion.button
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          color: 'white',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          marginTop: '2rem'
        }}
        variants={fadeInUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ delay: 0.6, duration: 0.3 }}
        whileHover={{ 
          scale: 1.05,
          background: 'rgba(255, 255, 255, 0.3)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </SlideContent>
  );
};

export default FinalSlide; 