import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  FolderKanban,
  Users,
  Quote,
  HelpCircle,
  Settings,
  Image as ImageIcon,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  Check,
  X,
  ExternalLink,
  Upload,
  Loader2,
  ChevronRight,
  Filter,
  Video,
  Play,
  Film
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import API, { getAssetUrl } from '../services/api';
import { detectVideoType, getYouTubeEmbedUrl } from '../utils/videoUtils';

// Canonical existing reels to guarantee display in Admin Panel even during load or offline
const DEFAULT_EXISTING_VIDEOS = [
  { id: 1, title: 'Shayona Restaurant', category: 'Restaurants', videoUrl: '/videos/shayona-first.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 1, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, title: 'Harsh & Jatin', category: 'Events', videoUrl: '/videos/harsh-jatin.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 2, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 3, title: 'GJ 05', category: 'Restaurants', videoUrl: '/videos/gj05.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 3, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 4, title: 'Om Nom Event', category: 'Events', videoUrl: '/videos/om-nom-event.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 4, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 5, title: 'Gujarat No Rankar', category: 'Business Promotions', videoUrl: '/videos/gujrat-no-rankar.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 5, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 6, title: 'Asmita Reel', category: 'Podcasts', videoUrl: '/videos/asmita-reel.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 6, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 7, title: 'Panchmasi Event', category: 'Events', videoUrl: '/videos/panchmasi.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 7, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 8, title: 'Jatin Woodman', category: 'Business Promotions', videoUrl: '/videos/IMG_2382.mp4', thumbnailUrl: '/videos/IMG_2382-thumb.jpg', videoType: 'MP4', status: 'PUBLISHED', displayOrder: 8, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 9, title: 'Royals Handi Restaurant', category: 'Restaurants', videoUrl: '/videos/royals-handi.mp4', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 9, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 14, title: 'Harsh', category: 'Events', videoUrl: 'https://drive.google.com/file/d/1SZjpxzAnvKCannOcgXp3V1SdSzm_OfFN/view?usp=sharing', thumbnailUrl: null, videoType: 'MP4', status: 'PUBLISHED', displayOrder: 10, createdAt: '2026-01-01T00:00:00.000Z' },
];

export const AdminDashboardPage = () => {
  const { admin, logout, loading: authLoading } = useAuth();
  const { settings, refreshSettings } = useSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Data States
  const [enquiries, setEnquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [clients, setClients] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [videos, setVideos] = useState(DEFAULT_EXISTING_VIDEOS);

  // Modals & Form States
  const [modalType, setModalType] = useState(null); // 'service', 'portfolio', 'client', 'testimonial', 'faq', 'video', 'enquiryNotes'
  const [editingItem, setEditingItem] = useState(null);
  const [formInput, setFormInput] = useState({});
  const [settingsInput, setSettingsInput] = useState({ ...settings });

  // Filter States
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [videoSearch, setVideoSearch] = useState('');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState('');
  const [videoStatusFilter, setVideoStatusFilter] = useState('');
  const [previewVideo, setPreviewVideo] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState(null);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      loadAllData();
    }
  }, [admin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [enqRes, srvRes, portRes, cliRes, testRes, faqRes, medRes, vidRes] = await Promise.all([
        API.get('/enquiries').catch(() => ({ data: [] })),
        API.get('/services?all=true').catch(() => ({ data: [] })),
        API.get('/portfolio?all=true').catch(() => ({ data: [] })),
        API.get('/clients?all=true').catch(() => ({ data: [] })),
        API.get('/testimonials?all=true').catch(() => ({ data: [] })),
        API.get('/faqs?all=true').catch(() => ({ data: [] })),
        API.get('/media').catch(() => ({ data: [] })),
        API.get('/videos').catch(() => ({ data: [] })),
      ]);

      setEnquiries(enqRes.data || []);
      setServices(srvRes.data || []);
      setPortfolio(portRes.data || []);
      setClients(cliRes.data || []);
      setTestimonials(testRes.data || []);
      setFaqs(faqRes.data || []);
      setMediaList(medRes.data || []);

      if (vidRes.data && Array.isArray(vidRes.data)) {
        if (vidRes.data.length > 0) {
          const sortedVideos = [...vidRes.data].sort(
            (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
          );
          setVideos(sortedVideos);
        } else {
          setVideos([]);
        }
      } else {
        setVideos(DEFAULT_EXISTING_VIDEOS);
      }

      setSettingsInput({ ...settings });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // --- ENQUIRY ACTIONS ---
  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      await API.put(`/enquiries/${id}`, { status });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      showToast('Enquiry status updated');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await API.delete(`/enquiries/${id}`);
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        showToast('Enquiry deleted');
      } catch (err) {
        alert('Failed to delete enquiry');
      }
    }
  };

  // --- SERVICE CRUD ---
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await API.put(`/services/${editingItem.id}`, formInput);
        setServices((prev) => prev.map((s) => (s.id === editingItem.id ? res.data : s)));
        showToast('Service updated');
      } else {
        const res = await API.post('/services', formInput);
        setServices((prev) => [...prev, res.data]);
        showToast('Service created');
      }
      setModalType(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving service');
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await API.delete(`/services/${id}`);
        setServices((prev) => prev.filter((s) => s.id !== id));
        showToast('Service deleted');
      } catch (err) {
        alert('Error deleting service');
      }
    }
  };

  // --- PORTFOLIO CRUD ---
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await API.put(`/portfolio/${editingItem.id}`, formInput);
        setPortfolio((prev) => prev.map((p) => (p.id === editingItem.id ? res.data : p)));
        showToast('Portfolio project updated');
      } else {
        const res = await API.post('/portfolio', formInput);
        setPortfolio((prev) => [...prev, res.data]);
        showToast('Portfolio project created');
      }
      setModalType(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving portfolio');
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await API.delete(`/portfolio/${id}`);
        setPortfolio((prev) => prev.filter((p) => p.id !== id));
        showToast('Portfolio project deleted');
      } catch (err) {
        alert('Error deleting portfolio');
      }
    }
  };

  // --- CLIENT CRUD ---
  const handleSaveClient = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await API.put(`/clients/${editingItem.id}`, formInput);
        setClients((prev) => prev.map((c) => (c.id === editingItem.id ? res.data : c)));
        showToast('Client updated');
      } else {
        const res = await API.post('/clients', formInput);
        setClients((prev) => [...prev, res.data]);
        showToast('Client created');
      }
      setModalType(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving client');
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Delete this client?')) {
      try {
        await API.delete(`/clients/${id}`);
        setClients((prev) => prev.filter((c) => c.id !== id));
        showToast('Client deleted');
      } catch (err) {
        alert('Error deleting client');
      }
    }
  };

  // --- TESTIMONIAL CRUD ---
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await API.put(`/testimonials/${editingItem.id}`, formInput);
        setTestimonials((prev) => prev.map((t) => (t.id === editingItem.id ? res.data : t)));
        showToast('Testimonial updated');
      } else {
        const res = await API.post('/testimonials', formInput);
        setTestimonials((prev) => [...prev, res.data]);
        showToast('Testimonial created');
      }
      setModalType(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving testimonial');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await API.delete(`/testimonials/${id}`);
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        showToast('Testimonial deleted');
      } catch (err) {
        alert('Error deleting testimonial');
      }
    }
  };

  // --- FAQ CRUD ---
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await API.put(`/faqs/${editingItem.id}`, formInput);
        setFaqs((prev) => prev.map((f) => (f.id === editingItem.id ? res.data : f)));
        showToast('FAQ updated');
      } else {
        const res = await API.post('/faqs', formInput);
        setFaqs((prev) => [...prev, res.data]);
        showToast('FAQ created');
      }
      setModalType(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving FAQ');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      try {
        await API.delete(`/faqs/${id}`);
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        showToast('FAQ deleted');
      } catch (err) {
        alert('Error deleting FAQ');
      }
    }
  };

  // --- VIDEO CRUD ---
  const refreshVideos = async () => {
    try {
      const vidRes = await API.get('/videos');
      if (vidRes.data && Array.isArray(vidRes.data)) {
        const sortedVideos = [...vidRes.data].sort(
          (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
        );
        setVideos(sortedVideos);
      }
    } catch (err) {
      console.warn('Error refreshing videos:', err.message);
    }
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!formInput.title || !formInput.title.trim()) {
      alert('Video title is required');
      return;
    }
    if (!formInput.videoUrl || !formInput.videoUrl.trim()) {
      alert('Video URL is required');
      return;
    }
    try {
      if (editingItem) {
        const res = await API.put(`/videos/${editingItem.id}`, formInput);
        setVideos((prev) => prev.map((v) => (v.id === editingItem.id ? res.data : v)));
        showToast('Video updated successfully');
      } else {
        const res = await API.post('/videos', formInput);
        setVideos((prev) => [...prev, res.data]);
        showToast('Video created successfully');
      }
      setModalType(null);
      await refreshVideos();
      window.dispatchEvent(new Event('artish:videos-updated'));
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving video');
    }
  };

  const handleToggleVideoStatus = async (id) => {
    try {
      const res = await API.patch(`/videos/${id}/status`, {});
      setVideos((prev) => prev.map((v) => (v.id === id ? res.data : v)));
      showToast(`Video marked as ${res.data.status}`);
      await refreshVideos();
      window.dispatchEvent(new Event('artish:videos-updated'));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update video status');
    }
  };

  const handleDeleteVideo = (video) => {
    setDeleteConfirmVideo(video);
  };

  const confirmDeleteVideo = async () => {
    if (!deleteConfirmVideo) return;
    setIsDeletingVideo(true);
    try {
      await API.delete(`/videos/${deleteConfirmVideo.id}`);
      setVideos((prev) => prev.filter((v) => v.id !== deleteConfirmVideo.id));
      showToast(`Video "${deleteConfirmVideo.title}" deleted`);
      setDeleteConfirmVideo(null);
      await refreshVideos();
      window.dispatchEvent(new Event('artish:videos-updated'));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting video');
    } finally {
      setIsDeletingVideo(false);
    }
  };

  const handleVideoThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await API.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormInput((prev) => ({ ...prev, thumbnailUrl: res.data.url }));
      showToast('Thumbnail uploaded successfully');
    } catch (err) {
      alert('Failed to upload thumbnail image');
    }
  };

  const handleDirectVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      alert('Video file size exceeds 500MB. Please select a smaller video or compress it.');
      return;
    }

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormInput((prev) => ({
        ...prev,
        videoUrl: res.data.url,
        videoType: 'MP4',
      }));
      showToast('MP4 video uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload MP4 video file');
    } finally {
      setUploadingVideo(false);
    }
  };

  // --- SITE SETTINGS SAVE ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await API.put('/settings', settingsInput);
      await refreshSettings();
      showToast('Site settings updated successfully!');
    } catch (err) {
      alert('Failed to update site settings');
    }
  };

  // --- MEDIA UPLOAD ---
  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMediaList((prev) => [res.data, ...prev]);
      showToast('Media uploaded');
    } catch (err) {
      alert('Media upload failed');
    }
  };

  const handleDeleteMedia = async (id) => {
    if (window.confirm('Delete this media asset?')) {
      try {
        await API.delete(`/media/${id}`);
        setMediaList((prev) => prev.filter((m) => m.id !== id));
        showToast('Media deleted');
      } catch (err) {
        alert('Failed to delete media');
      }
    }
  };

  if (authLoading || !admin) {
    return (
      <div className="min-h-screen bg-[#101946] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8FF00]" />
      </div>
    );
  }

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = enquiryStatusFilter ? e.status === enquiryStatusFilter : true;
    const matchesSearch = enquirySearch
      ? e.fullName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        e.businessName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
        e.email.toLowerCase().includes(enquirySearch.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const filteredVideos = videos.filter((v) => {
    const matchesStatus = videoStatusFilter ? v.status === videoStatusFilter : true;
    const matchesCategory = videoCategoryFilter ? v.category === videoCategoryFilter : true;
    const matchesSearch = videoSearch
      ? v.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(videoSearch.toLowerCase()))
      : true;
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'NEW').length;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex text-[#101946]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-[#101946] text-[#B8FF00] font-extrabold px-6 py-3.5 rounded-2xl shadow-2xl border border-[#B8FF00]/40 flex items-center gap-3 animate-fadeIn">
          <Check className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-[#101946] text-white flex flex-col justify-between p-6 shrink-0 border-r border-[#252B62]">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/artish-logo.png" alt="Artish logo" className="h-9 w-auto" />
            <span className="font-extrabold text-[#B8FF00] text-[10px] uppercase tracking-widest bg-[#171B4B] px-2 py-1 rounded border border-[#252B62]">
              ADMIN
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'enquiries', label: `Enquiries (${newEnquiriesCount})`, icon: MessageSquare, badge: newEnquiriesCount > 0 },
              { id: 'services', label: 'Services', icon: Sparkles },
              { id: 'videos', label: 'Videos / Reels', icon: Video },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'testimonials', label: 'Testimonials', icon: Quote },
              { id: 'settings', label: 'Site Settings', icon: Settings },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#B8FF00] text-[#101946] font-bold shadow-md'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-6 border-t border-[#252B62]">
          <div className="mb-4">
            <p className="text-xs text-gray-400 font-semibold">Signed in as</p>
            <p className="text-sm font-bold truncate text-white">{admin.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#171B4B] hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-[#252B62] py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-[#101946]" />
            <span>Syncing database...</span>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 text-left">
            <div>
              <h1 className="text-3xl font-extrabold text-[#101946]">Dashboard Overview</h1>
              <p className="text-sm text-[#64748B]">Key operational metrics and recent consultation leads.</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {[
                { label: 'Total Enquiries', val: enquiries.length, color: 'border-l-4 border-blue-500' },
                { label: 'New Leads', val: newEnquiriesCount, color: 'border-l-4 border-[#B8FF00]' },
                { label: 'Services', val: services.length, color: 'border-l-4 border-purple-500' },
                { label: 'Videos / Reels', val: videos.length, color: 'border-l-4 border-rose-500' },
                { label: 'Portfolio', val: portfolio.length, color: 'border-l-4 border-emerald-500' },
                { label: 'Clients', val: clients.length, color: 'border-l-4 border-amber-500' },
                { label: 'Testimonials', val: testimonials.length, color: 'border-l-4 border-indigo-500' },
              ].map((m) => (
                <div key={m.label} className={`bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm ${m.color}`}>
                  <p className="text-xs font-bold text-[#64748B] uppercase">{m.label}</p>
                  <p className="text-3xl font-black text-[#101946] mt-1">{m.val}</p>
                </div>
              ))}
            </div>

            {/* Recent Enquiries Table */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-[#101946]">Recent Consultation Enquiries</h3>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs font-bold text-[#101946] hover:underline flex items-center gap-1"
                >
                  View All ({enquiries.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {enquiries.length === 0 ? (
                <p className="text-sm text-[#64748B] py-8 text-center">No enquiries received yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-xs font-bold uppercase text-[#64748B]">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Business</th>
                        <th className="pb-3">Service</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {enquiries.slice(0, 5).map((e) => (
                        <tr key={e.id} className="hover:bg-[#F7F8FA]">
                          <td className="py-3.5 font-bold text-[#101946]">{e.fullName}</td>
                          <td className="py-3.5 text-[#64748B]">{e.businessName}</td>
                          <td className="py-3.5"><span className="bg-[#E2E8F0] px-2.5 py-1 rounded-md text-xs font-bold text-[#101946]">{e.service}</span></td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                              e.status === 'NEW' ? 'bg-amber-100 text-amber-800' :
                              e.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800' :
                              e.status === 'CONVERTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                            }`}>{e.status}</span>
                          </td>
                          <td className="py-3.5 text-xs text-[#64748B]">{new Date(e.createdAt).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Consultation Enquiries</h1>
                <p className="text-sm text-[#64748B]">Manage customer leads and change status pipeline.</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2 text-xs text-[#101946] focus:outline-none"
                  />
                </div>

                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#101946] font-bold focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm overflow-x-auto">
              {filteredEnquiries.length === 0 ? (
                <p className="text-sm text-[#64748B] py-8 text-center">No enquiries matching filter.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-xs font-bold uppercase text-[#64748B]">
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Message</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredEnquiries.map((e) => (
                      <tr key={e.id} className="hover:bg-[#F7F8FA]">
                        <td className="py-4 font-bold text-[#101946]">
                          <div>{e.fullName}</div>
                          <div className="text-xs font-normal text-[#64748B]">{e.businessName}</div>
                        </td>
                        <td className="py-4 text-xs">
                          <div><a href={`mailto:${e.email}`} className="text-blue-600 font-semibold hover:underline">{e.email}</a></div>
                          {e.phone && (
                            <div>
                              <a href={`tel:${e.phone.replace(/[^0-9+]/g, '')}`} className="text-[#64748B] hover:text-blue-600 font-medium">
                                {e.phone}
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="py-4">
                          <span className="bg-[#101946] text-[#B8FF00] text-xs font-bold px-2.5 py-1 rounded-md">
                            {e.service}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-[#64748B] max-w-xs truncate" title={e.message}>
                          {e.message}
                        </td>
                        <td className="py-4">
                          <select
                            value={e.status}
                            onChange={(evt) => handleUpdateEnquiryStatus(e.id, evt.target.value)}
                            className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-lg px-2 py-1 text-xs font-extrabold text-[#101946] focus:outline-none"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleDeleteEnquiry(e.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Manage Services</h1>
                <p className="text-sm text-[#64748B]">Add or update service cards displayed on the homepage.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormInput({ title: '', description: '', icon: 'Camera', sortOrder: services.length + 1, isActive: true });
                  setModalType('service');
                }}
                className="inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#171B4B]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[#B8FF00] bg-[#101946] px-3 py-1 rounded-md">{s.icon}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                        {s.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#101946] mb-2">{s.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed mb-4">{s.description}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => {
                        setEditingItem(s);
                        setFormInput({ ...s });
                        setModalType('service');
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteService(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS / REELS TAB */}
        {activeTab === 'videos' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Videos & Upcoming Reels Management</h1>
                <p className="text-sm text-[#64748B]">
                  Upload upcoming client reels, add YouTube/Shorts/Instagram links, and manage content displayed on the public site.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormInput({
                    title: '',
                    description: '',
                    videoUrl: '',
                    thumbnailUrl: '',
                    category: 'Restaurants',
                    videoType: 'AUTO',
                    status: 'PUBLISHED',
                    displayOrder: videos.length + 1,
                    featured: false,
                  });
                  setModalType('video');
                }}
                className="inline-flex items-center gap-2 bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Upload Upcoming Reel</span>
              </button>
            </div>

            {/* Video Dashboard Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs border-l-4 border-[#101946]">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Reels</p>
                <p className="text-3xl font-black text-[#101946] mt-1">{videos.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs border-l-4 border-emerald-500">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Published Reels</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {videos.filter((v) => v.status === 'PUBLISHED').length}
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs border-l-4 border-amber-500">
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Draft / Upcoming</p>
                <p className="text-3xl font-black text-amber-600 mt-1">
                  {videos.filter((v) => v.status === 'DRAFT').length}
                </p>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos by title..."
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-[#101946] focus:outline-none focus:border-[#101946]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <select
                  value={videoCategoryFilter}
                  onChange={(e) => setVideoCategoryFilter(e.target.value)}
                  className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold text-[#101946] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Restaurants">Restaurants</option>
                  <option value="Events">Events</option>
                  <option value="Podcasts">Podcasts</option>
                  <option value="Business Promotions">Business Promotions</option>
                </select>

                {/* Status Filter */}
                <select
                  value={videoStatusFilter}
                  onChange={(e) => setVideoStatusFilter(e.target.value)}
                  className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold text-[#101946] focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="PUBLISHED">Published Only</option>
                  <option value="DRAFT">Drafts Only</option>
                </select>
              </div>
            </div>

            {/* Videos Table */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm overflow-x-auto">
              {filteredVideos.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Film className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-[#64748B]">No videos match your current filter.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-xs font-bold uppercase text-[#64748B]">
                      <th className="pb-3">Preview</th>
                      <th className="pb-3">Title & Category</th>
                      <th className="pb-3">Source / Type</th>
                      <th className="pb-3">Order</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Created</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredVideos.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F7F8FA] transition-colors">
                        {/* Thumbnail Preview */}
                        <td className="py-4 w-28">
                          <div
                            onClick={() => setPreviewVideo(v)}
                            className="relative w-20 h-28 bg-[#101946] rounded-xl overflow-hidden border border-[#E2E8F0] cursor-pointer group shadow-xs shrink-0 flex items-center justify-center"
                            title="Click to preview video"
                          >
                            {v.thumbnailUrl ? (
                              <img
                                src={getAssetUrl(v.thumbnailUrl)}
                                alt={v.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : v.videoType === 'MP4' ? (
                              <video
                                src={getAssetUrl(v.videoUrl)}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                            ) : (
                              <Film className="w-8 h-8 text-gray-400" />
                            )}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-[#B8FF00] text-[#101946] flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Title & Category */}
                        <td className="py-4">
                          <div className="font-extrabold text-[#101946] text-sm hover:underline cursor-pointer" onClick={() => setPreviewVideo(v)}>
                            {v.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-bold text-[#101946] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                              {v.category}
                            </span>
                            {DEFAULT_EXISTING_VIDEOS.some((cv) => cv.id === v.id) ? (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                ORIGINAL CLIENT REEL
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                                NEWLY ADDED
                              </span>
                            )}
                            {v.featured && (
                              <span className="text-[10px] font-extrabold text-[#101946] bg-[#B8FF00] px-1.5 py-0.5 rounded">
                                FEATURED
                              </span>
                            )}
                          </div>
                          {v.description && (
                            <p className="text-xs text-[#64748B] mt-1 max-w-xs line-clamp-1">
                              {v.description}
                            </p>
                          )}
                        </td>

                        {/* Type Badge */}
                        <td className="py-4">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                              v.videoType === 'YOUTUBE'
                                ? 'bg-red-100 text-red-700'
                                : v.videoType === 'YOUTUBE_SHORTS'
                                ? 'bg-rose-100 text-rose-700'
                                : v.videoType === 'INSTAGRAM'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {v.videoType}
                          </span>
                        </td>

                        {/* Display Order */}
                        <td className="py-4 font-bold text-xs text-[#101946]">
                          #{v.displayOrder}
                        </td>

                        {/* Status Toggle Pill */}
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleVideoStatus(v.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                              v.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title={v.status === 'PUBLISHED' ? 'Click to unpublish (hide from website)' : 'Click to publish (display on website)'}
                          >
                            <span className={`w-2 h-2 rounded-full ${v.status === 'PUBLISHED' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                            <span>{v.status === 'PUBLISHED' ? 'Published' : 'Unpublished (Draft)'}</span>
                          </button>
                        </td>

                        {/* Date */}
                        <td className="py-4 text-xs text-[#64748B] whitespace-nowrap">
                          {v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewVideo(v)}
                              className="p-2 text-gray-600 hover:text-[#101946] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              title="Preview Video"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(v);
                                setFormInput({
                                  title: v.title || '',
                                  description: v.description || '',
                                  videoUrl: v.videoUrl || '',
                                  thumbnailUrl: v.thumbnailUrl || '',
                                  category: v.category || 'Restaurants',
                                  videoType: v.videoType || 'AUTO',
                                  status: v.status || 'PUBLISHED',
                                  displayOrder: v.displayOrder !== undefined ? v.displayOrder : 0,
                                  featured: Boolean(v.featured),
                                });
                                setModalType('video');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Reel"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(v)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete Reel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Manage Portfolio</h1>
                <p className="text-sm text-[#64748B]">Create or edit showcase projects.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormInput({ title: '', category: 'Restaurants', description: '', image: '', instagramUrl: '', isPublished: true, isFeatured: true, sortOrder: portfolio.length + 1 });
                  setModalType('portfolio');
                }}
                className="inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#171B4B]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="h-44 bg-gray-100 overflow-hidden relative">
                    <img src={getAssetUrl(p.image) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#101946] text-[#B8FF00] text-[10px] font-extrabold px-2.5 py-1 rounded-md">{p.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-extrabold text-[#101946] mb-1">{p.title}</h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 mb-4">{p.description}</p>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                      <button
                        onClick={() => {
                          setEditingItem(p);
                          setFormInput({ ...p });
                          setModalType('portfolio');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeletePortfolio(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Featured Clients</h1>
                <p className="text-sm text-[#64748B]">Manage client spotlight cards.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormInput({ name: '', category: '', description: '', initials: '', isFeatured: true, isActive: true });
                  setModalType('client');
                }}
                className="inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#171B4B]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((c) => (
                <div key={c.id} className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#101946]">{c.name}</h3>
                    <p className="text-xs text-[#64748B] mb-2">{c.category}</p>
                    <p className="text-xs text-gray-500 max-w-md">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(c);
                        setFormInput({ ...c });
                        setModalType('client');
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClient(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Testimonials</h1>
                <p className="text-sm text-[#64748B]">Manage client quotes and ratings.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormInput({ name: '', company: '', quote: '', image: '', rating: 5, isPublished: true });
                  setModalType('testimonial');
                }}
                className="inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#171B4B]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-3">
                      <img
                        src={
                          getAssetUrl(t.image) ||
                          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
                        }
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#101946] shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div>
                        <h4 className="text-sm font-extrabold text-[#101946]">{t.name}</h4>
                        <p className="text-xs font-semibold text-[#64748B]">{t.company}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-[#101946]/80 italic line-clamp-3">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0] mt-4">
                    <button
                      onClick={() => {
                        setEditingItem(t);
                        setFormInput({ ...t, image: t.image || '' });
                        setModalType('testimonial');
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTestimonial(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQS TAB */}
        {activeTab === 'faqs' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Manage FAQs</h1>
                <p className="text-sm text-[#64748B]">Add, edit, or reorder homepage questions.</p>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormInput({ question: '', answer: '', isPublished: true, sortOrder: faqs.length + 1 });
                  setModalType('faq');
                }}
                className="inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#171B4B]"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.id} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-[#101946]">{f.question}</h4>
                    <p className="text-xs text-[#64748B]">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(f);
                        setFormInput({ ...f });
                        setModalType('faq');
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteFaq(f.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SITE SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 text-left">
            <div>
              <h1 className="text-3xl font-extrabold text-[#101946]">Site Settings</h1>
              <p className="text-sm text-[#64748B]">Update business information, social media links, and hero copy.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">Business Name</label>
                  <input
                    type="text"
                    value={settingsInput.business_name || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, business_name: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">Business Email</label>
                  <input
                    type="email"
                    placeholder="info@artishmedia.com"
                    value={settingsInput.business_email || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, business_email: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={settingsInput.instagram_url || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, instagram_url: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={settingsInput.youtube_url || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, youtube_url: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={settingsInput.facebook_url || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, facebook_url: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">TikTok URL</label>
                  <input
                    type="text"
                    value={settingsInput.tiktok_url || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, tiktok_url: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. +44 7552 782519"
                    value={settingsInput.phone || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, phone: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">WhatsApp URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://wa.me/447552782519"
                    value={settingsInput.whatsapp_url || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, whatsapp_url: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* HERO VIDEO & MEDIA CONFIGURATION SECTION */}
              <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#101946]">Hero Video & Media Settings</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsInput.hero_video_enabled !== 'false' && settingsInput.hero_video_enabled !== false}
                      onChange={(e) => setSettingsInput({ ...settingsInput, hero_video_enabled: e.target.checked ? 'true' : 'false' })}
                      className="w-4 h-4 text-[#101946] rounded focus:ring-0"
                    />
                    <span className="text-xs font-bold text-[#101946]">Enable Hero Background Video</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Hero Video Desktop (16:9 MP4)</label>
                    <input
                      type="text"
                      placeholder="/videos/hero-artish.mp4"
                      value={settingsInput.hero_video_desktop || ''}
                      onChange={(e) => setSettingsInput({ ...settingsInput, hero_video_desktop: e.target.value })}
                      className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Hero Video Mobile (9:16 MP4)</label>
                    <input
                      type="text"
                      placeholder="/videos/hero-artish-mobile.mp4"
                      value={settingsInput.hero_video_mobile || ''}
                      onChange={(e) => setSettingsInput({ ...settingsInput, hero_video_mobile: e.target.value })}
                      className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Hero Video Poster Image URL</label>
                    <input
                      type="text"
                      placeholder="/videos/hero-artish-poster.webp"
                      value={settingsInput.hero_video_poster || ''}
                      onChange={(e) => setSettingsInput({ ...settingsInput, hero_video_poster: e.target.value })}
                      className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Instagram Reel Reference URL</label>
                    <input
                      type="text"
                      placeholder="https://www.instagram.com/reel/DWLr2APKmoT/..."
                      value={settingsInput.hero_instagram_url || ''}
                      onChange={(e) => setSettingsInput({ ...settingsInput, hero_instagram_url: e.target.value })}
                      className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0]">
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Stat: Projects</label>
                  <input
                    type="text"
                    value={settingsInput.stat_projects || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, stat_projects: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Stat: Views</label>
                  <input
                    type="text"
                    value={settingsInput.stat_views || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, stat_views: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Stat: Businesses</label>
                  <input
                    type="text"
                    value={settingsInput.stat_businesses || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, stat_businesses: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Stat: Satisfaction</label>
                  <input
                    type="text"
                    value={settingsInput.stat_satisfaction || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, stat_satisfaction: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#101946] text-[#B8FF00] font-extrabold text-sm px-8 py-3.5 rounded-xl hover:bg-[#171B4B] transition-all"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#101946]">Media Library</h1>
                <p className="text-sm text-[#64748B]">Upload images and copy file URLs for services or portfolio items.</p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-xs px-5 py-3 rounded-xl hover:bg-[#171B4B]">
                <Upload className="w-4 h-4" />
                <span>Upload New File</span>
                <input type="file" onChange={handleMediaUpload} className="hidden" accept="image/*,video/*" />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaList.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden p-3 flex flex-col justify-between shadow-sm">
                  <img src={getAssetUrl(m.url)} alt={m.filename} className="w-full h-36 object-cover rounded-xl mb-3" />
                  <p className="text-xs font-bold truncate mb-2">{m.filename}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(m.url);
                        showToast('Image URL copied!');
                      }}
                      className="text-[10px] font-extrabold bg-[#F7F8FA] px-2.5 py-1 rounded border border-[#E2E8F0]"
                    >
                      Copy URL
                    </button>
                    <button onClick={() => handleDeleteMedia(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CRUD MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-left space-y-5 shadow-2xl relative">
            <button onClick={() => setModalType(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-extrabold text-[#101946]">
              {modalType === 'video'
                ? editingItem
                  ? 'Edit Video / Reel'
                  : 'Upload Upcoming Reel'
                : `${editingItem ? 'Edit' : 'Add'} ${modalType.toUpperCase()}`}
            </h3>

            {/* SERVICE FORM */}
            {modalType === 'service' && (
              <form onSubmit={handleSaveService} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Title</label>
                  <input
                    type="text"
                    value={formInput.title || ''}
                    onChange={(e) => setFormInput({ ...formInput, title: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formInput.description || ''}
                    onChange={(e) => setFormInput({ ...formInput, description: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Icon Name (Lucide)</label>
                  <select
                    value={formInput.icon || 'Camera'}
                    onChange={(e) => setFormInput({ ...formInput, icon: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  >
                    <option value="Camera">Camera</option>
                    <option value="Share2">Share2</option>
                    <option value="Video">Video</option>
                    <option value="Mic">Mic</option>
                    <option value="Calendar">Calendar</option>
                    <option value="Globe">Globe</option>
                    <option value="Megaphone">Megaphone</option>
                    <option value="Palette">Palette</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-[#101946] text-[#B8FF00] font-bold py-3 rounded-xl">
                  Save Service
                </button>
              </form>
            )}

            {/* PORTFOLIO FORM */}
            {modalType === 'portfolio' && (
              <form onSubmit={handleSavePortfolio} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Title</label>
                  <input
                    type="text"
                    value={formInput.title || ''}
                    onChange={(e) => setFormInput({ ...formInput, title: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Category</label>
                  <select
                    value={formInput.category || 'Restaurants'}
                    onChange={(e) => setFormInput({ ...formInput, category: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  >
                    <option value="Restaurants">Restaurants</option>
                    <option value="Events">Events</option>
                    <option value="Podcasts">Podcasts</option>
                    <option value="Social Media Campaigns">Social Media Campaigns</option>
                    <option value="Community Projects">Community Projects</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formInput.image || ''}
                    onChange={(e) => setFormInput({ ...formInput, image: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formInput.description || ''}
                    onChange={(e) => setFormInput({ ...formInput, description: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-[#101946] text-[#B8FF00] font-bold py-3 rounded-xl">
                  Save Project
                </button>
              </form>
            )}

            {/* CLIENT FORM */}
            {modalType === 'client' && (
              <form onSubmit={handleSaveClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Client Name</label>
                  <input
                    type="text"
                    value={formInput.name || ''}
                    onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Category</label>
                  <input
                    type="text"
                    value={formInput.category || ''}
                    onChange={(e) => setFormInput({ ...formInput, category: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formInput.description || ''}
                    onChange={(e) => setFormInput({ ...formInput, description: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-[#101946] text-[#B8FF00] font-bold py-3 rounded-xl">
                  Save Client
                </button>
              </form>
            )}

            {/* TESTIMONIAL FORM */}
            {modalType === 'testimonial' && (
              <form onSubmit={handleSaveTestimonial} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Client Name</label>
                  <input
                    type="text"
                    value={formInput.name || ''}
                    onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Company</label>
                  <input
                    type="text"
                    value={formInput.company || ''}
                    onChange={(e) => setFormInput({ ...formInput, company: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Quote</label>
                  <textarea
                    rows={3}
                    value={formInput.quote || ''}
                    onChange={(e) => setFormInput({ ...formInput, quote: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>

                {/* TESTIMONIAL IMAGE SECTION */}
                <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                  <label className="block text-xs font-bold text-[#101946]">Testimonial Photo</label>

                  {/* Image Preview if selected */}
                  {formInput.image ? (
                    <div className="flex items-center gap-3.5 p-3 bg-[#F7F8FA] rounded-2xl border border-[#E2E8F0]">
                      <img
                        src={getAssetUrl(formInput.image)}
                        alt="Selected testimonial avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#101946] shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#101946] truncate">{formInput.image}</p>
                        <p className="text-[10px] text-[#64748B]">Active image for this testimonial</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormInput({ ...formInput, image: '' })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-[#64748B]">No photo selected. A default avatar will be shown.</p>
                  )}

                  {/* Upload button */}
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-[#101946] text-[#B8FF00] font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-[#171B4B] transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await API.post('/media', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' },
                            });
                            setMediaList((prev) => [res.data, ...prev]);
                            setFormInput((prev) => ({ ...prev, image: res.data.url }));
                            showToast('Image uploaded and selected!');
                          } catch (err) {
                            alert('Failed to upload image');
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Pick from Media Library */}
                  {mediaList.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-[#64748B]">Or select from uploaded Media Library:</span>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-2 bg-[#F7F8FA] rounded-xl border border-[#E2E8F0]">
                        {mediaList.map((m) => {
                          const isSelected = formInput.image === m.url;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setFormInput({ ...formInput, image: m.url })}
                              className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                                isSelected ? 'border-[#101946] ring-2 ring-[#B8FF00]' : 'border-transparent hover:border-gray-400'
                              }`}
                              title={m.filename}
                            >
                              <img
                                src={getAssetUrl(m.url)}
                                alt={m.filename}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#101946]/50 flex items-center justify-center">
                                  <Check className="w-5 h-5 text-[#B8FF00]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Manual URL field */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748B] mb-1">Image URL / Path</label>
                    <input
                      type="text"
                      placeholder="/uploads/... or https://..."
                      value={formInput.image || ''}
                      onChange={(e) => setFormInput({ ...formInput, image: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#101946] text-[#B8FF00] font-bold py-3 rounded-xl hover:bg-[#171B4B] transition-all">
                  Save Testimonial
                </button>
              </form>
            )}

            {/* FAQ FORM */}
            {modalType === 'faq' && (
              <form onSubmit={handleSaveFaq} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Question</label>
                  <input
                    type="text"
                    value={formInput.question || ''}
                    onChange={(e) => setFormInput({ ...formInput, question: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Answer</label>
                  <textarea
                    rows={3}
                    value={formInput.answer || ''}
                    onChange={(e) => setFormInput({ ...formInput, answer: e.target.value })}
                    required
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-[#101946] text-[#B8FF00] font-bold py-3 rounded-xl">
                  Save FAQ
                </button>
              </form>
            )}

            {/* VIDEO FORM */}
            {modalType === 'video' && (
              <form onSubmit={handleSaveVideo} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">
                    Reel / Video Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formInput.title || ''}
                    onChange={(e) => setFormInput({ ...formInput, title: e.target.value })}
                    required
                    placeholder="e.g. Royals Handi Restaurant Campaign"
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#101946]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">
                    Video Source / MP4 File <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={formInput.videoUrl || ''}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        const detected = detectVideoType(newUrl);
                        setFormInput((prev) => ({
                          ...prev,
                          videoUrl: newUrl,
                          videoType: prev.videoType === 'AUTO' || !prev.videoType ? detected : prev.videoType,
                        }));
                      }}
                      required
                      placeholder="Paste link (YouTube, Shorts, Instagram Reel, MP4) or upload file"
                      className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#101946]"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 bg-[#101946] hover:bg-[#171B4B] text-[#B8FF00] px-4 py-2.5 rounded-xl font-extrabold text-xs cursor-pointer transition-colors shrink-0 shadow-xs">
                      {uploadingVideo ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#B8FF00]" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{uploadingVideo ? 'Uploading...' : 'Upload MP4 File'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/*"
                        onChange={handleDirectVideoFileUpload}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1.5">
                    Click <strong>Upload MP4 File</strong> to select a video from your computer, or paste a link from YouTube, YouTube Shorts, or Instagram Reels.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Video Source / Type</label>
                    <select
                      value={formInput.videoType || 'AUTO'}
                      onChange={(e) => setFormInput({ ...formInput, videoType: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#101946]"
                    >
                      <option value="AUTO">Auto Detect</option>
                      <option value="MP4">Direct MP4 Video</option>
                      <option value="YOUTUBE">YouTube Video</option>
                      <option value="YOUTUBE_SHORTS">YouTube Shorts</option>
                      <option value="INSTAGRAM">Instagram Reel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Category</label>
                    <input
                      type="text"
                      list="admin-category-suggestions"
                      value={formInput.category || ''}
                      onChange={(e) => setFormInput({ ...formInput, category: e.target.value })}
                      placeholder="e.g. Restaurants"
                      className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#101946]"
                    />
                    <datalist id="admin-category-suggestions">
                      <option value="Restaurants" />
                      <option value="Events" />
                      <option value="Podcasts" />
                      <option value="Business Promotions" />
                      <option value="Community Projects" />
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Thumbnail Poster</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formInput.thumbnailUrl || ''}
                      onChange={(e) => setFormInput({ ...formInput, thumbnailUrl: e.target.value })}
                      placeholder="Image URL or upload below (optional)"
                      className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#101946]"
                    />
                    <label className="inline-flex items-center gap-1.5 bg-[#F1F5F9] hover:bg-gray-200 text-[#101946] px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleVideoThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#101946] mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={formInput.description || ''}
                    onChange={(e) => setFormInput({ ...formInput, description: e.target.value })}
                    placeholder="Short description or client campaign details..."
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#101946]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Publishing Status</label>
                    <select
                      value={formInput.status || 'PUBLISHED'}
                      onChange={(e) => setFormInput({ ...formInput, status: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#101946]"
                    >
                      <option value="PUBLISHED">Published (Visible on site)</option>
                      <option value="DRAFT">Draft (Hidden)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#101946] mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formInput.displayOrder !== undefined ? formInput.displayOrder : 0}
                      onChange={(e) => setFormInput({ ...formInput, displayOrder: e.target.value })}
                      className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#101946]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured-video-checkbox"
                    checked={Boolean(formInput.featured)}
                    onChange={(e) => setFormInput({ ...formInput, featured: e.target.checked })}
                    className="w-4 h-4 text-[#101946] rounded focus:ring-0"
                  />
                  <label htmlFor="featured-video-checkbox" className="text-xs font-bold text-[#101946] cursor-pointer">
                    Mark as Featured Video
                  </label>
                </div>

                {/* Live Preview Box */}
                {formInput.videoUrl && (
                  <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#E2E8F0] space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">Live Preview</p>
                    {detectVideoType(formInput.videoUrl) === 'MP4' ? (
                      <video
                        src={getAssetUrl(formInput.videoUrl)}
                        controls
                        className="w-full max-h-48 rounded-xl bg-black"
                      />
                    ) : detectVideoType(formInput.videoUrl) === 'YOUTUBE' || detectVideoType(formInput.videoUrl) === 'YOUTUBE_SHORTS' ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                        <iframe
                          src={getYouTubeEmbedUrl(formInput.videoUrl)}
                          title="Preview"
                          className="w-full h-full border-0"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-[#101946] text-white rounded-xl text-center text-xs">
                        <p className="font-bold">Instagram Reel Link Detected</p>
                        <p className="text-gray-300 text-[11px] mt-1 break-all">{formInput.videoUrl}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#101946] text-[#B8FF00] font-extrabold text-xs hover:bg-[#171B4B] cursor-pointer"
                  >
                    {editingItem ? 'Save Changes' : 'Create Video'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-left space-y-4 shadow-2xl relative border border-[#E2E8F0]">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#101946]">Delete Video / Reel</h3>
              <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-extrabold text-[#101946]">"{deleteConfirmVideo.title}"</span>? This will permanently remove the video record from the database and the public website.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setDeleteConfirmVideo(null)}
                disabled={isDeletingVideo}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-extrabold text-[#101946] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteVideo}
                disabled={isDeletingVideo}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isDeletingVideo && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                <span>{isDeletingVideo ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-[#101946] text-white rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#B8FF00] text-[#101946] uppercase">
                {previewVideo.videoType}
              </span>
              <h3 className="text-xl font-black text-white mt-2">{previewVideo.title}</h3>
              <p className="text-xs text-gray-300">{previewVideo.category}</p>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {previewVideo.videoType === 'YOUTUBE' || previewVideo.videoType === 'YOUTUBE_SHORTS' ? (
                <div className="w-full aspect-[9/16] max-h-[500px]">
                  <iframe
                    src={getYouTubeEmbedUrl(previewVideo.videoUrl)}
                    title={previewVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : previewVideo.videoType === 'INSTAGRAM' ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">Instagram Reel</p>
                  <p className="text-xs text-gray-300 break-all">{previewVideo.videoUrl}</p>
                  <a
                    href={previewVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#B8FF00] text-[#101946] font-extrabold text-xs px-5 py-2.5 rounded-full"
                  >
                    <span>Open in Instagram</span>
                    <span>↗</span>
                  </a>
                </div>
              ) : (
                <video
                  src={getAssetUrl(previewVideo.videoUrl)}
                  poster={previewVideo.thumbnailUrl ? getAssetUrl(previewVideo.thumbnailUrl) : undefined}
                  controls
                  autoPlay
                  className="w-full max-h-[500px]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
