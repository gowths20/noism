export type ContentSource = 'reddit' | 'rss' | 'wikipedia' | 'podcast';

export interface ContentItem {
  id: string;
  source: ContentSource;
  sourceName: string;
  title: string;
  summary?: string;
  url: string;
  imageUrl?: string;
  country?: string;
  topic?: string;
  readingTimeSeconds?: number;
  publishedAt?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  countryFilter?: string;
  topicFilter?: string[];
  serendipityLevel: number;
}

export interface FeedRequest {
  userId: string;
  country?: string;
  topic?: string;
  limit?: number;
}

export interface FeedResponse {
  items: ContentItem[];
  hasMore: boolean;
}
