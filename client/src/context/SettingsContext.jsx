import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    business_name: 'Artish UK',
    business_email: 'artish.uk.2003@gmail.com',
    instagram_url: 'https://www.instagram.com/artish.uk',
    youtube_url: 'https://youtube.com/@artishmedia?si=YzOlivVPhrB2GO8h',
    facebook_url: 'https://www.facebook.com/profile.php?id=61590765263393#',
    tiktok_url: 'https://www.tiktok.com/@artish711',
    phone: '',
    whatsapp_url: '',
    location: 'United Kingdom · Serving nationwide',
    hero_badge: 'UK Digital Marketing & Content Agency',
    hero_title: 'Content that brings customers.',
    hero_subtext: 'We help restaurants, events and small businesses grow through powerful content, social media marketing and creative storytelling.',
    about_heading: 'Meet Artish UK',
    about_text_1: 'Artish UK helps businesses attract customers through professional content creation, social media management, video production and digital marketing.',
    about_text_2: 'We believe every business has a story worth sharing — and every story deserves to be seen.',
    about_text_3: 'Our mission is to create content that drives awareness, engagement and growth.',
    about_years_badge: '3+ yrs IN THE FIELD',
    stat_projects: '50+',
    stat_views: '100K+',
    stat_businesses: '25+',
    stat_satisfaction: '95%',
    hero_video_desktop: '/videos/hero-artish.mp4',
    hero_video_mobile: '/videos/hero-artish-mobile.mp4',
    hero_video_poster: '/videos/hero-artish-poster.webp',
    hero_video_enabled: 'true',
    hero_instagram_url: 'https://www.instagram.com/reel/DWLr2APKmoT/?igsi=endoampra2FyZ3cw',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/settings');
      if (res.data && Object.keys(res.data).length > 0) {
        setSettings((prev) => ({ ...prev, ...res.data }));
      }
    } catch (error) {
      console.warn('Failed to load dynamic site settings from backend:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
