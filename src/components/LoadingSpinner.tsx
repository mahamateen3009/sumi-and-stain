import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <motion.div
        className="w-12 h-12 border-4 border-primary/30 border-t-accent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-foreground/60 font-serif tracking-widest text-sm animate-pulse">LOADING...</p>
    </div>
  );
};
