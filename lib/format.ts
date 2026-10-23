export const fmt = new Intl.NumberFormat("en-US");
export const pct = (x: number) => `${(x * 100).toFixed(1)} %`;
export const short = (hex: string, n = 8) => (hex.length > n * 2 ? `${hex.slice(0, n)}…${hex.slice(-4)}` : hex);
export const ago = (unix: number, now = Date.now() / 1000) => {
  const d = Math.max(0, Math.round(now - unix));
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.round(d / 60)} min ago`;
  if (d < 86_400) return `${Math.round(d / 3600)} h ago`;
  return `${Math.round(d / 86_400)} d ago`;
};
