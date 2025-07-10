// Animation variants
export const headerVariants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

export const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: -50
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0
  }
}; 