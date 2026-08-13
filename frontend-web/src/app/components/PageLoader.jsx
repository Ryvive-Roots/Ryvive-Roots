import { motion, AnimatePresence } from 'motion/react';
import { Sprout } from 'lucide-react';
import { DARK_2, SAGE, CREAM } from '../theme';

const BRAND = "Club Ryvive";

export default function PageLoader({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: DARK_2 }}
        >
          {/* Ambient pulsing glow behind everything */}
          <motion.div
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.15, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '480px',
              height: '480px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${SAGE}33 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative flex flex-col items-center"
          >
            {/* Rotating ring + growing sprout icon */}
            <div className="relative mb-7 flex items-center justify-center" style={{ width: 64, height: 64 }}>
              <motion.svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                style={{ position: 'absolute', top: 0, left: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={`${SAGE}30`}
                  strokeWidth="1.5"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={SAGE}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="176"
                  animate={{ strokeDashoffset: [176, 44, 176] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.svg>

              <motion.div
                animate={{ scale: [0.85, 1.05, 0.85], rotate: [-4, 4, -4] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sprout size={26} strokeWidth={1.4} color={SAGE} />
              </motion.div>
            </div>

            {/* Letter-by-letter brand reveal */}
            <div
              style={{
                fontFamily: "'Bodoni Moda', Georgia, serif",
                fontSize: 'clamp(26px, 5vw, 42px)',
                letterSpacing: '0.02em',
                color: SAGE,
                fontWeight: 700,
                textTransform: 'uppercase',
                display: 'flex',
              }}
            >
              {BRAND.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0, 1, 1, 0.5], y: 0 }}
                  transition={{
                    duration: 1.9,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.045,
                  }}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Shimmering gradient line */}
            <div
              className="relative overflow-hidden mt-5"
              style={{ height: '1px', width: '140px', background: `${SAGE}25` }}
            >
              <motion.div
                animate={{ x: ['-140px', '140px'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  height: '100%',
                  width: '60px',
                  background: `linear-gradient(90deg, transparent, ${SAGE}, transparent)`,
                }}
              />
            </div>

            {/* Powered-by line, fades and drifts in slightly after */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              className="uppercase mt-6"
              style={{ fontSize: '14px', color: 'rgba(244,239,230,0.55)', fontWeight: 600 }}
            >
               Powered By Ryvive Roots
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}