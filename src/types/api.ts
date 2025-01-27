export interface NewsApiArticle {
  uuid: string;
  title: string;
  source: string;
  url: string;
  published_at: string;
}

export interface NewsApiResponse {
  data: NewsApiArticle[];
}

export interface GeminiResponse {
  description: string;
  complexity: number;
  solutions: Array<{
    description: string;
    impacts: {
      revenue: number;
      morale: number;
      efficiency: number;
    };
    explanation: string;
  }>;
}
