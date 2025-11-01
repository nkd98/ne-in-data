'use client';
import { ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#12B886] text-[hsl(var(--hero-foreground))] py-20 md:py-24">
       <div
        className="absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: 'url(/topographic.svg)',
          backgroundSize: 'cover'
        }}
      />
      <div className="container relative mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-3xl font-bold font-display leading-tight text-white md:text-4xl lg:text-5xl"
          style={{textShadow: '0 2px 10px rgba(0,0,0,0.2)'}}
        >
          Data to understand the Northeast, its people, economy, and society
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="relative mx-auto mt-8 max-w-xl"
        >
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder='Try "Literacy in Assam", "Employment in Tripura", "Tea area"'
            className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-base text-white placeholder:text-white/70 shadow-lg backdrop-blur-sm transition-shadow focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          />
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="mt-8"
        >
            <Button asChild variant="link" className="text-lg text-white/90 hover:text-white">
                <Link href="#explore">
                    Start exploring <ChevronRight className="h-5 w-5" />
                </Link>
            </Button>
        </motion.div>
      </div>
    </section>
  );
}
