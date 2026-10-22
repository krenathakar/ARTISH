import React from 'react';
import {
  Camera,
  Share2,
  Video,
  Mic,
  Calendar,
  Globe,
  Megaphone,
  Palette,
  Sparkles,
  Zap,
  CheckCircle,
  Users,
  Award,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Star,
  Check
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TiktokIcon } from '../components/BrandIcons';

const iconMap = {
  Camera,
  Share2,
  Video,
  Mic,
  Calendar,
  Globe,
  Megaphone,
  Palette,
  Sparkles,
  Zap,
  CheckCircle,
  Users,
  Award,
  Clock,
  Instagram: InstagramIcon,
  Youtube: YoutubeIcon,
  Facebook: FacebookIcon,
  TikTok: TiktokIcon,
  Tiktok: TiktokIcon,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Star,
  Check
};

export const RenderIcon = ({ name, className = "w-6 h-6", defaultIcon = Camera }) => {
  const IconComponent = iconMap[name] || defaultIcon;
  return <IconComponent className={className} />;
};

export default iconMap;
