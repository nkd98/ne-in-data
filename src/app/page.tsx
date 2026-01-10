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


const articles = getArticles();
const topicIdsWithArticles = new Set(articles.flatMap((article) => article.topicIds));
const topics = getTopics()
  .filter((topic) => topicIdsWithArticles.has(topic.id))
  .slice(0, 8);
const insights = articles.slice(0, 3);
const featuredInsight = insights[0];
const secondaryInsights = insights.slice(1);

export default function Home() {
  return (
    <>
      <Hero topics={topics} />
      <div className="container mx-auto px-4 py-12 md:py-16">

        {/* Latest Insights Section */}
        <section>
          <h2 className="mb-8 text-center text-2xl font-bold font-display tracking-tight md:text-4xl">
            Latest insights
          </h2>
          <div className="flex flex-col gap-8 lg:flex-row">
            {featuredInsight && (
              <div className="lg:w-[58%]">
                <InsightCard article={featuredInsight} layout="featured" />
              </div>
            )}
            <div className="flex flex-col gap-8 lg:w-[42%]">
              {secondaryInsights.map((insight) => (
                <InsightCard key={insight.slug} article={insight} layout="compact" />
              ))}
            </div>
          </div>
        </section>
      

      </div>
      
      {/* Newsletter Section */}
      <section className="border-t border-border bg-background py-16">
        <p className="mx-auto mb-4 max-w-md text-center text-sm text-muted-foreground">
          Get monthly insights in your inbox.
        </p>
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
