import { ContentItem } from '@/types';
import { hashContent } from '@/lib/utils/hashContent';

export const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC News', country: 'GB', topic: 'news' },
  { url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml', name: 'BBC India', country: 'IN', topic: 'news' },
  { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', name: 'Times of India', country: 'IN', topic: 'news' },
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', name: 'NASA', country: 'US', topic: 'science' },
  { url: 'https://feeds.reuters.com/reuters/topNews', name: 'Reuters', country: 'US', topic: 'news' },
];

export async function fetchRSSFeed(
  feed: (typeof RSS_FEEDS)[0]
): Promise<ContentItem[]> {
  const { parseStringPromise } = await import('xml2js');
  const res = await fetch(feed.url, { next: { revalidate: 3600 } });
  const xml = await res.text();
  const parsed = await parseStringPromise(xml);
  const items: unknown[] = parsed?.rss?.channel?.[0]?.item ?? [];

  return items.slice(0, 10).map((item: unknown) => {
    const i = item as Record<string, string[]>;
    return {
      id: hashContent(feed.url + (i.link?.[0] ?? '')),
      source: 'rss' as const,
      sourceName: feed.name,
      title: i.title?.[0] ?? '',
      summary: i.description?.[0]?.replace(/<[^>]*>/g, '').slice(0, 200),
      url: i.link?.[0] ?? '',
      country: feed.country,
      topic: feed.topic,
      publishedAt: i.pubDate?.[0],
    };
  });
}
