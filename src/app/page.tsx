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
import { useState, type FormEvent } from "react";


const articles = getArticles();
const topicIdsWithArticles = new Set(articles.flatMap((article) => article.topicIds));
const topics = getTopics()
  .filter((topic) => topicIdsWithArticles.has(topic.id))
  .slice(0, 8);
const insights = articles.slice(0, 3);
const featuredInsight = insights[0];
const secondaryInsights = insights.slice(1);

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const isBusy = status === "loading";

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const errorMessage =
          typeof data?.error === "string" && data.error.trim().length > 0
            ? data.error
            : "Something went wrong. Please try again.";
        throw new Error(errorMessage);
      }

      setStatus("success");
      setMessage(
        typeof data?.message === "string" && data.message.trim().length > 0
          ? data.message
          : "Thanks! Check your inbox to confirm."
      );
      setEmail("");
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message.length > 0
          ? error.message
          : "Something went wrong. Please try again.";
      setStatus("error");
      setMessage(errorMessage);
    }
  };

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
        <div className="mx-auto mt-8 max-w-md">
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="Enter your email"
              disabled={isBusy}
              className="w-full rounded-l-md border border-input bg-background px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-l-none rounded-r-md px-6 py-3 bg-primary text-primary-foreground font-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isBusy ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message ? (
            <p
              className={`mt-3 text-center text-sm ${
                status === "error" ? "text-destructive" : "text-muted-foreground"
              }`}
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
