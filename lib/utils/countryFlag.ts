const FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', IN: '🇮🇳', AU: '🇦🇺', CA: '🇨🇦',
  DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵', BR: '🇧🇷', ZA: '🇿🇦',
  NG: '🇳🇬', MX: '🇲🇽', KR: '🇰🇷', IT: '🇮🇹', ES: '🇪🇸',
};

export function countryFlag(code: string): string {
  return FLAGS[code.toUpperCase()] ?? '🌍';
}
