"use client";
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

/**
 * RevealOnScroll - Animates its children with fade+slide up when they enter the viewport or on mount if alwaysAnimate is true.
 * Usage: Wrap any section or element to animate it on scroll or on mount.
 */
export default function RevealOnScroll({ children, delay = 0, alwaysAnimate = false }: { children: React.ReactNode; delay?: number; alwaysAnimate?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView || alwaysAnimate) {
      controls.start('visible');
    }
  }, [inView, alwaysAnimate, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
} 