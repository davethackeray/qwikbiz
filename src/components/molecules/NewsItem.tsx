"use client";

import React from 'react';
import { NewsItem as NewsItemType } from "@/types/dashboard";

export interface NewsItemProps extends NewsItemType {
  /**
   * Whether to show the separator after this item
   */
  showSeparator?: boolean;
}

/**
 * NewsItem displays a single news headline with source and link
 * @example
 * <NewsItem
 *   id="1"
 *   source="Reuters"
 *   title="Market Update"
 *   url="https://example.com"
 *   showSeparator
 * />
 */
export const NewsItem: React.FC<NewsItemProps> = ({
  source,
  title,
  url,
  showSeparator = false
}) => {
  return (
    <span className="inline-block mx-4 text-sm">
      <span 
        className="text-blue-400 font-semibold"
        aria-label="News source"
      >
        {source}
      </span>
      <span className="mx-2 text-gray-500" aria-hidden="true">|</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors duration-200"
        aria-label={`${title} (opens in new tab)`}
      >
        {title}
      </a>
      {showSeparator && (
        <span 
          className="mx-4 text-gray-600"
          aria-hidden="true"
        >
          ●
        </span>
      )}
    </span>
  );
};

export default NewsItem;
