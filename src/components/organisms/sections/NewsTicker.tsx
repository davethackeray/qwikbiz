"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { NewsItem as NewsItemType } from "@/types/dashboard";
import { ErrorBoundary } from '../../ErrorBoundary';
import { NewsItem } from '../../molecules/NewsItem';

export interface NewsTickerProps {
  /**
   * Array of news items to display
   */
  news: NewsItemType[];
  /**
   * Scroll speed in pixels per second
   */
  speed?: number;
  /**
   * Optional loading state
   */
  isLoading?: boolean;
  /**
   * Optional error state
   */
  error?: Error;
  /**
   * Whether to pause on hover
   */
  pauseOnHover?: boolean;
}

/**
 * NewsTicker displays a horizontally scrolling list of news items
 * @example
 * <NewsTicker
 *   news={newsItems}
 *   speed={50}
 *   pauseOnHover
 * />
 */
export const NewsTicker: React.FC<NewsTickerProps> = ({
  news,
  speed = 50,
  isLoading = false,
  error,
  pauseOnHover = true,
}) => {
  const [items, setItems] = useState<NewsItemType[]>(news);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const moveNews = useCallback((): (() => void) | undefined => {
    if (!containerRef.current || !contentRef.current || isPaused) return;

    const contentWidth = contentRef.current.offsetWidth;
    let position = containerRef.current.scrollLeft;

    const animate = () => {
      if (!containerRef.current || isPaused) return;

      position += speed / 60; // 60fps
      containerRef.current.scrollLeft = position;

      if (position >= contentWidth) {
        position = 0;
        containerRef.current.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, isPaused]);

  useEffect(() => {
    setItems(news);
  }, [news]);

  useEffect(() => {
    const cleanup = moveNews();
    return cleanup;
  }, [moveNews]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/95 border-t border-gray-700 backdrop-blur-sm px-4 py-3 overflow-hidden shadow-lg animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/95 border-t border-gray-700 backdrop-blur-sm px-4 py-3 overflow-hidden shadow-lg text-red-400">
        Error loading news: {error.message}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className="bg-gray-800/95 border-t border-gray-700 backdrop-blur-sm px-4 py-3 overflow-hidden shadow-lg"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="marquee"
        aria-label="News headlines"
      >
        <div 
          className="whitespace-nowrap" 
          ref={contentRef}
        >
          {items.map((item, index) => (
            <NewsItem
              key={item.id}
              {...item}
              showSeparator={index < items.length - 1}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NewsTicker;
