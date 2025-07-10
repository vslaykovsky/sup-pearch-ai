import React from 'react';
import { useInView } from 'react-intersection-observer';
import {
  SlideContent,
  AnimatedHeader,
  SlideDescription
} from '../ui/StyledComponents';
import { headerVariants, fadeInUp } from '../ui/AnimationVariants';
import { SlideProps } from '../../types';

const WelcomeSlide: React.FC<SlideProps> = ({ slide, index, onSlideChange }) => {
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
    </SlideContent>
  );
};

export default WelcomeSlide; 