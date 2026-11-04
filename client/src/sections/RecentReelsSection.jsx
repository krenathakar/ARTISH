import React, { useEffect, useMemo, useState } from "react";
import API, { getAssetUrl } from "../services/api";
import { getYouTubeEmbedUrl } from "../utils/videoUtils";

// Existing reel items as resilient fallback if API is unreachable
const defaultReels = [
  {
    id: 1,
    category: "Restaurants",
    title: "Shayona Restaurant",
    video: "/videos/shayona-first.mp4",
    videoType: "MP4",
  },
  {
    id: 2,
    category: "Events",
    title: "Harsh & Jatin",
    video: "/videos/harsh-jatin.mp4",
    videoType: "MP4",
  },
  {
    id: 3,
    category: "Restaurants",
    title: "GJ 05",
    video: "/videos/gj05.mp4",
    videoType: "MP4",
  },
  {
    id: 4,
    category: "Events",
    title: "Om Nom Event",
    video: "/videos/om-nom-event.mp4",
    videoType: "MP4",
  },
  {
    id: 5,
    category: "Business Promotions",
    title: "Gujarat No Rankar",
    video: "/videos/gujrat-no-rankar.mp4",
    videoType: "MP4",
  },
  {
    id: 6,
    category: "Podcasts",
    title: "Asmita Reel",
    video: "/videos/asmita-reel.mp4",
    videoType: "MP4",
  },
  {
    id: 7,
    category: "Events",
    title: "Panchmasi Event",
    video: "/videos/panchmasi.mp4",
    videoType: "MP4",
  },
  {
    id: 8,
    category: "Business Promotions",
    title: "Jatin Woodman",
    video: "/videos/IMG_2382.mp4",
    thumbnail: "/videos/IMG_2382-thumb.jpg",
    videoType: "MP4",
  },
  {
    id: 9,
    category: "Restaurants",
    title: "Royals Handi Restaurant",
    video: "/videos/royals-handi.mp4",
    videoType: "MP4",
  },
];

const standardCategories = [
  "All",
  "Restaurants",
  "Events",
  "Business Promotions",
  "Podcasts",
];

function ReelCard({ reel, onPlay, onVideoError }) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // Local /videos/ files must never be hidden
    if (reel.video && (reel.video.startsWith('/videos/') || !reel.video.startsWith('http'))) {
      return;
    }
    setHasError(true);
    if (onVideoError) {
      onVideoError(reel.id);
    }
  };

  if (hasError) return null;

  const isDirectVideo = reel.videoType === "MP4" || (!reel.videoType && reel.video?.endsWith(".mp4"));

  return (
    <article className="reel-card">
      {/* VIDEO AREA */}
      <div className="reel-media">
        {isDirectVideo ? (
          <video
            src={reel.video}
            poster={reel.thumbnail}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="reel-video"
            onError={handleError}
          />
        ) : (
          <img
            src={reel.thumbnail || "/videos/hero-artish-poster.webp"}
            alt={reel.title}
            className="reel-video object-cover"
            onError={handleError}
          />
        )}

        {/* Dark bottom gradient */}
        <div className="reel-gradient" />

        {/* Category Badge */}
        <div className="reel-category">
          {reel.category.toUpperCase()}
        </div>

        {/* Play Button */}
        <button
          className="reel-play"
          onClick={() => onPlay(reel)}
          aria-label="Play video"
        >
          <svg
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginLeft: "2px" }}
          >
            <path
              d="M17 10L1 1V19L17 10Z"
              fill="#101946"
              stroke="#101946"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* FOOTER */}
      <a
        href="https://www.instagram.com/artish.uk"
        target="_blank"
        rel="noopener noreferrer"
        className="reel-footer"
      >
        <span>View on Instagram</span>
        <span className="reel-footer-icon">↗</span>
      </a>
    </article>
  );
}

