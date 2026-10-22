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
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import API from '../services/api';

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

  // Modals & Form States
  const [modalType, setModalType] = useState(null); // 'service', 'portfolio', 'client', 'testimonial', 'faq', 'enquiryNotes'
  const [editingItem, setEditingItem] = useState(null);
  const [formInput, setFormInput] = useState({});
  const [settingsInput, setSettingsInput] = useState({ ...settings });

  // Filter States
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');

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
      const [enqRes, srvRes, portRes, cliRes, testRes, faqRes, medRes] = await Promise.all([
        API.get('/enquiries').catch(() => ({ data: [] })),
        API.get('/services?all=true').catch(() => ({ data: [] })),
        API.get('/portfolio?all=true').catch(() => ({ data: [] })),
        API.get('/clients?all=true').catch(() => ({ data: [] })),
        API.get('/testimonials?all=true').catch(() => ({ data: [] })),
        API.get('/faqs?all=true').catch(() => ({ data: [] })),
        API.get('/media').catch(() => ({ data: [] })),
      ]);

      setEnquiries(enqRes.data || []);
      setServices(srvRes.data || []);
      setPortfolio(portRes.data || []);
      setClients(cliRes.data || []);
      setTestimonials(testRes.data || []);
      setFaqs(faqRes.data || []);
      setMediaList(medRes.data || []);
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {[
                { label: 'Total Enquiries', val: enquiries.length, color: 'border-l-4 border-blue-500' },
                { label: 'New Leads', val: newEnquiriesCount, color: 'border-l-4 border-[#B8FF00]' },
                { label: 'Services', val: services.length, color: 'border-l-4 border-purple-500' },
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
                          <div><a href={`mailto:${e.email}`} className="text-blue-600 font-semibold">{e.email}</a></div>
                          {e.phone && <div className="text-[#64748B]">{e.phone}</div>}
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
                    <img src={p.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'} alt={p.title} className="w-full h-full object-cover" />
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
                  setFormInput({ name: '', company: '', quote: '', rating: 5, isPublished: true });
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
                    <p className="text-sm font-bold text-[#101946] italic mb-3">"{t.quote}"</p>
                    <p className="text-xs font-extrabold text-[#101946]">{t.name}</p>
                    <p className="text-xs text-[#64748B]">{t.company}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0] mt-4">
                    <button
                      onClick={() => {
                        setEditingItem(t);
                        setFormInput({ ...t });
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
                    placeholder="e.g. +44 20 1234 5678"
                    value={settingsInput.phone || ''}
                    onChange={(e) => setSettingsInput({ ...settingsInput, phone: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#101946] mb-1">WhatsApp URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://wa.me/447123456789"
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
                  <img src={m.url} alt={m.filename} className="w-full h-36 object-cover rounded-xl mb-3" />
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
              {editingItem ? 'Edit' : 'Add'} {modalType.toUpperCase()}
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
              <form onSubmit={handleSaveTestimonial} className="space-y-4">
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
                <button type="submit" className="w-full bg-[#101946] text-[#B8FF00] font-bold py-3 rounded-xl">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
