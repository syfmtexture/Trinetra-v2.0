'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

function renderSpokes() {
  const items = [];
  for (let i = 0; i < 24; i++) {
    const angle = i * 15;
    const dotAngle = angle + 7.5;
    items.push(
      <g key={`spoke-${i}`}>
        <polygon
          points="58,48.5 75,49.2 88,49.7 88,50.3 75,50.8 58,51.5"
          transform={`rotate(${angle}, 50, 50)`}
        />
        <circle cx="89.5" cy="50" r="1.5" transform={`rotate(${dotAngle}, 50, 50)`} />
      </g>
    );
  }
  return items;
}

function ChakraSVG({ fill = 'currentColor' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <g fill={fill}>
        <path d="M50 5 A45 45 0 1 1 5 50 A45 45 0 0 1 50 5 Z M50 9 A41 41 0 1 0 91 50 A41 41 0 0 0 50 9 Z" fillRule="evenodd" />
        <circle cx="50" cy="50" r="10" />
        {renderSpokes()}
      </g>
    </svg>
  );
}

export default function MandalaScroll() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });

  const clipRadius = useTransform(smoothProgress, [0, 1], [0, 50]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] w-20 h-20 hidden md:block">
      <div className="absolute inset-0 text-trinetra-muted/40 animate-[spin_60s_linear_infinite]">
        <ChakraSVG />
      </div>

      <motion.div
        className="absolute inset-0 animate-[spin_60s_linear_infinite] drop-shadow-[0_0_12px_rgba(252,88,3,0.5)]"
        style={{
          clipPath: useTransform(clipRadius, (r) => `circle(${r}% at 50% 50%)`),
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="chakra-tri" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
          </defs>
          <g fill="url(#chakra-tri)">
            <path d="M50 5 A45 45 0 1 1 5 50 A45 45 0 0 1 50 5 Z M50 9 A41 41 0 1 0 91 50 A41 41 0 0 0 50 9 Z" fillRule="evenodd" />
            <circle cx="50" cy="50" r="10" />
            {renderSpokes()}
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
