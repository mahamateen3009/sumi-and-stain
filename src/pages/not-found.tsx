import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, rgba(177,188,172,0.15) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel max-w-md w-full p-10 rounded-3xl text-center relative z-10"
      >
        <h1 className="font-serif text-8xl font-bold mb-4 text-glow" style={{ color: '#879585' }}>404</h1>
        <h2 className="text-2xl font-medium mb-5" style={{ color: '#879585' }}>Canvas Not Found</h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(135,149,133,0.7)' }}>
          The artwork you're looking for seems to have been erased — or never existed.
        </p>
        <Link
          href="/"
          className="inline-block btn-primary px-8 py-3 rounded-xl text-sm font-medium transition-transform hover:scale-105"
        >
          Return to Gallery
        </Link>
      </motion.div>
    </div>
  );
}
