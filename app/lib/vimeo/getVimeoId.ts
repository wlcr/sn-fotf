export default function getVimeoId(url?: string) {
  if (!url) return undefined;
  const _url = new URL(url);
  const pathParts = _url.pathname.split('/');
  return pathParts[1];
}
