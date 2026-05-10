import { ContentItem } from '@/types';
import { countryFlag } from '@/lib/utils/countryFlag';

interface Props {
  item: ContentItem;
  onSeen: (id: string) => void;
}

export function ContentCard({ item, onSeen }: Props) {
  const handleClick = () => {
    onSeen(item.id);
    window.open(item.url, '_blank', 'noopener');
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      {item.imageUrl && (
        <img src={item.imageUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-3" loading="lazy" />
      )}
      <div className="flex items-center gap-2 mb-2">
        {item.country && <span className="text-lg">{countryFlag(item.country)}</span>}
        <span className="text-xs text-gray-500">{item.sourceName}</span>
        {item.topic && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.topic}</span>
        )}
        {item.readingTimeSeconds && (
          <span className="text-xs text-gray-400 ml-auto">{Math.ceil(item.readingTimeSeconds / 60)} min</span>
        )}
      </div>
      <h2 className="font-medium text-gray-900 text-base leading-snug mb-1">{item.title}</h2>
      {item.summary && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
      )}
    </div>
  );
}
