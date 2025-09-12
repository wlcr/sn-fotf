export interface VimeoEmbedConfig {
  badge?: boolean;
  autopause?: boolean;
  player_id?: number;
  app_id?: number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  portrait?: boolean;
  title?: boolean;
  byline?: boolean;
  color?: string;
  transparent?: boolean;
  speed?: boolean;
  keyboard?: boolean;
  pip?: boolean;
  playsinline?: boolean;
  dnt?: boolean;
  quality?: 'auto' | '240p' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';
  texttrack?: string;
  background?: boolean;
}

export default function makeVimeoEmbedUrl(
  id?: string,
  config?: VimeoEmbedConfig,
) {
  if (!id) return '';

  const baseUrl = `https://player.vimeo.com/video/${id}`;

  if (!config) return baseUrl;

  const params = new URLSearchParams();

  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined) {
      const paramValue =
        typeof value === 'boolean' ? (value ? '1' : '0') : value.toString();
      params.append(key, paramValue);
    }
  });

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