export default function RecentReelsSection() {
  const [reelsList, setReelsList] = useState(defaultReels);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedReel, setSelectedReel] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedVideoIds, setFailedVideoIds] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(4);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPublicReels = async () => {
      try {
        const res = await API.get('/videos/public');
        if (isMounted && Array.isArray(res.data)) {
          if (res.data.length > 0) {
            const mapped = res.data.map((v) => ({
              id: v.id,
              category: v.category || 'Restaurants',
              title: v.title,
              video: getAssetUrl(v.videoUrl),
              thumbnail: v.thumbnailUrl ? getAssetUrl(v.thumbnailUrl) : null,
              videoType: v.videoType || 'MP4',
              rawUrl: v.videoUrl,
              displayOrder: v.displayOrder !== undefined ? v.displayOrder : 99,
            }));
            setReelsList(mapped);
          } else {
            setReelsList([]);
          }
        }
      } catch (err) {
        // Silently preserve defaultReels on network or API error
      }
    };
    fetchPublicReels();
    window.addEventListener('artish:videos-updated', fetchPublicReels);
    window.addEventListener('focus', fetchPublicReels);
    return () => {
      isMounted = false;
      window.removeEventListener('artish:videos-updated', fetchPublicReels);
      window.removeEventListener('focus', fetchPublicReels);
    };
  }, []);

  const categories = useMemo(() => {
    const list = [...standardCategories];
    reelsList.forEach((r) => {
      if (r.category && !list.includes(r.category)) {
        list.push(r.category);
      }
    });
    return list;
  }, [reelsList]);

  // Handle Video Error gracefully
  const handleVideoError = (id) => {
    setFailedVideoIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Filter valid reels (ensuring original /videos/ are never filtered out)
  const validReels = useMemo(() => {
    return reelsList.filter(
      (reel) => reel.video && (!failedVideoIds.has(reel.id) || reel.video.startsWith('/videos/'))
    );
  }, [reelsList, failedVideoIds]);

  // Filter reels according to active category
  const filteredReels = useMemo(() => {
    if (activeCategory === "All") {
      return validReels;
    }
    return validReels.filter((reel) => reel.category === activeCategory);
  }, [activeCategory, validReels]);

  // Handle screen resize for responsive visible card count
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1200) {
        setVisibleCards(4);
      } else if (w >= 900) {
        setVisibleCards(3);
      } else if (w >= 600) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate maximum index for carousel offset
  const maxIndex = useMemo(() => {
    if (filteredReels.length <= visibleCards) {
      return 0;
    }
    return filteredReels.length - visibleCards;
  }, [filteredReels.length, visibleCards]);

  // Reset index when category or visibleCards change
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, visibleCards]);

  // Auto-advance carousel
  useEffect(() => {
    if (isHovered || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isHovered, maxIndex, currentIndex]);

  // Manual navigation handlers
  const handlePrev = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe handlers for mobile/tablet
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
  };

  // Escape key handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedReel(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Card dimensions & track calculations
  const CARD_WIDTH = 250;
  const CARD_GAP = 20;
  const STEP_SIZE = CARD_WIDTH + CARD_GAP;

  const isCenteredLayout = filteredReels.length <= visibleCards;

  return (
    <section id="reels" className="recent-reels-section">
      <span id="portfolio" className="sr-only" />
      <div className="recent-reels-container">
        {/* HEADER */}
        <div className="recent-reels-header">
          <div className="recent-reels-header-text">
            <h2>Recent client reels</h2>
            <p>
              A taste of the short-form content we make for clients every week.
            </p>
          </div>

          <a
            href="https://www.instagram.com/artish.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-button"
          >
            Follow @artish.uk on Instagram
          </a>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="category-buttons-wrapper">
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-button ${
                  activeCategory === category ? "active" : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* CAROUSEL */}
        <div
          className="carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Arrow Left */}
          {maxIndex > 0 && (
            <button
              className="carousel-arrow left"
              onClick={handlePrev}
              aria-label="Previous reels"
            >
              ‹
            </button>
          )}

          {/* Window */}
          <div
            className={`carousel-window ${
              isCenteredLayout ? "centered-window" : ""
            }`}
          >
            <div
              className={`carousel-track ${
                isCenteredLayout ? "centered-track" : ""
              }`}
              style={
                !isCenteredLayout
                  ? {
                      transform: `translateX(-${currentIndex * STEP_SIZE}px)`,
                    }
                  : undefined
              }
            >
              {filteredReels.map((reel) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onPlay={setSelectedReel}
                  onVideoError={handleVideoError}
                />
              ))}
            </div>
          </div>

          {/* Arrow Right */}
          {maxIndex > 0 && (
            <button
              className="carousel-arrow right"
              onClick={handleNext}
              aria-label="Next reels"
            >
              ›
            </button>
          )}
        </div>

        {/* DOT INDICATORS */}
        {filteredReels.length > 0 && (
          <div className="carousel-dots">
            {isCenteredLayout ? (
              <button className="carousel-dot active" aria-label="Single view" />
            ) : (
              Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${
                    index === currentIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to reel slide ${index + 1}`}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* VIDEO MODAL */}
      {selectedReel && (
        <div
          className="video-modal"
          onClick={() => setSelectedReel(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-close"
              onClick={() => setSelectedReel(null)}
              aria-label="Close video"
            >
              ×
            </button>

            {selectedReel.videoType === 'YOUTUBE' || selectedReel.videoType === 'YOUTUBE_SHORTS' ? (
              <div className="w-full max-w-[420px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={getYouTubeEmbedUrl(selectedReel.rawUrl || selectedReel.video)}
                  title={selectedReel.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : selectedReel.videoType === 'INSTAGRAM' ? (
              <div className="w-full max-w-[400px] bg-[#101946] text-white p-6 rounded-3xl border border-[#252B62] shadow-2xl text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-white">{selectedReel.title}</h3>
                <p className="text-xs text-gray-300">
                  This reel is hosted on Instagram. Tap below to watch the original video on Instagram.
                </p>
                <div className="pt-2">
                  <a
                    href={selectedReel.rawUrl || selectedReel.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#B8FF00] hover:bg-[#a5e600] text-[#101946] font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-md"
                  >
                    <span>Watch on Instagram</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ) : (
              <video
                src={selectedReel.video}
                poster={selectedReel.thumbnail}
                controls
                autoPlay
                playsInline
                className="modal-video"
              />
            )}
          </div>
        </div>
      )}

      {/* CSS STYLES */}
      <style>{`
        /* SECTION & CONTAINER */
        .recent-reels-section {
          width: 100%;
          background: #F7F8FA;
          padding: 80px 0;
          overflow: hidden;
          font-family: inherit;
          border-bottom: 1px solid #E2E8F0;
        }

        .recent-reels-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* HEADER */
        .recent-reels-header {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 36px;
        }

        .recent-reels-header-text {
          max-width: 700px;
          text-align: left;
        }

        .recent-label {
          display: inline-block;
          padding: 6px 14px;
          border: 1px solid #E2E8F0;
          border-radius: 999px;
          background: #FFFFFF;
          color: #101946;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .recent-reels-header h2 {
          margin: 14px 0 8px;
          color: #101946;
          font-size: 40px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .recent-reels-header p {
          margin: 0;
          color: #64748B;
          font-size: 16px;
          line-height: 1.5;
        }

        /* INSTAGRAM BUTTON */
        .instagram-button {
          padding: 12px 24px;
          border: 1px solid #E2E8F0;
          border-radius: 999px;
          background: #FFFFFF;
          color: #101946;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(16, 25, 70, 0.04);
        }

        .instagram-button:hover {
          background: #101946;
          color: #B8FF00;
          border-color: #101946;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 25, 70, 0.15);
        }

        /* CATEGORY BUTTONS */
        .category-buttons-wrapper {
          width: 100%;
          margin-bottom: 40px;
        }

        .category-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 10px;
        }

        .category-button {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #101946;
          padding: 10px 22px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .category-button:hover {
          border-color: #101946;
          transform: translateY(-1px);
        }

        .category-button.active {
          background: #101946;
          color: #B8FF00;
          border-color: #101946;
          box-shadow: 0 4px 14px rgba(16, 25, 70, 0.25);
        }

        /* CAROUSEL WRAPPER & WINDOW */
        .carousel-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-window {
          width: 1060px; /* 4 cards * 250px + 3 gaps * 20px */
          max-width: 100%;
          overflow: hidden;
          padding: 12px 0;
        }

        .carousel-window.centered-window {
          overflow: visible;
        }

        .carousel-track {
          display: flex;
          gap: 20px;
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          width: max-content;
        }

        .carousel-track.centered-track {
          justify-content: center;
          width: 100%;
          transform: none !important;
          flex-wrap: wrap;
        }

        /* REEL CARD */
        .reel-card {
          width: 250px;
          height: 440px;
          flex-shrink: 0;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          box-shadow: 0 10px 30px rgba(16, 25, 70, 0.06);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .reel-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px rgba(16, 25, 70, 0.14);
        }

        /* VIDEO AREA */
        .reel-media {
          position: relative;
          width: 100%;
          height: 396px;
          overflow: hidden;
          background: #101946;
        }

        .reel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .reel-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.02) 40%,
            rgba(16, 25, 70, 0.92) 100%
          );
          pointer-events: none;
        }

        /* CATEGORY BADGE */
        .reel-category {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          padding: 4px 10px;
          border-radius: 999px;
          background: #B8FF00;
          color: #101946;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.06em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        /* PLAY BUTTON */
        .reel-play {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 54px;
          height: 54px;
          transform: translate(-50%, -50%);
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          background: #B8FF00;
          color: #101946;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(184, 255, 0, 0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .reel-play:hover {
          transform: translate(-50%, -50%) scale(1.12);
          box-shadow: 0 10px 28px rgba(184, 255, 0, 0.6);
        }

        /* INFO (VIEWS) */
        .reel-info {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          z-index: 2;
          text-align: left;
        }

        .reel-views {
          color: #B8FF00;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
        }

        /* FOOTER */
        .reel-footer {
          height: 44px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          color: #101946;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          border-top: 1px solid #E2E8F0;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .reel-footer:hover {
          background: #F7F8FA;
          color: #101946;
        }

        .reel-footer-icon {
          font-size: 13px;
          font-weight: 700;
        }

        /* ARROWS */
        .carousel-arrow {
          position: absolute;
          z-index: 10;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E2E8F0;
          border-radius: 50%;
          background: #FFFFFF;
          color: #101946;
          font-size: 24px;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 25, 70, 0.08);
          transition: all 0.25s ease;
        }

        .carousel-arrow:hover {
          background: #101946;
          color: #B8FF00;
          border-color: #101946;
          transform: scale(1.08);
        }

        .carousel-arrow.left {
          left: -22px;
        }

        .carousel-arrow.right {
          right: -22px;
        }

        /* DOTS */
        .carousel-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: #CBD5E1;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .carousel-dot.active {
          width: 26px;
          border-radius: 999px;
          background: #101946;
        }

        /* VIDEO MODAL */
        .video-modal {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(16, 25, 70, 0.88);
          backdrop-filter: blur(8px);
        }

        .video-modal-content {
          position: relative;
          max-width: 420px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .modal-video {
          width: 100%;
          max-height: 80vh;
          border-radius: 20px;
          background: #000000;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          object-fit: contain;
        }

        .video-close {
          position: absolute;
          top: -48px;
          right: 0;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .video-close:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1200px) {
          .carousel-window {
            width: 790px; /* 3 cards * 250px + 2 gaps * 20px */
          }
          .carousel-arrow.left {
            left: 0;
          }
          .carousel-arrow.right {
            right: 0;
          }
        }

        @media (max-width: 900px) {
          .carousel-window {
            width: 520px; /* 2 cards * 250px + 1 gap * 20px */
          }
        }

        @media (max-width: 768px) {
          .recent-reels-section {
            padding: 50px 0;
          }

          .recent-reels-container {
            padding: 0 20px;
          }

          .recent-reels-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 28px;
          }

          .recent-reels-header h2 {
            font-size: 30px;
          }

          .instagram-button {
            width: auto;
          }

          .category-buttons-wrapper {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: 4px;
          }

          .category-buttons-wrapper::-webkit-scrollbar {
            display: none;
          }

          .category-buttons {
            flex-wrap: nowrap;
            white-space: nowrap;
          }

          .category-button {
            flex-shrink: 0;
          }
        }

        @media (max-width: 600px) {
          .carousel-window {
            width: 250px; /* 1 card */
          }

          .carousel-arrow {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}