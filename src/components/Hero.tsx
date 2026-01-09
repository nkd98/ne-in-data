'use client';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';

export function Hero({ topics }: { topics: Array<{ id: string; slug: string; name: string }> }) {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 md:py-24">
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
          className="mx-auto max-w-3xl text-3xl font-bold font-display leading-tight text-foreground md:text-4xl lg:text-5xl"
        >
          Data to understand the <span className="text-primary">Northeast India</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {topics.map((topic) => (
            <Button key={topic.id} variant="outline" size="sm" asChild>
              <Link
                href={`/topics/${topic.slug}`}
                className="transition-all hover:bg-primary/10 hover:shadow-md"
              >
                {topic.name}
              </Link>
            </Button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
