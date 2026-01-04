import { SearchResult } from '../types';

const TAVILY_API_URL = 'https://api.tavily.com/search';

export interface TavilyConfig {
  apiKey: string;
  maxResults?: number;
  includeImages?: boolean;
  includeRawContent?: boolean;
}

const defaultConfig: TavilyConfig = {
  apiKey: import.meta.env.VITE_TAVILY_API_KEY || '',
  maxResults: 5,
  includeImages: false,
  includeRawContent: false,
};

export interface TavilySearchResponse {
  results: SearchResult[];
  response_time: string;
}

export async function searchWeb(
  query: string,
  config: Partial<TavilyConfig> = {}
): Promise<SearchResult[]> {
  const mergedConfig = { ...defaultConfig, ...config };
  
  if (!mergedConfig.apiKey) {
    throw new Error('TAVILY_API_KEY not configured');
  }

  const response = await fetch(TAVILY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: mergedConfig.apiKey,
      query,
      max_results: mergedConfig.maxResults,
      include_images: mergedConfig.includeImages,
      include_raw_content: mergedConfig.includeRawContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Tavily API error');
  }

  const data: TavilySearchResponse = await response.json();
  return data.results;
}

export function shouldSearchWeb(lastUserMessage: string): boolean {
  const searchTriggers = [
    'latest',
    'recent',
    'news',
    'current',
    'today',
    '2024',
    '2025',
    'what is',
    'who is',
    'when did',
    'how to',
    'docs',
    'documentation',
    'official',
    'website',
  ];
  
  const lowerMessage = lastUserMessage.toLowerCase();
  return searchTriggers.some(trigger => lowerMessage.includes(trigger));
}
