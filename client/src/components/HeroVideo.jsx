import React, { useState, useEffect, useRef } from 'react';

/**
 * HeroVideo Component
 * Provides a high-performance, accessible, cinematic video background with poster fallback,
 * reduced-motion handling, mobile/desktop video switching, dark navy gradient overlay,
 * and a subtle progress indicator.
 */
export const HeroVideo = ({
  desktopSrc = '/videos/hero-artish.mp4',
  mobileSrc = '/videos/hero-artish-mobile.mp4',
  posterSrc = '/videos/hero-artish-poster.webp',
  enabled = true,
  onVideoLoaded,
}) => {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Detect screen size for video source selection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeSrc = isMobile && mobileSrc ? mobileSrc : desktopSrc;

  // Track video progress
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleLoadedData = () => {
    setIsVideoLoaded(true);
    if (onVideoLoaded) onVideoLoaded();
  };

  const handleError = () => {
    // If mobile src fails, fall back to desktop src before giving up to poster
    if (isMobile && activeSrc === mobileSrc && desktopSrc !== mobileSrc) {
      if (videoRef.current) {
        videoRef.current.src = desktopSrc;
        videoRef.current.load();
      }
    } else {
      setVideoError(true);
    }
  };

  const shouldPlayVideo = enabled && !videoError && !prefersReducedMotion;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#101946]">
      {/* Background Poster / Fallback Gradient */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
          shouldPlayVideo && isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backgroundImage: posterSrc ? `url(${posterSrc}), linear-gradient(135deg, #101946 0%, #0A0D28 100%)` : 'linear-gradient(135deg, #101946 0%, #0A0D28 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* HTML5 Video Layer */}
      {shouldPlayVideo && (
        <>
          {/* Subtle Ambient Blurred Backdrop for Cinematic Depth */}
          <video
            className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-105 pointer-events-none transform -translate-y-0"
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            src={activeSrc}
          />

          {/* Primary Foreground Video */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
            onError={handleError}
          >
            <source src={activeSrc} type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>
        </>
      )}

      {/* Video Progress Line at Bottom */}
      {shouldPlayVideo && isVideoLoaded && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden pointer-events-none">
          <div
            className="h-full bg-[#B8FF00] transition-all duration-200 ease-linear shadow-[0_0_8px_#B8FF00]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default HeroVideo;
