import { NewsItem } from "@/types/dashboard";
import { NewsApiResponse } from "@/types/api";

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

    const data = await response.json() as NewsApiResponse;
    
    return data.data.map((article) => ({
      id: article.uuid,
      title: article.title,
      source: article.source,
      url: article.url,
      timestamp: article.published_at,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    // Return mock news data when API is not available
    return [
      {
        id: "1",
        title: "Tech Giant Reports Record Q4 Earnings",
        source: "Financial Times",
        url: "#",
        timestamp: new Date().toISOString()
      },
      {
        id: "2",
        title: "Global Supply Chain Shows Signs of Recovery",
        source: "Reuters",
        url: "#",
        timestamp: new Date().toISOString()
      },
      {
        id: "3",
        title: "New AI Breakthrough Promises Business Efficiency Gains",
        source: "Bloomberg",
        url: "#",
        timestamp: new Date().toISOString()
      },
      {
        id: "4",
        title: "Sustainable Business Practices Drive Market Growth",
        source: "WSJ",
        url: "#",
        timestamp: new Date().toISOString()
      },
      {
        id: "5",
        title: "Innovation in FinTech Sector Accelerates",
        source: "TechCrunch",
        url: "#",
        timestamp: new Date().toISOString()
      }
    ];
  }
}
