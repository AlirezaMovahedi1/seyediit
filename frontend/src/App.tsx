import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  BarChart3, 
  Archive, 
  Users, 
  LifeBuoy, 
  MessageSquare, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Filter, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  X, 
  Menu, 
  Plus, 
  Trash2, 
  HelpCircle,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  User,
  Phone
} from 'lucide-react';

interface Ticket {
  id: number;
  date: string;
  name: string;
  mobile: string;
  description: string;
  status: 'new' | 'success' | 'cancel' | 'progress' | 'finance';
  priority: 'normal' | 'urgent' | 'critical';
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    date: '۱۴۰۵/۰۳/۱۳ ۱۲:۵۶',
    name: 'امیربهزاد رضوی/۹۴۳/تهران',
    mobile: '09123872112',
    description: 'گواهی امضا/امروز همزمان تماس گرفتید دفتر هستند',
    status: 'new',
    priority: 'normal'
  },
  {
    id: 2,
    date: '۱۴۰۵/۰۳/۱۳ ۱۲:۳۷',
    name: 'علی شهسواری/۶۷/کردستان',
    mobile: '09189712250',
    description: 'نصب وب کم',
    status: 'success',
    priority: 'normal'
  },
  {
    id: 3,
    date: '۱۴۰۵/۰۳/۱۳ ۱۲:۲۷',
    name: 'پیراسته/',
    mobile: '0913149876',
    description: 'نصب vpn',
    status: 'new',
    priority: 'normal'
  },
  {
    id: 4,
    date: '۱۴۰۵/۰۳/۱۳ ۱۲:۲۷',
    name: 'دیاموند عبدی',
    mobile: '09183789135',
    description: 'کارت کار نمیکنه -------',
    status: 'cancel',
    priority: 'normal'
  },
  {
    id: 5,
    date: '۱۴۰۵/۰۳/۱۳ ۱۳:۱۶',
    name: 'دلارام ناصری',
    mobile: '0920210964',
    description: 'مشکل سئو سند',
    status: 'finance',
    priority: 'normal'
  },
  {
    id: 6,
    date: '۱۴۰۵/۰۳/۱۳ ۱۲:۴۲',
    name: 'یلدا پرستار/۶۲/اردبیل',
    mobile: '09147659709',
    description: 'وارد سامانه نمیشن',
    status: 'progress',
    priority: 'normal'
  },
  {
    id: 7,
    date: '۱۴۰۵/۰۳/۱۳ ۱۲:۱۱',
    name: 'دفتر دار برادر آقای سیدی',
    mobile: '09138439266',
    description: 'کاتب/گواهی امضا',
    status: 'cancel',
    priority: 'normal'
  },
  {
    id: 8,
    date: '۱۴۰۵/۰۳/۱۳ ۱۲:۰۳',
    name: 'نرگس پور صالحی/۹۶/کرمان',
    mobile: '09135853559',
    description: 'وب کم کار نمیکنه -------------',
    status: 'cancel',
    priority: 'normal'
  },
  {
    id: 9,
    date: '۱۴۰۵/۰۳/۱۲ ۱۵:۴۰',
    name: 'سهراب احمدی/مشهد',
    mobile: '09151234567',
    description: 'درخواست کابل شبکه و تغییر آی‌پی سیستم کاربری',
    status: 'success',
    priority: 'normal'
  },
  {
    id: 10,
    date: '۱۴۰۵/۰۳/۱۲ ۰۹:۱۵',
    name: 'نیلوفر رحیمی/اصفهان',
    mobile: '09138765432',
    description: 'عدم اتصال سیستم حسابداری به پرینتر فاکتورها',
    status: 'finance',
    priority: 'urgent'
  },
  {
    id: 11,
    date: '۱۴۰۵/۰۳/۱۱ ۱۷:۱۰',
    name: 'رضا علیزاده/تبریز',
    mobile: '09145556677',
    description: 'قطعی کامل اینترنت کل طبقه دوم بخش اداری',
    status: 'progress',
    priority: 'critical'
  }
];

