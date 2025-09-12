export interface VimeoEmbedConfig {
  autoplay?: boolean;
  autopause?: boolean;
  background?: boolean;
  byline?: boolean;
  color?: string;
  controls?: boolean;
  dnt?: boolean;
  keyboard?: boolean;
  loop?: boolean;
  muted?: boolean;
  pip?: boolean;
  playsinline?: boolean;
  portrait?: boolean;
  quality?: 'auto' | '240p' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';
  speed?: boolean;
  texttrack?: string;
  title?: boolean;
  transparent?: boolean;
  app_id?: number;
  player_id?: number;
}

export default function makeVimeoEmbedUrl(
  id?: string,
  config: VimeoEmbedConfig = {},
): string {
  if (!id) return '';

  const baseUrl = `https://player.vimeo.com/video/${id}`;
  const params = new URLSearchParams();

  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        params.append(key, value ? '1' : '0');
      } else if (typeof value === 'string' && value.trim() !== '') {
        params.append(key, value);
      } else if (typeof value === 'number') {
        params.append(key, value.toString());
      }
    }
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
