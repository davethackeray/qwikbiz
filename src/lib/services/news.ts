import { NewsItem } from "@/types/dashboard";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_BASE_URL = "https://api.thenewsapi.com/v1/news/all";

export async function fetchBusinessNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}?api_token=${NEWS_API_KEY}&language=en&categories=business,technology&limit=10`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    
    return data.data.map((article: any) => ({
      id: article.uuid,
      title: article.title,
      source: article.source,
      url: article.url,
      timestamp: article.published_at,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
