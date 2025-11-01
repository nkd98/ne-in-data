'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Topic, Visual } from '@/lib/types';
import { VisualCard } from '@/components/visual-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function ExplorerClient({ topics, visuals }: { topics: Topic[], visuals: Visual[] }) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    visuals.forEach(v => v.tags.forEach(t => tags.add(t)));
    return Array.from(tags).filter(tag => !topics.some(t => t.slug === tag));
  }, [visuals, topics]);

  const filteredVisuals = useMemo(() => {
    return visuals.filter(v => {
      const topicMatch = selectedTopic === 'all' || v.tags.includes(selectedTopic);
      const tagMatch = selectedTag === 'all' || v.tags.includes(selectedTag);
      return topicMatch && tagMatch;
    });
  }, [visuals, selectedTopic, selectedTag]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'transition-shadow', 'duration-1000', 'ease-in-out');
        setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 3000);
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardContent className="flex flex-col gap-4 p-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Filter by Topic</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                    variant={selectedTopic === 'all' ? 'secondary' : 'outline'}
                    onClick={() => setSelectedTopic('all')}
                    size="sm"
                >
                    All
                </Button>
                {topics.map(topic => (
                  <Button 
                    key={topic.id}
                    variant={selectedTopic === topic.slug ? 'secondary' : 'outline'}
                    onClick={() => setSelectedTopic(topic.slug)}
                    size="sm"
                  >
                    {topic.name}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Filter by Tag</label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </aside>
      <main className="grid grid-cols-1 gap-8 lg:col-span-3">
        <AnimatePresence>
          {filteredVisuals.length > 0 ? (
            filteredVisuals.map((visual) => (
              <motion.div
                key={visual.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VisualCard visual={visual} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              <p className="text-lg">No visualizations match your criteria.</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