function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Navigation states
  const [activeMenu, setActiveMenu] = useState<string>('submissions');
  const [activeTab, setActiveTab] = useState<'register' | 'search' | 'reports'>('search');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Tickets state
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (selectedTicket) {
      setEditingTicket({ ...selectedTicket });
    } else {
      setEditingTicket(null);
    }
  }, [selectedTicket]);

  // Form registration states
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    description: '',
    priority: 'normal' as 'normal' | 'urgent' | 'critical',
    category: 'it'
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Table selection states
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Form Submit Handler
  const handleRegisterTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.description) {
      alert('لطفاً تمامی فیلدهای الزامی را پر کنید.');
      return;
    }

    const now = new Date();
    const jalaliDate = '۱۴۰۵/۰۳/۱۳ ' + now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    const newTicket: Ticket = {
      id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
      date: jalaliDate,
      name: formData.name,
      mobile: formData.mobile,
      description: formData.description,
      status: 'new',
      priority: formData.priority
    };

    setTickets([newTicket, ...tickets]);
    setFormData({
      name: '',
      mobile: '',
      description: '',
      priority: 'normal',
      category: 'it'
    });
    setActiveTab('search');
    alert('تیکت شما با موفقیت ثبت شد.');
  };

  // Delete handler
  const handleDeleteSelected = () => {
    if (selectedRowIds.length === 0) return;
    if (window.confirm(`آیا از حذف ${selectedRowIds.length} تیکت انتخاب شده مطمئن هستید؟`)) {
      setTickets(tickets.filter(t => !selectedRowIds.includes(t.id)));
      setSelectedRowIds([]);
    }
  };

  // Save changes handler for editing ticket
  const handleSaveChanges = () => {
    if (!editingTicket) return;
    setTickets(prev => prev.map(t => t.id === editingTicket.id ? editingTicket : t));
    setSelectedTicket(null);
    alert('تغییرات با موفقیت ذخیره شد.');
  };

  // Toggle selection for individual row
  const toggleRowSelection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening modal when clicking checkbox
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Toggle selection for all rows
  const toggleSelectAll = () => {
    if (selectedRowIds.length === currentItems.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(currentItems.map(t => t.id));
    }
  };

  // Filtering Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.mobile.includes(searchQuery) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = tickets.length;
    const newCount = tickets.filter(t => t.status === 'new').length;
    const progressCount = tickets.filter(t => t.status === 'progress').length;
    const closedCount = tickets.filter(t => t.status === 'success' || t.status === 'cancel').length;
    return { total, newCount, progressCount, closedCount };
  }, [tickets]);

  // Persian Translation Helper
  const getStatusLabel = (status: Ticket['status']) => {
    switch (status) {
      case 'new': return 'جدید';
      case 'progress': return 'در حال انجام';
      case 'success': return 'بسته شد (موفق)';
      case 'cancel': return 'بسته شد (کنسل)';
      case 'finance': return 'مالی';
      default: return '';
    }
  };

  const getPriorityLabel = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'normal': return 'عادی';
      case 'urgent': return 'فوری';
      case 'critical': return 'بسیار فوری';
      default: return '';
    }
  };

  // Format date helper (Persian Day Name)
  const todayPersianDate = "چهارشنبه ۱۳ خرداد ۱۴۰۵";

  // Sidebar Menu Config
  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'forms', label: 'طراحی فرم', icon: FileText },
    { id: 'submissions', label: 'ارسالی‌ها', icon: Send },
    { id: 'reports', label: 'گزارش', icon: BarChart3 },
    { id: 'archive', label: 'بایگانی', icon: Archive },
    { id: 'users', label: 'کاربران', icon: Users },
    { id: 'support', label: 'پشتیبانی', icon: LifeBuoy },
    { id: 'chat', label: 'گفتگو آنلاین', icon: MessageSquare },
  ];

  return (
    <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${mobileSidebarOpen ? 'open' : ''}`} 
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Right Sidebar */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">
            <Send size={22} style={{ transform: 'rotate(180deg)' }} />
          </div>
          <span className="logo-text">سیدی آی تی</span>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="sidebar-item">
                <a 
                  className={`sidebar-link ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setMobileSidebarOpen(false);
                  }}
                >
                  <Icon />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="header">
          <div className="header-right">
            <button className="hamburger-btn" onClick={() => setMobileSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="header-title-container">
              <span className="user-name" style={{ fontSize: '1.05rem', fontWeight: 700 }}>سامانه مدیریت تیکتینگ سیدی آی‌تی</span>
              <span className="header-subtitle">{todayPersianDate}</span>
            </div>
          </div>

          <div className="header-left">
            {/* Notification Badge */}
            <div className="icon-btn">
              <Bell size={20} />
              <span className="badge">۳</span>
            </div>

            {/* Theme Toggle */}
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* User Info Dropdown */}
            <div className="profile-menu-container">
              <div className="user-profile" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                <div className="avatar-circle">
                  <User size={18} />
                </div>
                <span className="user-name">علیرضا موحدی</span>
                {profileMenuOpen ? <ChevronUp size={16} style={{ marginRight: '4px' }} /> : <ChevronDown size={16} style={{ marginRight: '4px' }} />}
              </div>

              {profileMenuOpen && (
                <>
                  <div className="dropdown-overlay" onClick={() => setProfileMenuOpen(false)} />
                  <div className="profile-dropdown">
                    <div className="dropdown-item">پروفایل</div>
                    <div className="dropdown-item">تنظیمات</div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-item">راهنما</div>
                    <div className="dropdown-item">پشتیبانی</div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-item package-info">نوع پکیج: تجاری</div>
                    <div className="dropdown-item">تمدید پکیج</div>
                    <div className="dropdown-item">ارتقاء یا تنزل پکیج</div>
                    <div className="dropdown-item">شارژ پیامک و حجم</div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-item logout">خروج</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="content-container">
          
          {/* Statistics Bar (Visible on Submissions and Dashboard) */}
          {(activeMenu === 'submissions' || activeMenu === 'dashboard') && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">کل درخواست‌ها</span>
                  <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                  <Send size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">جدید</span>
                  <span className="stat-value">{stats.newCount}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                  <AlertCircle size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">در حال انجام</span>
                  <span className="stat-value">{stats.progressCount}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                  <RefreshCw size={24} />
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <span className="stat-label">بسته شده</span>
                  <span className="stat-value">{stats.closedCount}</span>
                </div>
                <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>
          )}

          {/* Primary View Router simulation */}
          {activeMenu === 'submissions' && (
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title-row">
                  <h2 className="card-title">درگاه درخواست خدمات انفورماتیک غیر حضوری</h2>
                  {selectedRowIds.length > 0 && (
                    <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={handleDeleteSelected}>
                      <Trash2 size={16} />
                      <span>حذف ({selectedRowIds.length})</span>
                    </button>
                  )}
                </div>

                {/* Sub Tab Navigation */}
                <div className="tabs-container">
                  <button 
                    className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                  >
                    ثبت اطلاعات
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => setActiveTab('search')}
                  >
                    جستجوی اطلاعات
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    گزارش
                  </button>
                </div>

                {/* Sub Tab Content: Search & Table Filter (Active in screenshot) */}
                {activeTab === 'search' && (
                  <div className="controls-row">
                    <div className="search-box">
                      <Search size={18} style={{ color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="جستجو بر اساس نام، موبایل، یا ایراد..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      {searchQuery && (
                        <button className="close-btn" style={{ marginLeft: 8 }} onClick={() => setSearchQuery('')}>
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="filter-actions">
                      <button 
                        className={`btn-secondary ${showAdvancedFilters ? 'active' : ''}`}
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      >
                        <Filter size={16} />
                        <span>فیلتر</span>
                      </button>

                      <button className="btn-secondary" onClick={() => window.print()}>
                        <Printer size={16} />
                        <span>چاپ گزارش</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Filter Panel */}
              {activeTab === 'search' && showAdvancedFilters && (
                <div className="advanced-filters" style={{ padding: '0 24px 20px 24px', display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>فیلتر وضعیت</label>
                    <select 
                      style={{ padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontFamily: 'var(--font-family)' }}
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">همه وضعیت‌ها</option>
                      <option value="new">جدید</option>
                      <option value="progress">در حال انجام</option>
                      <option value="success">بسته شد (موفق)</option>
                      <option value="cancel">بسته شد (کنسل)</option>
                      <option value="finance">مالی</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>فیلتر اولویت</label>
                    <select 
                      style={{ padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontFamily: 'var(--font-family)' }}
                      value={priorityFilter}
                      onChange={(e) => {
                        setPriorityFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">همه اولویت‌ها</option>
                      <option value="normal">عادی</option>
                      <option value="urgent">فوری</option>
                      <option value="critical">بسیار فوری</option>
                    </select>
                  </div>

                  {(statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery !== '') && (
                    <button 
                      className="btn-secondary" 
                      style={{ alignSelf: 'flex-end', padding: '8px 12px' }}
                      onClick={() => {
                        setStatusFilter('all');
                        setPriorityFilter('all');
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                    >
                      حذف فیلترها
                    </button>
                  )}
                </div>
              )}

              {/* Tab 1: Register Ticket Form */}
              {activeTab === 'register' && (
                <div style={{ padding: '32px 24px' }}>
                  <form onSubmit={handleRegisterTicket} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>نام و نام خانوادگی <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <User size={18} style={{ position: 'absolute', right: 12, color: 'var(--text-muted)' }} />
                          <input 
                            type="text" 
                            placeholder="مثال: علیرضا موحدی"
                            style={{ padding: '10px 40px 10px 12px', width: '100%', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: 'var(--font-family)' }}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>شماره موبایل <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <Phone size={18} style={{ position: 'absolute', right: 12, color: 'var(--text-muted)' }} />
                          <input 
                            type="tel" 
                            placeholder="مثال: 09123456789"
                            style={{ padding: '10px 40px 10px 12px', width: '100%', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: 'var(--font-family)', direction: 'ltr', textAlign: 'right' }}
                            value={formData.mobile}
                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>اولویت درخواست</label>
                        <select 
                          style={{ padding: '10px 12px', width: '100%', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: 'var(--font-family)' }}
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        >
                          <option value="normal">عادی</option>
                          <option value="urgent">فوری</option>
                          <option value="critical">بسیار فوری</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>بخش مربوطه</label>
                        <select 
                          style={{ padding: '10px 12px', width: '100%', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: 'var(--font-family)' }}
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          <option value="it">پشتیبانی شبکه و سیستم‌ها</option>
                          <option value="finance">حسابداری و مالی</option>
                          <option value="website">سایت شرکت</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>شرح ایراد / جزئیات درخواست <span style={{ color: '#ef4444' }}>*</span></label>
                      <textarea 
                        rows={5}
                        placeholder="لطفاً شرح کامل مشکل را در این قسمت یادداشت فرمایید..."
                        style={{ padding: '12px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: 'var(--font-family)', lineHeight: 1.6 }}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <button 
                      type="submit" 
                      style={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', border: 'none', borderRadius: 'var(--border-radius-md)', padding: '12px 32px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 10px rgba(var(--primary-rgb), 0.2)' }}
                    >
                      ثبت تیکت و ارسال
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 2: Search Info & Ticket List Table */}
              {activeTab === 'search' && (
                <>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="checkbox-cell">
                            <input 
                              type="checkbox" 
                              className="custom-checkbox"
                              checked={currentItems.length > 0 && selectedRowIds.length === currentItems.length}
                              onChange={toggleSelectAll}
                            />
                          </th>
                          <th style={{ width: '60px' }}>ردیف</th>
                          <th>تاریخ ثبت</th>
                          <th>نام و نام خانوادگی</th>
                          <th>موبایل</th>
                          <th style={{ width: '35%' }}>شرح ایراد</th>
                          <th>آخرین وضعیت کار</th>
                          <th>اولویت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.length > 0 ? (
                          currentItems.map((ticket, index) => (
                            <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                              <td className="checkbox-cell">
                                <input 
                                  type="checkbox" 
                                  className="custom-checkbox"
                                  checked={selectedRowIds.includes(ticket.id)}
                                  onChange={(e) => toggleRowSelection(ticket.id, e as any)}
                                />
                              </td>
                              <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                              <td style={{ whiteSpace: 'nowrap' }}>{ticket.date}</td>
                              <td style={{ fontWeight: 600 }}>{ticket.name}</td>
                              <td>
                                <a 
                                  href={`tel:${ticket.mobile}`} 
                                  style={{ color: 'var(--primary)', textDecoration: 'none' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {ticket.mobile}
                                </a>
                              </td>
                              <td style={{ color: 'var(--text-muted)' }}>{ticket.description}</td>
                              <td>
                                <span className={`status-pill ${ticket.status}`}>
                                  {getStatusLabel(ticket.status)}
                                </span>
                              </td>
                              <td>
                                <span className={`priority-pill ${ticket.priority}`}>
                                  {getPriorityLabel(ticket.priority)}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                              هیچ تیکتی مطابق با فیلترهای جستجو یافت نشد.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="table-footer">
                    <span>
                      نمایش {filteredTickets.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} تا {Math.min(currentPage * itemsPerPage, filteredTickets.length)} از {filteredTickets.length} تیکت
                    </span>

                    {totalPages > 1 && (
                      <div className="pagination">
                        <button 
                          className="pagination-btn" 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                          <ChevronRight size={18} />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button 
                            key={page} 
                            className="pagination-btn"
                            style={{ 
                              backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--bg-surface)', 
                              color: currentPage === page ? 'white' : 'var(--text-main)',
                              borderColor: currentPage === page ? 'var(--primary)' : 'var(--border)'
                            }}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}

                        <button 
                          className="pagination-btn" 
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                          <ChevronLeft size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Tab 3: Statistics and Charts Report */}
              {activeTab === 'reports' && (
                <div style={{ padding: '32px 24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', fontWeight: 700 }}>آمار کارکرد و گزارش تیکتینگ هفتگی</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '24px' }}>
                    {/* CSS Bar Chart */}
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', padding: '24px', backgroundColor: 'var(--bg-base)' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>تعداد تیکت‌ها به تفکیک روزهای هفته</h4>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px' }}>
                        {[
                          { day: 'شنبه', count: 12, height: '60%' },
                          { day: 'یکشنبه', count: 8, height: '40%' },
                          { day: 'دوشنبه', count: 15, height: '75%' },
                          { day: 'سه‌شنبه', count: 18, height: '90%' },
                          { day: 'چهارشنبه', count: 11, height: '55%' },
                          { day: 'پنجشنبه', count: 4, height: '20%' },
                        ].map((d, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{d.count}</div>
                            <div style={{ width: '70%', maxWidth: '30px', height: d.height, background: 'linear-gradient(to top, var(--primary), var(--secondary))', borderRadius: '4px', transition: 'height 0.5s ease' }}></div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.day}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Rings/Meters */}
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', padding: '24px', backgroundColor: 'var(--bg-base)', display: 'flex', flexDirection: 'column', justifySelf: 'stretch' }}>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>وضعیت پاسخگویی و حل مشکلات</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                            <span>نرخ رضایت کاربری</span>
                            <span style={{ fontWeight: 'bold' }}>۹۲٪</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '92%', height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                            <span>حل تیکت در اولین تماس (FCR)</span>
                            <span style={{ fontWeight: 'bold' }}>۷۸٪</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '78%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                            <span>متوسط زمان حل مشکل (MTTR)</span>
                            <span style={{ fontWeight: 'bold' }}>۲.۴ ساعت</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '60%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fallback view simulation for other menu links */}
          {activeMenu !== 'submissions' && (
            <div className="dashboard-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <HelpCircle size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
              <h2 className="card-title" style={{ marginBottom: '12px' }}>بخش {menuItems.find(m => m.id === activeMenu)?.label}</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.6 }}>
                این بخش به صورت شبیه‌سازی شده در پروژه فرانت‌اند قرار دارد. در فاز اتصال به بک‌‌اند جنگو، تمامی قابلیت‌های این صفحه به دیتابیس متصل و فعال خواهند شد.
              </p>
              
              {activeMenu === 'dashboard' && (
                <button 
                  className="btn-extend" 
                  style={{ marginTop: '24px' }}
                  onClick={() => setActiveMenu('submissions')}
                >
                  انتقال به بخش ارسالی‌ها (تیکت‌ها)
                </button>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Floating Plus button on Mobile to quickly open register tab */}
      <button 
        className="floating-create-btn"
        onClick={() => {
          setActiveMenu('submissions');
          setActiveTab('register');
        }}
        aria-label="New Ticket"
      >
        <Plus size={24} />
      </button>

      {/* Ticket Details Modal & History Logger */}
      <div className={`modal-overlay ${selectedTicket ? 'open' : ''}`} onClick={() => setSelectedTicket(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">ویرایش و جزئیات درخواست پشتیبانی #{selectedTicket?.id}</h3>
            <button className="close-btn" onClick={() => setSelectedTicket(null)}>
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            <div className="detail-row">
              <span className="detail-label">نام فرستنده</span>
              <span className="detail-value">
                <input 
                  type="text" 
                  className="modal-input" 
                  value={editingTicket?.name || ''} 
                  onChange={(e) => setEditingTicket(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">موبایل</span>
              <span className="detail-value">
                <input 
                  type="text" 
                  className="modal-input" 
                  style={{ direction: 'ltr', textAlign: 'right' }}
                  value={editingTicket?.mobile || ''} 
                  onChange={(e) => setEditingTicket(prev => prev ? { ...prev, mobile: e.target.value } : null)}
                />
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">تاریخ ثبت</span>
              <span className="detail-value" style={{ paddingTop: '8px' }}>{editingTicket?.date}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">وضعیت کنونی</span>
              <span className="detail-value">
                <select 
                  className="modal-select" 
                  value={editingTicket?.status || 'new'} 
                  onChange={(e) => setEditingTicket(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                >
                  <option value="new">جدید</option>
                  <option value="progress">در حال انجام</option>
                  <option value="success">بسته شد (موفق)</option>
                  <option value="cancel">بسته شد (کنسل)</option>
                  <option value="finance">مالی</option>
                </select>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">اولویت تیکت</span>
              <span className="detail-value">
                <select 
                  className="modal-select" 
                  value={editingTicket?.priority || 'normal'} 
                  onChange={(e) => setEditingTicket(prev => prev ? { ...prev, priority: e.target.value as any } : null)}
                >
                  <option value="normal">عادی</option>
                  <option value="urgent">فوری</option>
                  <option value="critical">بسیار فوری</option>
                </select>
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">شرح مشکل</span>
              <span className="detail-value">
                <textarea 
                  className="modal-textarea" 
                  value={editingTicket?.description || ''} 
                  onChange={(e) => setEditingTicket(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </span>
            </div>

            {/* Audit Log / History Logging */}
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <span className="detail-label" style={{ display: 'block', marginBottom: '16px' }}>تاریخچه ثبت لاگ تغییرات (Audit Log)</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingRight: '20px', borderRight: '2px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', right: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '3px solid var(--bg-surface)' }}></div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{selectedTicket?.date}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>ثبت اولیه درخواست در سامانه</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>درخواست توسط کاربر در پرتال انفورماتیک غیرحضوری ایجاد شد.</span>
                </div>

                {selectedTicket?.status !== 'new' && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '3px solid var(--bg-surface)' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>۱۴۰۵/۰۳/۱۳ ۱۲:۴۵</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>ارجاع تیکت و بررسی کارشناس</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>تیکت جهت بررسی تخصصی به کارشناس پشتیبانی (علیرضا موحدی) ارجاع شد.</span>
                  </div>
                )}

                {(selectedTicket?.status === 'success' || selectedTicket?.status === 'cancel') && (
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedTicket.status === 'success' ? '#10b981' : '#ef4444', border: '3px solid var(--bg-surface)' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>۱۴۰۵/۰۳/۱۳ ۱۳:۰۰</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>تغییر وضعیت به {getStatusLabel(selectedTicket.status)}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                      {selectedTicket.status === 'success' 
                        ? 'مشکل برطرف گردید و تیکت با موفقیت بسته شد.' 
                        : 'درخواست به دلیل انصراف کاربر یا عدم تایید لغو گردید.'}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setSelectedTicket(null)}>انصراف</button>
            <button 
              className="btn-extend" 
              style={{ backgroundColor: 'var(--primary)' }}
              onClick={handleSaveChanges}
            >
              ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
