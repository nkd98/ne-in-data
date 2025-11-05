'use client';

import { Hero } from "@/components/Hero";
import BarStacked from "@/components/charts/BarStacked";
import { ArrowRight, BarChart, Book, FileText, LineChart, Map, SlidersHorizontal, Layers, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTopics } from "@/lib/data";
import { getArticles } from "@/lib/data";
import { InsightCard } from "@/components/insight-card";


const topics = getTopics().slice(0, 8);
const insights = getArticles().slice(0, 3);

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-12 md:py-16">

        {/* Explore by Theme Section */}
        <section id="explore" className="mb-16 scroll-mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold font-display tracking-tight md:text-4xl">
            Explore by theme
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {topics.map(topic => (
              <Button key={topic.id} variant="outline" size="sm" asChild>
                <Link href={`/topics/${topic.slug}`} className="transition-all hover:bg-primary/10 hover:shadow-md">
                   {topic.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* Latest Insights Section */}
        <section>
          <h2 className="mb-8 text-center text-3xl font-bold font-display tracking-tight md:text-4xl">
            Latest insights
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
             {insights.map((insight, index) => (
                <InsightCard key={insight.slug} article={insight} layout={index === 0 ? 'featured' : 'compact'} />
             ))}
          </div>
        </section>
      

      </div>
      
      {/* Newsletter Section */}
      <section className="bg-secondary/50 py-16 dark:bg-secondary/20">
        <form
          action="https://buttondown.email/api/emails/embed-subscribe/northeastindata"
          method="post"
          target="_blank"
          className="relative mx-auto mt-8 flex max-w-md"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full rounded-l-md border border-input bg-background px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          />
          <button
            type="submit"
            className="rounded-l-none rounded-r-md px-6 py-3 bg-primary text-primary-foreground font-medium"
          >
            Subscribe
          </button>
        </form>
      </section>
    </>
  );
}
