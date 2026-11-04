/**
 * Utility functions for video sources (YouTube, YouTube Shorts, Instagram Reels, MP4)
 */

export function detectVideoType(url) {
  if (!url) return 'MP4';
  const clean = url.trim().toLowerCase();

  if (clean.includes('youtube.com/shorts') || clean.includes('/shorts/')) {
    return 'YOUTUBE_SHORTS';
  }
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
    return 'YOUTUBE';
  }
  if (clean.includes('instagram.com/reel') || clean.includes('instagram.com/p/') || clean.includes('instagr.am')) {
    return 'INSTAGRAM';
  }
  return 'MP4';
}

export function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(url) {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function extractInstagramShortcode(url) {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/i);
  return match ? match[1] : null;
}

export function getInstagramEmbedUrl(url) {
  const code = extractInstagramShortcode(url);
  if (!code) return null;
  return `https://www.instagram.com/reel/${code}/embed/`;
}

export function isValidVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) return true; // Local static assets like /videos/shayona-first.mp4
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

