"use client";

import { NewsItem } from "@/types/dashboard";
import { useCallback, useEffect, useRef, useState } from "react";

interface NewsTickerProps {
  news: NewsItem[];
  speed?: number; // pixels per second
}

export function NewsTicker({ news, speed = 50 }: NewsTickerProps) {
  const [items, setItems] = useState<NewsItem[]>(news);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const moveNews = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const contentWidth = contentRef.current.offsetWidth;
    let position = containerRef.current.scrollLeft;

    const animate = () => {
      if (!containerRef.current) return;

      position += speed / 60; // 60fps
      containerRef.current.scrollLeft = position;

      if (position >= contentWidth) {
        position = 0;
        containerRef.current.scrollLeft = 0;
      }

      requestAnimationFrame(animate);
    };

    const animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, [speed]);

  useEffect(() => {
    const cleanup = moveNews();
    return () => {
      if (cleanup) cleanup();
    };
  }, [moveNews]);

  return (
    <div className="bg-gray-800 px-4 py-2 overflow-hidden" ref={containerRef}>
      <div className="whitespace-nowrap" ref={contentRef}>
        {items.map((item, index) => (
          <span key={item.id} className="inline-block mx-4">
            <span className="text-blue-400">{item.source}</span>
            <span className="mx-2">|</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              {item.title}
            </a>
            {index < items.length - 1 && (
              <span className="mx-4 text-gray-600">•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
