import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  BarChart3, 
  Archive, 
  MessageSquare, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronUp,
  X, 
  Menu, 
  Plus, 
  Trash2, 
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  User,
  Phone,
  Settings,
  Sliders,
  Wallet,
  Activity,
  Package,
  ShoppingCart,
  Mail
} from 'lucide-react';

interface Ticket {
  id: number;
  date: string;
  name: string;
  mobile: string;
  description: string;
  status: 'new' | 'success' | 'cancel' | 'progress' | 'finance';
  priority: 'normal' | 'urgent' | 'critical';
  isArchived?: boolean;
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

  // User Role State
  const [userRole, setUserRole] = useState<'manager' | 'support'>(() => {
    const saved = localStorage.getItem('user_role');
    return (saved === 'manager' || saved === 'support') ? saved : 'support';
  });

  useEffect(() => {
    localStorage.setItem('user_role', userRole);
  }, [userRole]);

  // Site Admin Session State (Token)
  const [siteToken, setSiteToken] = useState<string | null>(() => {
    return localStorage.getItem('site_admin_token');
  });

  // Navigation states
  const [activeMenu, setActiveMenu] = useState<string>('submissions');
  const [activeTab, setActiveTab] = useState<'register' | 'search' | 'reports'>('search');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);

  // Tickets state (local organization dashboard)
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

  // Table selection states
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  // Archive-specific states
  const [archiveSearchQuery, setArchiveSearchQuery] = useState('');
  const [archiveCurrentPage, setArchiveCurrentPage] = useState(1);
  const [archiveItemsPerPage, setArchiveItemsPerPage] = useState(10);
  const [archiveSelectedRowIds, setArchiveSelectedRowIds] = useState<number[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ==========================================
  // Site Admin Dashboard State
  // ==========================================
  const [siteStats, setSiteStats] = useState<any>(null);
  const [siteProducts, setSiteProducts] = useState<any[]>([]);
  const [sitePosts, setSitePosts] = useState<any[]>([]);
  const [siteCategories, setSiteCategories] = useState<any[]>([]);
  const [siteOrders, setSiteOrders] = useState<any[]>([]);
  const [siteTickets, setSiteTickets] = useState<any[]>([]);
  interface DashboardBanner {
    id: number;
    image: string;
    link: string;
    title: string;
  }

  const [siteGeneralSettings, setSiteGeneralSettings] = useState<{
    showBanners: boolean;
    showFeatures: boolean;
    showProducts: boolean;
    showBlog: boolean;
    showSpecialOffers: boolean;
    aboutTitle: string;
    aboutText: string;
    specialOffersAuto: boolean;
    specialOffersProductIds: string[];
    notaryProductIds: string[];
    blogPostsAuto: boolean;
    blogPostIds: string[];
    homepageOrder: string[];
    banners: DashboardBanner[];
  }>({
    showBanners: true,
    showFeatures: true,
    showProducts: true,
    showBlog: true,
    showSpecialOffers: true,
    aboutTitle: '',
    aboutText: '',
    specialOffersAuto: true,
    specialOffersProductIds: [],
    notaryProductIds: [],
    blogPostsAuto: true,
    blogPostIds: [],
    homepageOrder: ["banners", "specialOffers", "about", "features", "products", "blog"],
    banners: []
  });
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteError, setSiteError] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState<'layout' | 'about' | 'special-offers' | 'notary' | 'blog' | 'banners'>('layout');

  // Site Login inputs
  const [siteLoginUsername, setSiteLoginUsername] = useState('admin');
  const [siteLoginPassword, setSiteLoginPassword] = useState('');
  const [siteLoginError, setSiteLoginError] = useState<string | null>(null);
  const [siteLoginSubmitting, setSiteLoginSubmitting] = useState(false);

  // Products CRUD form/modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null); // null if adding
  const [productFormData, setProductFormData] = useState({
    name: '',
    slug: '',
    description: '',
    specs: '',
    price: '',
    image: '',
    type: 'PHYSICAL',
    categoryId: '',
    downloadUrl: '',
    inventory: ''
  });

  // Selected Order / Ticket view modal states
  const [selectedSiteOrder, setSelectedSiteOrder] = useState<any>(null);
  const [selectedSiteTicket, setSelectedSiteTicket] = useState<any>(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for Escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTicket(null);
        setShowDeleteConfirm(false);
        setShowArchiveConfirm(false);
        setProfileMenuOpen(false);
        setMobileSidebarOpen(false);
        setShowProductModal(false);
        setSelectedSiteOrder(null);
        setSelectedSiteTicket(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Form Submit Handler (local support tickets)
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

  // Delete handler for local support tickets
  const handleDeleteSelected = () => {
    if (selectedRowIds.length === 0) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSelected = () => {
    setTickets(tickets.filter(t => !selectedRowIds.includes(t.id)));
    setSelectedRowIds([]);
    setShowDeleteConfirm(false);
  };

  // Save changes handler for editing local ticket
  const handleSaveChanges = () => {
    if (!editingTicket) return;
    setTickets(prev => prev.map(t => t.id === editingTicket.id ? editingTicket : t));
    setSelectedTicket(null);
    alert('تغییرات با موفقیت ذخیره شد.');
  };

  // Archive Selected Action
  const handleArchiveSelected = () => {
    if (selectedRowIds.length === 0) return;
    setShowArchiveConfirm(true);
  };

  const confirmArchiveSelected = () => {
    setTickets(prev => 
      prev.map(t => selectedRowIds.includes(t.id) ? { ...t, isArchived: true } : t)
    );
    setSelectedRowIds([]);
    setShowArchiveConfirm(false);
  };

  // Archive View Actions
  const handleUnarchiveSelected = () => {
    if (archiveSelectedRowIds.length === 0) return;
    setTickets(prev => 
      prev.map(t => archiveSelectedRowIds.includes(t.id) ? { ...t, isArchived: false } : t)
    );
    setArchiveSelectedRowIds([]);
  };

  const handleDeleteArchivedSelected = () => {
    if (archiveSelectedRowIds.length === 0) return;
    if (window.confirm(`آیا از حذف دائمی ${archiveSelectedRowIds.length} تیکت بایگانی شده مطمئن هستید؟`)) {
      setTickets(tickets.filter(t => !archiveSelectedRowIds.includes(t.id)));
      setArchiveSelectedRowIds([]);
    }
  };

  // Filtering Logic for local tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      if (ticket.isArchived) return false;
      const matchesSearch = 
        ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.mobile.includes(searchQuery) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [tickets, searchQuery]);

  // Archive Filtering Logic
  const filteredArchiveTickets = useMemo(() => {
    return tickets.filter(ticket => {
      if (!ticket.isArchived) return false;
      const matchesSearch = 
        ticket.name.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
        ticket.mobile.includes(archiveSearchQuery) ||
        ticket.description.toLowerCase().includes(archiveSearchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [tickets, archiveSearchQuery]);

  // Archive Pagination Logic
  const archiveTotalPages = Math.ceil(filteredArchiveTickets.length / archiveItemsPerPage);
  const currentArchiveItems = useMemo(() => {
    const startIndex = (archiveCurrentPage - 1) * archiveItemsPerPage;
    return filteredArchiveTickets.slice(startIndex, startIndex + archiveItemsPerPage);
  }, [filteredArchiveTickets, archiveCurrentPage, archiveItemsPerPage]);

  const isAllArchiveSelected = useMemo(() => {
    return currentArchiveItems.length > 0 && currentArchiveItems.every(t => archiveSelectedRowIds.includes(t.id));
  }, [currentArchiveItems, archiveSelectedRowIds]);

  const toggleArchiveRowSelection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setArchiveSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleArchiveSelectAll = () => {
    if (isAllArchiveSelected) {
      setArchiveSelectedRowIds(prev => prev.filter(id => !currentArchiveItems.some(item => item.id === id)));
    } else {
      setArchiveSelectedRowIds(prev => {
        const newIds = currentArchiveItems.map(t => t.id).filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  // Check if all items on current page are selected
  const isAllSelected = useMemo(() => {
    return currentItems.length > 0 && currentItems.every(t => selectedRowIds.includes(t.id));
  }, [currentItems, selectedRowIds]);

  // Toggle selection for individual row
  const toggleRowSelection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Toggle selection for all rows
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds(prev => prev.filter(id => !currentItems.some(item => item.id === id)));
    } else {
      setSelectedRowIds(prev => {
        const newIds = currentItems.map(t => t.id).filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  // Dynamic Statistics
  const stats = useMemo(() => {
    const activeTickets = tickets.filter(t => !t.isArchived);
    const total = activeTickets.length;
    const newCount = activeTickets.filter(t => t.status === 'new').length;
    const progressCount = activeTickets.filter(t => t.status === 'progress').length;
    const closedCount = activeTickets.filter(t => t.status === 'success' || t.status === 'cancel').length;
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

  // Format date helper
  const todayPersianDate = "جمعه ۲۹ خرداد ۱۴۰۵";

  // ==========================================
  // Site Admin API Operations
  // ==========================================
  const loadSiteData = async () => {
    if (!siteToken) return;
    setSiteLoading(true);
    setSiteError(null);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('http://localhost:3000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${siteToken}` }
      });
      if (statsRes.status === 401) {
        handleSiteLogout();
        return;
      }
      const statsData = await statsRes.json();
      if (statsData.success) setSiteStats(statsData.stats);

      // 2. Fetch Products
      const prodRes = await fetch('http://localhost:3000/api/admin/products', {
        headers: { 'Authorization': `Bearer ${siteToken}` }
      });
      const prodData = await prodRes.json();
      if (prodData.success) {
        setSiteProducts(prodData.products);
        setSiteCategories(prodData.categories);
      }

      // 3. Fetch Orders
      const orderRes = await fetch('http://localhost:3000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${siteToken}` }
      });
      const orderData = await orderRes.json();
      if (orderData.success) setSiteOrders(orderData.orders);

      // 4. Fetch Tickets
      const ticketRes = await fetch('http://localhost:3000/api/admin/tickets', {
        headers: { 'Authorization': `Bearer ${siteToken}` }
      });
      const ticketData = await ticketRes.json();
      if (ticketData.success) setSiteTickets(ticketData.tickets);

      // 5. Fetch Blog Posts
      const postsRes = await fetch('http://localhost:3000/api/admin/posts', {
        headers: { 'Authorization': `Bearer ${siteToken}` }
      });
      const postsData = await postsRes.json();
      if (postsData.success) setSitePosts(postsData.posts);

      // 6. Fetch General Settings
      const settingsRes = await fetch('http://localhost:3000/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${siteToken}` }
      });
      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setSiteGeneralSettings(settingsData.settings);
      }

    } catch (err: any) {
      console.error('Error loading site admin data:', err);
      setSiteError('خطا در اتصال به سرور سایت. مطمئن شوید سرور سایت روی پورت ۳۰۰۰ در حال اجراست.');
    } finally {
      setSiteLoading(false);
    }
  };

  useEffect(() => {
    if (isSiteAdminMenu(activeMenu) && siteToken) {
      loadSiteData();
    }
  }, [activeMenu, siteToken]);

  // Auto-open sub-menu when navigating to a site page
  useEffect(() => {
    if (isSiteAdminMenu(activeMenu)) {
      setSiteMenuOpen(true);
    }
  }, [activeMenu]);

  const handleSiteLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteLoginUsername || !siteLoginPassword) {
      setSiteLoginError('وارد کردن نام کاربری و رمز عبور الزامی است.');
      return;
    }
    setSiteLoginSubmitting(true);
    setSiteLoginError(null);
    try {
      const response = await fetch('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: siteLoginUsername,
          password: siteLoginPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'اطلاعات ورود نادرست است.');
      }

      localStorage.setItem('site_admin_token', data.token);
      setSiteToken(data.token);
      setUserRole('manager');
      setSiteLoginPassword('');
    } catch (err: any) {
      setSiteLoginError(err.message || 'خطایی در ورود رخ داده است.');
    } finally {
      setSiteLoginSubmitting(false);
    }
  };

  const handleSiteLogout = () => {
    localStorage.removeItem('site_admin_token');
    setSiteToken(null);
    setSiteStats(null);
    setSiteProducts([]);
    setSiteOrders([]);
    setSiteTickets([]);
    setUserRole('support');
    fetch('http://localhost:3000/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
  };

  // Product save operation
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, slug, description, price, image, type, categoryId, downloadUrl, inventory, specs } = productFormData;
    
    if (!name || !slug || !description || !price || !categoryId) {
      alert('لطفاً تمامی فیلدهای الزامی محصول را پر کنید.');
      return;
    }

    // Try parsing specs JSON to ensure it is valid
    try {
      if (specs) {
        JSON.parse(specs);
      }
    } catch (err) {
      alert('فرمت مشخصات فنی محصول (Specs) باید یک JSON معتبر باشد.');
      return;
    }

    setSiteLoading(true);
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const body = {
        id: editingProduct ? editingProduct.id : undefined,
        name,
        slug,
        description,
        price: parseFloat(price),
        image: image || '/images/placeholder.png',
        type,
        categoryId,
        downloadUrl: type === 'DIGITAL' ? downloadUrl : null,
        inventory: type === 'PHYSICAL' ? parseInt(inventory) : null,
        specs: specs || '{}'
      };

      const response = await fetch('http://localhost:3000/api/admin/products', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${siteToken}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'خطایی در ذخیره‌سازی محصول رخ داد.');
      }

      alert(editingProduct ? 'محصول با موفقیت ویرایش شد.' : 'محصول جدید با موفقیت اضافه شد.');
      setShowProductModal(false);
      setEditingProduct(null);
      loadSiteData();
    } catch (err: any) {
      alert(err.message || 'خطایی رخ داد.');
    } finally {
      setSiteLoading(false);
    }
  };

  // Product delete operation
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`آیا از حذف محصول "${name}" مطمئن هستید؟`)) {
      return;
    }
    setSiteLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${siteToken}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'خطایی در حذف محصول رخ داد.');
      }
      alert('محصول با موفقیت حذف شد.');
      loadSiteData();
    } catch (err: any) {
      alert(err.message || 'خطایی در حذف رخ داد.');
    } finally {
      setSiteLoading(false);
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (id: string, isPaid: boolean) => {
    setSiteLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${siteToken}`
        },
        body: JSON.stringify({ id, isPaid })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'خطایی در بروزرسانی فاکتور رخ داد.');
      }
      if (selectedSiteOrder && selectedSiteOrder.id === id) {
        setSelectedSiteOrder({ ...selectedSiteOrder, isPaid });
      }
      loadSiteData();
    } catch (err: any) {
      alert(err.message || 'خطایی رخ داد.');
    } finally {
      setSiteLoading(false);
    }
  };

  // Ticket status update
  const handleUpdateTicketStatus = async (id: string, status: string) => {
    setSiteLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/admin/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${siteToken}`
        },
        body: JSON.stringify({ id, status })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'خطایی در بروزرسانی تیکت رخ داد.');
      }
      if (selectedSiteTicket && selectedSiteTicket.id === id) {
        setSelectedSiteTicket({ ...selectedSiteTicket, status });
      }
      loadSiteData();
    } catch (err: any) {
      alert(err.message || 'خطایی رخ داد.');
    } finally {
      setSiteLoading(false);
    }
  };

  // Site settings update
  const handleSaveAllSiteSettings = async (updatedSettings: any) => {
    setSiteGeneralSettings(updatedSettings);
    try {
      const response = await fetch('http://localhost:3000/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${siteToken}`
        },
        body: JSON.stringify(updatedSettings)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'خطایی در بروزرسانی تنظیمات رخ داد.');
      }
    } catch (err: any) {
      alert(err.message || 'خطایی در ثبت تنظیمات رخ داد.');
      loadSiteData();
    }
  };

  const handleUpdateSiteSettings = async (key: string, value: any) => {
    const updatedSettings = {
      ...siteGeneralSettings,
      [key]: value
    };
    handleSaveAllSiteSettings(updatedSettings);
  };

  // Client-side HTML5 Canvas cropping and optimization
  const cropAndUploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('امکان ایجاد ابزار برش تصویر وجود ندارد.'));
          return;
        }

        const srcRatio = img.width / img.height;
        const targetRatio = 1200 / 400;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;

        if (srcRatio > targetRatio) {
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetRatio;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 1200, 400);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('خطا در فشرده‌سازی تصویر.'));
            return;
          }

          const formData = new FormData();
          formData.append('file', blob, file.name);

          setSiteLoading(true);
          fetch('http://localhost:3000/api/admin/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${siteToken}`
            },
            body: formData
          })
            .then(res => res.json())
            .then(data => {
              setSiteLoading(false);
              if (data.success && data.imageUrl) {
                resolve(data.imageUrl);
              } else {
                reject(new Error(data.error || 'خطا در بارگذاری فایل.'));
              }
            })
            .catch(err => {
              setSiteLoading(false);
              reject(err);
            });
        }, 'image/jpeg', 0.85);
      };
      img.onerror = () => {
        reject(new Error('امکان خواندن فایل تصویر وجود ندارد.'));
      };
    });
  };

  const handleAddBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (siteGeneralSettings.banners.length >= 5) {
      alert('حداکثر ظرفیت اسلایدر ۵ بنر می‌باشد. ابتدا یکی را حذف کنید.');
      return;
    }
    const file = e.target.files[0];
    try {
      const imageUrl = await cropAndUploadImage(file);
      const newBanner = {
        id: Date.now(),
        image: imageUrl,
        link: '/products',
        title: 'بنر جدید اسلایدر'
      };
      const updatedBanners = [...(siteGeneralSettings.banners || []), newBanner];
      handleSaveAllSiteSettings({
        ...siteGeneralSettings,
        banners: updatedBanners
      });
    } catch (err: any) {
      alert(err.message || 'خطا در آپلود بنر.');
    }
  };

  const handleUpdateBannerField = (bannerId: number, field: 'link' | 'title', value: string) => {
    const updatedBanners = (siteGeneralSettings.banners || []).map(b => 
      b.id === bannerId ? { ...b, [field]: value } : b
    );
    setSiteGeneralSettings(prev => ({
      ...prev,
      banners: updatedBanners
    }));
  };

  const handleSaveBannerChanges = () => {
    handleSaveAllSiteSettings(siteGeneralSettings);
    alert('تغییرات بنرها با موفقیت ذخیره شد.');
  };

  const handleDeleteBanner = (bannerId: number) => {
    if (!window.confirm('آیا از حذف این بنر مطمئن هستید؟')) return;
    const updatedBanners = (siteGeneralSettings.banners || []).filter(b => b.id !== bannerId);
    handleSaveAllSiteSettings({
      ...siteGeneralSettings,
      banners: updatedBanners
    });
  };

  const handleReplaceBannerImage = async (bannerId: number, file: File) => {
    try {
      const imageUrl = await cropAndUploadImage(file);
      const updatedBanners = (siteGeneralSettings.banners || []).map(b => 
        b.id === bannerId ? { ...b, image: imageUrl } : b
      );
      handleSaveAllSiteSettings({
        ...siteGeneralSettings,
        banners: updatedBanners
      });
    } catch (err: any) {
      alert(err.message || 'خطا در جایگزینی تصویر بنر.');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      slug: '',
      description: '',
      specs: '{\n  "برند": "",\n  "مدل": ""\n}',
      price: '',
      image: '',
      type: 'PHYSICAL',
      categoryId: siteCategories[0]?.id || '',
      downloadUrl: '',
      inventory: ''
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (product: any) => {
    setEditingProduct(product);
    let specsStr = '{}';
    try {
      // Specs might be string or object depending on implementation
      specsStr = typeof product.specs === 'string' ? product.specs : JSON.stringify(product.specs, null, 2);
    } catch (e) {}

    setProductFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      specs: specsStr,
      price: String(product.price),
      image: product.image,
      type: product.type,
      categoryId: product.categoryId,
      downloadUrl: product.downloadUrl || '',
      inventory: product.inventory !== null ? String(product.inventory) : ''
    });
    setShowProductModal(true);
  };

  // Helper: check if current menu is a site-admin sub-page
  const isSiteAdminMenu = (menuId: string) => menuId.startsWith('site-');

  // Sidebar Menu Config (dynamic based on role)
  interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    children?: MenuItem[];
  }

  const menuItems: MenuItem[] = useMemo(() => {
    const baseItems: MenuItem[] = [
      { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
      { id: 'forms', label: 'طراحی فرم', icon: FileText },
      { id: 'submissions', label: 'ارسالی‌ها', icon: Send },
      { id: 'reports', label: 'گزارش', icon: BarChart3 },
      { id: 'archive', label: 'بایگانی', icon: Archive },
    ];

    if (userRole === 'manager') {
      baseItems.push({
        id: 'site-admin',
        label: 'مدیریت سایت',
        icon: Sliders,
        children: [
          { id: 'site-settings', label: 'تنظیمات عمومی', icon: Settings },
          { id: 'site-stats', label: 'آمار زنده', icon: Activity },
          { id: 'site-products', label: 'محصولات سایت', icon: Package },
          { id: 'site-orders', label: 'سفارشات مشتریان', icon: ShoppingCart },
          { id: 'site-tickets', label: 'تیکت‌های وب‌سایت', icon: Mail },
        ]
      });
    }

    baseItems.push(
      { id: 'admin', label: 'مدیریت سیستم', icon: Settings },
      { id: 'finance', label: 'امور مالی و حسابداری', icon: Wallet },
      { id: 'chat', label: 'گفتگو آنلاین', icon: MessageSquare }
    );

    return baseItems;
  }, [userRole]);

  if (!siteToken) {
    return (
      <div className="site-admin-login-wrapper" style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleSiteLogin} className="site-admin-login-card">
          <h2 className="site-admin-login-title">ورود به سامانه مدیریت سیدی آیتی</h2>
          <p className="site-admin-login-subtitle">جهت دسترسی به داشبورد و مدیریت سیستم وارد شوید</p>
          {siteLoginError && (
            <div className="site-admin-alert" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', marginBottom: 20 }}>
              <AlertCircle size={16} />
              <span>{siteLoginError}</span>
            </div>
          )}
          <div className="site-admin-login-group">
            <label>نام کاربری</label>
            <input type="text" value={siteLoginUsername} onChange={(e) => setSiteLoginUsername(e.target.value)} className="site-admin-login-input" placeholder="نام کاربری..." disabled={siteLoginSubmitting} />
          </div>
          <div className="site-admin-login-group">
            <label>کلمه عبور</label>
            <input type="password" value={siteLoginPassword} onChange={(e) => setSiteLoginPassword(e.target.value)} className="site-admin-login-input" placeholder="رمز عبور..." disabled={siteLoginSubmitting} />
          </div>
          <button type="submit" className="site-admin-login-btn" disabled={siteLoginSubmitting}>
            {siteLoginSubmitting ? 'در حال برقراری ارتباط...' : 'ورود و احراز هویت'}
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 24, textAlign: 'center' }}>مشخصات پیش‌فرض: admin / admin123456</p>
        </form>
      </div>
    );
  }

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
            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="30" height="36">
              {/* Top-Left Triangle */}
              <polygon points="18,28 49,10 49,46" fill="#2563eb" />
              {/* Top-Right Triangle */}
              <polygon points="82,28 51,10 51,46" fill="#2563eb" />
              {/* Middle Diagonal Parallelogram */}
              <polygon points="18,30 82,67 82,93 18,56" fill="#1e3a8a" />
              {/* Bottom-Left Triangle */}
              <polygon points="18,94 49,112 49,76" fill="#2563eb" />
              {/* Bottom-Right Triangle */}
              <polygon points="82,95 51,113 51,77" fill="#2563eb" />
            </svg>
          </div>
          <span className="logo-text">سیدی آی تی</span>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => {
            const Icon = item.icon;

            // Item with children → collapsible sub-menu
            if (item.children && item.children.length > 0) {
              const isAnyChildActive = item.children.some(child => activeMenu === child.id);
              return (
                <li key={item.id} className="sidebar-parent">
                  <a
                    className={`sidebar-parent-link ${isAnyChildActive ? 'parent-active' : ''}`}
                    onClick={() => {
                      setSiteMenuOpen(prev => !prev);
                    }}
                  >
                    <Icon />
                    <span>{item.label}</span>
                    <ChevronDown className={`submenu-chevron ${siteMenuOpen ? 'rotated' : ''}`} />
                  </a>
                  <ul className={`sidebar-submenu ${siteMenuOpen ? 'open' : ''}`}>
                    {item.children.map(child => {
                      const ChildIcon = child.icon;
                      return (
                        <li key={child.id} className="sidebar-submenu-item">
                          <a
                            className={`sidebar-submenu-link ${activeMenu === child.id ? 'active' : ''}`}
                            onClick={() => {
                              setActiveMenu(child.id);
                              setMobileSidebarOpen(false);
                            }}
                          >
                            <ChildIcon />
                            <span>{child.label}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }

            // Regular item (no children)
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                  <span className="user-name" style={{ fontSize: '0.85rem' }}>علیرضا موحدی</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{userRole === 'manager' ? 'مدیر سیستم' : 'کارشناس پشتیبانی'}</span>
                </div>
                {profileMenuOpen ? <ChevronUp size={16} style={{ marginRight: '4px' }} /> : <ChevronDown size={16} style={{ marginRight: '4px' }} />}
              </div>

              {profileMenuOpen && (
                <>
                  <div className="dropdown-overlay" onClick={() => setProfileMenuOpen(false)} />
                  <div className="profile-dropdown">
                    <div className="dropdown-item">پروفایل</div>
                    <div className="dropdown-item">تنظیمات</div>
                    <hr className="dropdown-divider" />
                    
                    {/* User Role Quick Switcher for testing/demonstration */}
                    <div className="dropdown-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 12px', background: 'var(--bg-base)', borderRadius: '6px', margin: '4px 8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>نقش کاربر:</span>
                      <select 
                        value={userRole} 
                        onChange={(e) => {
                          const role = e.target.value as 'manager' | 'support';
                          setUserRole(role);
                          if (role !== 'manager' && isSiteAdminMenu(activeMenu)) {
                            setActiveMenu('submissions');
                          }
                          setProfileMenuOpen(false);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.8rem', fontFamily: 'var(--font-family)', cursor: 'pointer' }}
                      >
                        <option value="support">کارشناس پشتیبانی</option>
                        <option value="manager">مدیر سیستم (مدیر سایت)</option>
                      </select>
                    </div>
                    
                    <hr className="dropdown-divider" />
                    <div className="dropdown-item">راهنما</div>
                    <div className="dropdown-item">پشتیبانی</div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-item package-info">نوع پکیج: تجاری</div>
                    <div className="dropdown-item">تمدید پکیج</div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-item logout" onClick={() => { setProfileMenuOpen(false); handleSiteLogout(); }}>خروج</div>
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

          {/* ==========================================================================
             Site Admin: Authenticated Content (per sub-page)
             ========================================================================== */}
          {isSiteAdminMenu(activeMenu) && userRole === 'manager' && (
            <div className="dashboard-card">
              <div className="site-admin-header">
                <div>
                  <h2 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    {activeMenu === 'site-settings' && 'تنظیمات عمومی وب‌سایت'}
                    {activeMenu === 'site-stats' && 'آمار زنده وب‌سایت'}
                    {activeMenu === 'site-products' && 'مدیریت محصولات سایت'}
                    {activeMenu === 'site-orders' && 'سفارشات مشتریان'}
                    {activeMenu === 'site-tickets' && 'تیکت‌های دریافتی وب‌سایت'}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>متصل به پایگاه داده از طریق APIهای امن</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" onClick={loadSiteData} title="بروزرسانی داده‌ها">
                    <RefreshCw size={16} className={siteLoading ? 'spin' : ''} />
                    <span>بروزرسانی</span>
                  </button>
                </div>
              </div>

              <div style={{ padding: '0 24px 32px 24px' }}>
                {siteError && (
                  <div className="site-admin-alert" style={{ marginBottom: 24 }}>
                    <AlertTriangle size={18} />
                    <span>{siteError}</span>
                  </div>
                )}

                {activeMenu === 'site-settings' && (
                  <div className="settings-tabbed-container" style={{ display: 'flex', gap: '24px', direction: 'rtl' }}>
                    {/* Tab Navigation Sidebar */}
                    <div className="settings-sidebar" style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        type="button"
                        onClick={() => setSettingsTab('layout')}
                        className={`settings-tab-btn ${settingsTab === 'layout' ? 'active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: settingsTab === 'layout' ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: settingsTab === 'layout' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                          color: settingsTab === 'layout' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          textAlign: 'right',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Sliders size={18} />
                        <span>مدیریت چیدمان و نمایش</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setSettingsTab('banners')}
                        className={`settings-tab-btn ${settingsTab === 'banners' ? 'active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: settingsTab === 'banners' ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: settingsTab === 'banners' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                          color: settingsTab === 'banners' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          textAlign: 'right',
                          transition: 'all 0.2s',
                          opacity: siteGeneralSettings.showBanners ? 1 : 0.55
                        }}
                      >
                        <Archive size={18} />
                        <span>بنرهای اسلایدر</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setSettingsTab('special-offers')}
                        className={`settings-tab-btn ${settingsTab === 'special-offers' ? 'active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: settingsTab === 'special-offers' ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: settingsTab === 'special-offers' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                          color: settingsTab === 'special-offers' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          textAlign: 'right',
                          transition: 'all 0.2s',
                          opacity: siteGeneralSettings.showSpecialOffers ? 1 : 0.55
                        }}
                      >
                        <ShoppingCart size={18} />
                        <span>محصولات پیشنهاد ویژه</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setSettingsTab('notary')}
                        className={`settings-tab-btn ${settingsTab === 'notary' ? 'active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: settingsTab === 'notary' ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: settingsTab === 'notary' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                          color: settingsTab === 'notary' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          textAlign: 'right',
                          transition: 'all 0.2s',
                          opacity: siteGeneralSettings.showProducts ? 1 : 0.55
                        }}
                      >
                        <Package size={18} />
                        <span>محصولات دفترخانه‌ای</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setSettingsTab('blog')}
                        className={`settings-tab-btn ${settingsTab === 'blog' ? 'active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: settingsTab === 'blog' ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: settingsTab === 'blog' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                          color: settingsTab === 'blog' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          textAlign: 'right',
                          transition: 'all 0.2s',
                          opacity: siteGeneralSettings.showBlog ? 1 : 0.55
                        }}
                      >
                        <FileText size={18} />
                        <span>آخرین مطالب وبلاگ</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setSettingsTab('about')}
                        className={`settings-tab-btn ${settingsTab === 'about' ? 'active' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: settingsTab === 'about' ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: settingsTab === 'about' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                          color: settingsTab === 'about' ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          textAlign: 'right',
                          transition: 'all 0.2s'
                        }}
                      >
                        <User size={18} />
                        <span>درباره سیدی آی‌تی</span>
                      </button>
                    </div>

                    {/* Active Settings Panel Content */}
                    <div className="settings-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div className="settings-section-card" style={{ display: settingsTab === 'layout' ? 'block' : 'none' }}>
                      <h3 className="settings-section-title">تنظیمات نمایش بخش‌های صفحه اصلی وب‌سایت</h3>
                      <p className="settings-section-desc">
                        با غیرفعال کردن هر یک از بخش‌های زیر، آن بخش به صورت آنی در صفحه اول وب‌سایت سیدی آی‌تی مخفی خواهد شد.
                      </p>
                      
                      <div className="settings-switches-list">
                        <div className="setting-switch-row">
                          <div className="setting-info">
                            <span className="setting-label">نمایش بنرهای اسلایدر صفحه اصلی</span>
                            <span className="setting-subdesc">کنترل نمایش اسلایدر بنر در بالای صفحه اصلی</span>
                          </div>
                          <label className="ios-switch">
                            <input 
                              type="checkbox" 
                              checked={siteGeneralSettings.showBanners} 
                              onChange={(e) => handleUpdateSiteSettings('showBanners', e.target.checked)} 
                            />
                            <span className="ios-slider"></span>
                          </label>
                        </div>

                        <div className="setting-switch-row">
                          <div className="setting-info">
                            <span className="setting-label">نمایش بخش پیشنهاد ویژه</span>
                            <span className="setting-subdesc">کنترل نمایش بخش محصولات پیشنهاد ویژه (تخفیف‌دار) در صفحه اصلی</span>
                          </div>
                          <label className="ios-switch">
                            <input 
                              type="checkbox" 
                              checked={siteGeneralSettings.showSpecialOffers} 
                              onChange={(e) => handleUpdateSiteSettings('showSpecialOffers', e.target.checked)} 
                            />
                            <span className="ios-slider"></span>
                          </label>
                        </div>

                        <div className="setting-switch-row">
                          <div className="setting-info">
                            <span className="setting-label">نمایش ویژگی‌های کلیدی و نمادهای اعتماد</span>
                            <span className="setting-subdesc">کنترل نمایش بخش سه ویژگی ضمانت، پشتیبانی و ارسال در صفحه اصلی</span>
                          </div>
                          <label className="ios-switch">
                            <input 
                              type="checkbox" 
                              checked={siteGeneralSettings.showFeatures} 
                              onChange={(e) => handleUpdateSiteSettings('showFeatures', e.target.checked)} 
                            />
                            <span className="ios-slider"></span>
                          </label>
                        </div>

                        <div className="setting-switch-row">
                          <div className="setting-info">
                            <span className="setting-label">نمایش محصولات دفترخانه‌ای</span>
                            <span className="setting-subdesc">کنترل نمایش بخش معرفی محصولات دفترخانه‌ای</span>
                          </div>
                          <label className="ios-switch">
                            <input 
                              type="checkbox" 
                              checked={siteGeneralSettings.showProducts} 
                              onChange={(e) => handleUpdateSiteSettings('showProducts', e.target.checked)} 
                            />
                            <span className="ios-slider"></span>
                          </label>
                        </div>

                        <div className="setting-switch-row">
                          <div className="setting-info">
                            <span className="setting-label">نمایش آخرین مطالب وبلاگ آموزشی</span>
                            <span className="setting-subdesc">کنترل نمایش آخرین مقالات منتشر شده در وبلاگ</span>
                          </div>
                          <label className="ios-switch">
                            <input 
                              type="checkbox" 
                              checked={siteGeneralSettings.showBlog} 
                              onChange={(e) => handleUpdateSiteSettings('showBlog', e.target.checked)} 
                            />
                            <span className="ios-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* NEW SECTION: EDIT ABOUT SEYEDI IT TITLE AND TEXT */}
                    <div className="settings-section-card" style={{ display: settingsTab === 'about' ? 'block' : 'none' }}>
                      <h3 className="settings-section-title">تنظیمات بخش درباره سیدی آی‌تی</h3>
                      <p className="settings-section-desc">
                        عنوان و متن اصلی بخش درباره ما را در صفحه اصلی وب‌سایت ویرایش کنید.
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>عنوان بخش درباره ما</label>
                          <input 
                            type="text" 
                            value={siteGeneralSettings.aboutTitle || ''} 
                            onChange={(e) => setSiteGeneralSettings(prev => ({ ...prev, aboutTitle: e.target.value }))} 
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                            placeholder="مثلا: درباره سیدی آی‌تی"
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>متن اصلی بخش درباره ما</label>
                          <textarea 
                            value={siteGeneralSettings.aboutText || ''} 
                            onChange={(e) => setSiteGeneralSettings(prev => ({ ...prev, aboutText: e.target.value }))} 
                            rows={6}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.88rem', resize: 'vertical', lineHeight: '1.6' }}
                            placeholder="متن کامل درباره مجموعه را اینجا بنویسید..."
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button 
                            type="button" 
                            className="btn-extend" 
                            style={{ backgroundColor: 'var(--primary)', fontSize: '0.85rem', padding: '8px 20px' }} 
                            onClick={() => {
                              handleSaveAllSiteSettings(siteGeneralSettings);
                              alert('تنظیمات بخش درباره ما با موفقیت ذخیره شد.');
                            }}
                          >
                            ذخیره تغییرات درباره ما
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SECTION: HOMEPAGE LAYOUT SORTING */}
                    <div className="settings-section-card" style={{ display: settingsTab === 'layout' ? 'block' : 'none', marginTop: '24px' }}>
                      <h3 className="settings-section-title">مدیریت چیدمان و ترتیب بخش‌های صفحه اصلی</h3>
                      <p className="settings-section-desc">
                        ترتیب قرارگیری بخش‌های مختلف صفحه اصلی وب‌سایت را تغییر دهید. بخش‌های خاموش شده از تنظیمات نمایش، در سایت مخفی خواهند بود.
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                        {(siteGeneralSettings.homepageOrder || ["banners", "specialOffers", "about", "features", "products", "blog"]).map((sectionKey, index, arr) => {
                          const SECTION_LABELS: Record<string, string> = {
                            banners: 'اسلایدر بنرهای بالای صفحه',
                            specialOffers: 'بخش پیشنهاد ویژه (محصولات تخفیف‌دار)',
                            about: 'بخش معرفی درباره سیدی آی‌تی',
                            features: 'بخش سه ویژگی کلیدی (ضمانت، پشتیبانی، ارسال)',
                            products: 'بخش محصولات دفترخانه‌ای',
                            blog: 'بخش آخرین مطالب وبلاگ آموزشی'
                          };
                          
                          // Check if section is currently enabled
                          let isEnabled = true;
                          if (sectionKey === 'banners') isEnabled = siteGeneralSettings.showBanners;
                          if (sectionKey === 'specialOffers') isEnabled = siteGeneralSettings.showSpecialOffers;
                          if (sectionKey === 'features') isEnabled = siteGeneralSettings.showFeatures;
                          if (sectionKey === 'products') isEnabled = siteGeneralSettings.showProducts;
                          if (sectionKey === 'blog') isEnabled = siteGeneralSettings.showBlog;

                          return (
                            <div 
                              key={sectionKey} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '12px 16px', 
                                borderRadius: '8px', 
                                backgroundColor: 'var(--bg-base)', 
                                border: '1px solid var(--border)',
                                opacity: isEnabled ? 1 : 0.55
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{index + 1}.</span>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                  {SECTION_LABELS[sectionKey] || sectionKey}
                                </span>
                                {!isEnabled && (
                                  <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>خاموش</span>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                {/* Move Up Button */}
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => {
                                    const newOrder = [...arr];
                                    // Swap elements
                                    const temp = newOrder[index];
                                    newOrder[index] = newOrder[index - 1];
                                    newOrder[index - 1] = temp;
                                    handleSaveAllSiteSettings({
                                      ...siteGeneralSettings,
                                      homepageOrder: newOrder
                                    });
                                  }}
                                  style={{ 
                                    padding: '6px 10px', 
                                    borderRadius: '6px', 
                                    border: '1px solid var(--border)', 
                                    backgroundColor: 'var(--bg-surface)', 
                                    color: index === 0 ? 'var(--text-muted)' : 'var(--text-main)', 
                                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '0.85rem'
                                  }}
                                  title="انتقال به بالا"
                                >
                                  ▲
                                </button>

                                {/* Move Down Button */}
                                <button
                                  type="button"
                                  disabled={index === arr.length - 1}
                                  onClick={() => {
                                    const newOrder = [...arr];
                                    // Swap elements
                                    const temp = newOrder[index];
                                    newOrder[index] = newOrder[index + 1];
                                    newOrder[index + 1] = temp;
                                    handleSaveAllSiteSettings({
                                      ...siteGeneralSettings,
                                      homepageOrder: newOrder
                                    });
                                  }}
                                  style={{ 
                                    padding: '6px 10px', 
                                    borderRadius: '6px', 
                                    border: '1px solid var(--border)', 
                                    backgroundColor: 'var(--bg-surface)', 
                                    color: index === arr.length - 1 ? 'var(--text-muted)' : 'var(--text-main)', 
                                    cursor: index === arr.length - 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '0.85rem'
                                  }}
                                  title="انتقال به پایین"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION: SPECIAL OFFERS PRODUCT MANAGEMENT */}
                    {settingsTab === 'special-offers' && (
                      !siteGeneralSettings.showSpecialOffers ? (
                        <div className="settings-notice-box" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', backgroundColor: 'var(--bg-surface)', borderRight: '4px solid #ef4444', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.8' }}>
                          🔒 <strong>بخش پیشنهاد ویژه غیرفعال است.</strong><br/>
                          برای دسترسی به مدیریت محصولات تخفیف‌دار، ابتدا باید بخش «پیشنهاد ویژه» را در تب <strong>مدیریت چیدمان و نمایش</strong> روشن کنید.
                        </div>
                      ) : (
                        <div className="settings-section-card">
                        <h3 className="settings-section-title">مدیریت محصولات بخش پیشنهاد ویژه</h3>
                        <p className="settings-section-desc">
                          تعیین کنید چه محصولاتی در بخش پیشنهاد ویژه صفحه اصلی نمایش داده شوند.
                        </p>
                        
                        <div className="settings-switches-list" style={{ padding: 0, border: 'none', marginBottom: '16px' }}>
                          <div className="setting-switch-row" style={{ padding: '12px 0' }}>
                            <div className="setting-info">
                              <span className="setting-label">انتخاب خودکار محصولات با بیشترین تخفیف</span>
                              <span className="setting-subdesc">در صورت فعال بودن، محصولاتی که بیشترین درصد تخفیف را دارند به طور خودکار نمایش داده می‌شوند.</span>
                            </div>
                            <label className="ios-switch">
                              <input 
                                type="checkbox" 
                                checked={siteGeneralSettings.specialOffersAuto} 
                                onChange={(e) => handleSaveAllSiteSettings({
                                  ...siteGeneralSettings,
                                  specialOffersAuto: e.target.checked
                                })} 
                              />
                              <span className="ios-slider"></span>
                            </label>
                          </div>
                        </div>

                        {!siteGeneralSettings.specialOffersAuto && (
                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px' }}>محصولات انتخاب شده دستی ({siteGeneralSettings.specialOffersProductIds?.length || 0})</h4>
                            
                            {/* List of currently selected special offers */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                              {(siteGeneralSettings.specialOffersProductIds || []).map((prodId) => {
                                const product = siteProducts.find(p => p.id === prodId);
                                if (!product) return null;
                                return (
                                  <div key={prodId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{product.name}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const updatedList = (siteGeneralSettings.specialOffersProductIds || []).filter(id => id !== prodId);
                                        handleSaveAllSiteSettings({
                                          ...siteGeneralSettings,
                                          specialOffersProductIds: updatedList
                                        });
                                      }}
                                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '4px' }}
                                    >
                                      حذف
                                    </button>
                                  </div>
                                );
                              })}
                              {(siteGeneralSettings.specialOffersProductIds || []).length === 0 && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>هیچ محصولی انتخاب نشده است. برای نمایش، محصولی را از منوی زیر اضافه کنید.</span>
                              )}
                            </div>

                            {/* Dropdown select box to add a product */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <select 
                                defaultValue=""
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  if (!selectedId) return;
                                  const currentList = siteGeneralSettings.specialOffersProductIds || [];
                                  if (currentList.includes(selectedId)) return;
                                  const updatedList = [...currentList, selectedId];
                                  handleSaveAllSiteSettings({
                                    ...siteGeneralSettings,
                                    specialOffersProductIds: updatedList
                                  });
                                  e.target.value = "";
                                }}
                                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'var(--font-family)', cursor: 'pointer' }}
                              >
                                <option value="">-- انتخاب محصول برای افزودن به پیشنهاد ویژه --</option>
                                {siteProducts
                                  .filter(p => !(siteGeneralSettings.specialOffersProductIds || []).includes(p.id))
                                  .map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* SECTION: NOTARY OFFICE PRODUCTS MANAGEMENT */}
                    {settingsTab === 'notary' && (
                      !siteGeneralSettings.showProducts ? (
                        <div className="settings-notice-box" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', backgroundColor: 'var(--bg-surface)', borderRight: '4px solid #ef4444', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.8' }}>
                          🔒 <strong>بخش محصولات دفترخانه‌ای غیرفعال است.</strong><br/>
                          برای دسترسی به مدیریت محصولات دفترخانه‌ای، ابتدا باید این بخش را در تب <strong>مدیریت چیدمان و نمایش</strong> روشن کنید.
                        </div>
                      ) : (
                        <div className="settings-section-card" style={{ marginTop: '24px' }}>
                      <h3 className="settings-section-title">مدیریت محصولات بخش محصولات دفترخانه‌ای</h3>
                      <p className="settings-section-desc">
                        تعیین کنید چه محصولاتی در بخش محصولات دفترخانه‌ای صفحه اصلی نمایش داده شوند. در صورت عدم انتخاب، محصولات به طور خودکار لود می‌شوند.
                      </p>
                      
                      <div style={{ marginTop: '16px' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px' }}>محصولات انتخاب شده دستی ({siteGeneralSettings.notaryProductIds?.length || 0})</h4>
                        
                        {/* List of currently selected notary products */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                          {(siteGeneralSettings.notaryProductIds || []).map((prodId) => {
                            const product = siteProducts.find(p => p.id === prodId);
                            if (!product) return null;
                            return (
                              <div key={prodId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{product.name}</span>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    const updatedList = (siteGeneralSettings.notaryProductIds || []).filter(id => id !== prodId);
                                    handleSaveAllSiteSettings({
                                      ...siteGeneralSettings,
                                      notaryProductIds: updatedList
                                    });
                                  }}
                                  style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '4px' }}
                                >
                                  حذف
                                </button>
                              </div>
                            );
                          })}
                          {(siteGeneralSettings.notaryProductIds || []).length === 0 && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>هیچ محصولی انتخاب نشده است. محصولات به صورت خودکار از دسته‌بندی‌های مربوط به دفاتر لود خواهند شد.</span>
                          )}
                        </div>

                        {/* Dropdown select box to add a notary product */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <select 
                            defaultValue=""
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              if (!selectedId) return;
                              const currentList = siteGeneralSettings.notaryProductIds || [];
                              if (currentList.includes(selectedId)) return;
                              const updatedList = [...currentList, selectedId];
                              handleSaveAllSiteSettings({
                                ...siteGeneralSettings,
                                notaryProductIds: updatedList
                              });
                              e.target.value = "";
                            }}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'var(--font-family)', cursor: 'pointer' }}
                          >
                            <option value="">-- انتخاب محصول برای افزودن به بخش دفترخانه‌ای --</option>
                            {siteProducts
                              .filter(p => !(siteGeneralSettings.notaryProductIds || []).includes(p.id))
                              .map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    ))}

                    {/* SECTION: BLOG POSTS MANAGEMENT */}
                    {settingsTab === 'blog' && (
                      !siteGeneralSettings.showBlog ? (
                        <div className="settings-notice-box" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', backgroundColor: 'var(--bg-surface)', borderRight: '4px solid #ef4444', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.8' }}>
                          🔒 <strong>بخش مطالب وبلاگ غیرفعال است.</strong><br/>
                          برای دسترسی به مدیریت مطالب وبلاگ، ابتدا باید این بخش را در تب <strong>مدیریت چیدمان و نمایش</strong> روشن کنید.
                        </div>
                      ) : (
                        <div className="settings-section-card" style={{ marginTop: '24px' }}>
                      <h3 className="settings-section-title">مدیریت مطالب بخش وبلاگ آموزشی</h3>
                      <p className="settings-section-desc">
                        تعیین کنید چه مطالبی در بخش آخرین مطالب وبلاگ آموزشی صفحه اصلی نمایش داده شوند.
                      </p>
                      
                      <div className="settings-switches-list" style={{ padding: 0, border: 'none', marginBottom: '16px' }}>
                        <div className="setting-switch-row" style={{ padding: '12px 0' }}>
                          <div className="setting-info">
                            <span className="setting-label">انتخاب خودکار آخرین مطالب منتشر شده</span>
                            <span className="setting-subdesc">در صورت فعال بودن، آخرین مقالات منتشر شده به صورت خودکار نمایش داده می‌شوند.</span>
                          </div>
                          <label className="ios-switch">
                            <input 
                              type="checkbox" 
                              checked={siteGeneralSettings.blogPostsAuto} 
                              onChange={(e) => handleSaveAllSiteSettings({
                                ...siteGeneralSettings,
                                blogPostsAuto: e.target.checked
                              })} 
                            />
                            <span className="ios-slider"></span>
                          </label>
                        </div>
                      </div>

                      {!siteGeneralSettings.blogPostsAuto && (
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px' }}>مطالب انتخاب شده دستی ({siteGeneralSettings.blogPostIds?.length || 0})</h4>
                          
                          {/* List of currently selected blog posts */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                            {(siteGeneralSettings.blogPostIds || []).map((postId) => {
                              const post = sitePosts.find(p => p.id === postId);
                              if (!post) return null;
                              return (
                                <div key={postId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{post.title}</span>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      const updatedList = (siteGeneralSettings.blogPostIds || []).filter(id => id !== postId);
                                      handleSaveAllSiteSettings({
                                        ...siteGeneralSettings,
                                        blogPostIds: updatedList
                                      });
                                    }}
                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '4px' }}
                                  >
                                    حذف
                                  </button>
                                </div>
                              );
                            })}
                            {(siteGeneralSettings.blogPostIds || []).length === 0 && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>هیچ مطلبی انتخاب نشده است. برای نمایش، مطلبی را از منوی زیر اضافه کنید.</span>
                            )}
                          </div>

                          {/* Dropdown select box to add a blog post */}
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <select 
                              defaultValue=""
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                if (!selectedId) return;
                                const currentList = siteGeneralSettings.blogPostIds || [];
                                if (currentList.includes(selectedId)) return;
                                const updatedList = [...currentList, selectedId];
                                handleSaveAllSiteSettings({
                                  ...siteGeneralSettings,
                                  blogPostIds: updatedList
                                });
                                e.target.value = "";
                              }}
                              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'var(--font-family)', cursor: 'pointer' }}
                            >
                              <option value="">-- انتخاب مقاله برای افزودن به بخش وبلاگ --</option>
                              {sitePosts
                                .filter(p => !(siteGeneralSettings.blogPostIds || []).includes(p.id))
                                .map(p => (
                                  <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    ))}


                    {/* PAGE: BANNER MANAGEMENT CARD */}
                    {settingsTab === 'banners' && (
                      !siteGeneralSettings.showBanners ? (
                        <div className="settings-notice-box" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', backgroundColor: 'var(--bg-surface)', borderRight: '4px solid #ef4444', color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.8' }}>
                          🔒 <strong>بخش بنرهای اسلایدر غیرفعال است.</strong><br/>
                          برای دسترسی به مدیریت بنرهای اسلایدر، ابتدا باید این بخش را در تب <strong>مدیریت چیدمان و نمایش</strong> روشن کنید.
                        </div>
                      ) : (
                        <div className="settings-section-card" style={{ marginTop: '24px' }}>
                        <h3 className="settings-section-title">مدیریت بنرهای اسلایدر ({siteGeneralSettings.banners?.length || 0} از ۵)</h3>
                        <p className="settings-section-desc">
                          بنرهای اسلایدر بالای صفحه اصلی را مدیریت کنید. شما می‌توانید حداکثر ۵ بنر فعال داشته باشید.
                        </p>
                        
                        {/* Notice for aspect ratio & auto crop */}
                        <div className="settings-notice-box" style={{ marginBottom: '24px', padding: '16px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-base)', borderRight: '4px solid var(--primary)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                          <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>📌 توجه بسیار مهم برای اسلایدر:</strong>
                          ابعاد استاندارد تصاویر بنر اسلایدر <strong>۱۲۰۰ در ۴۰۰ پیکسل</strong> و حداکثر حجم مجاز <strong>۵۰۰ کیلوبایت</strong> می‌باشد. 
                          در صورتی که تصویر انتخابی شما ابعادی غیر از این داشته باشد، سیستم به صورت خودکار آن را به نسبت ۳:۱ کراپ (برش) کرده و جهت حفظ سرعت لود سایت بهینه‌سازی می‌کند.
                        </div>

                        <div className="banners-grid">
                          {(siteGeneralSettings.banners || []).map((banner) => (
                            <div key={banner.id} className="banner-edit-card" style={{ display: 'flex', gap: '20px', padding: '20px', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-md)', marginBottom: '16px', backgroundColor: 'var(--bg-base)' }}>
                              
                              {/* Thumbnail preview with change image button */}
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '180px', flexShrink: 0 }}>
                                <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                                  <img 
                                    src={`http://localhost:3000${banner.image}`} 
                                    alt={banner.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = banner.image;
                                    }}
                                  />
                                </div>
                                <label className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '6px 12px', textAlign: 'center', cursor: 'pointer', display: 'block', margin: 0 }}>
                                  <span>تغییر تصویر</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        handleReplaceBannerImage(banner.id, e.target.files[0]);
                                      }
                                    }} 
                                    style={{ display: 'none' }} 
                                  />
                                </label>
                              </div>

                              {/* Form fields */}
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>عنوان بنر (Alt)</label>
                                    <input 
                                      type="text" 
                                      value={banner.title} 
                                      onChange={(e) => handleUpdateBannerField(banner.id, 'title', e.target.value)} 
                                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.85rem' }} 
                                      placeholder="مثلاً: فروشگاه آنلاین سیدی آی‌تی"
                                    />
                                  </div>
                                  <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>لینک پیوند بنر</label>
                                    <input 
                                      type="text" 
                                      value={banner.link} 
                                      onChange={(e) => handleUpdateBannerField(banner.id, 'link', e.target.value)} 
                                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: '0.85rem', direction: 'ltr', textAlign: 'left' }} 
                                      placeholder="/products"
                                    />
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                  <button 
                                    type="button" 
                                    onClick={() => handleDeleteBanner(banner.id)} 
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '4px 8px' }}
                                  >
                                    <Trash2 size={14} />
                                    <span>حذف این بنر</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Save link changes & Add new banner buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                          <div>
                            {siteGeneralSettings.banners?.length < 5 ? (
                              <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: 'var(--primary)', color: 'white', borderColor: 'var(--primary)' }}>
                                <Plus size={16} />
                                <span>افزودن بنر جدید</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleAddBanner} 
                                  style={{ display: 'none' }} 
                                />
                              </label>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ظرفیت اسلایدر تکمیل است (حداکثر ۵ بنر)</span>
                            )}
                          </div>
                          
                          {siteGeneralSettings.banners?.length > 0 && (
                            <button 
                              type="button" 
                              className="btn-extend" 
                              style={{ backgroundColor: 'var(--primary)', fontSize: '0.85rem', padding: '8px 20px' }} 
                              onClick={handleSaveBannerChanges}
                            >
                              ذخیره تغییرات بنرها
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* PAGE: LIVE STATS */}
                {activeMenu === 'site-stats' && (
                  <div>
                    {siteStats ? (
                      <>
                        <div className="site-admin-stats-grid">
                          <div className="stat-card">
                            <div className="stat-info">
                              <span className="stat-label">محصولات سایت</span>
                              <span className="stat-value">{siteStats.productsCount}</span>
                            </div>
                            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                              <Sliders size={24} />
                            </div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-info">
                              <span className="stat-label">سفارشات کل</span>
                              <span className="stat-value">{siteStats.ordersCount}</span>
                            </div>
                            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                              <Wallet size={24} />
                            </div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-info">
                              <span className="stat-label">کل درآمد سایت</span>
                              <span className="stat-value" style={{ fontSize: '1.25rem' }}>{Number(siteStats.totalRevenue).toLocaleString('fa-IR')} تومان</span>
                            </div>
                            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                              <CheckCircle size={24} />
                            </div>
                          </div>
                          <div className="stat-card">
                            <div className="stat-info">
                              <span className="stat-label">تیکت‌های سایت</span>
                              <span className="stat-value">{siteStats.ticketsCount}</span>
                            </div>
                            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
                              <MessageSquare size={24} />
                            </div>
                          </div>
                        </div>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', backgroundColor: 'var(--bg-base)', marginTop: 24 }}>
                          <h4 style={{ margin: '0 0 20px 0', fontSize: '0.95rem', fontWeight: 700 }}>گزارش وضعیت دیتابیس وب‌سایت</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>در این بخش آمار به صورت لحظه‌ای از دیتابیس SQLite وب‌سایت خوانده می‌شود.</p>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                        <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px auto' }} />
                        <span>در حال بارگذاری آمار زنده وب‌سایت...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* PAGE: PRODUCTS CRUD */}
                {activeMenu === 'site-products' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>لیست محصولات سایت</h3>
                      <button className="btn-extend" onClick={openAddProductModal}><Plus size={16} /><span>افزودن محصول جدید</span></button>
                    </div>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th style={{ width: '60px' }}>ردیف</th><th>تصویر</th><th>نام محصول</th><th>نامک (Slug)</th><th>دسته‌بندی</th><th>قیمت (تومان)</th><th>نوع محصول</th><th>موجودی</th><th style={{ width: '150px' }}>عملیات</th></tr></thead>
                        <tbody>
                          {siteProducts.length > 0 ? (
                            siteProducts.map((product, idx) => (
                              <tr key={product.id}>
                                <td>{idx + 1}</td>
                                <td>
                                  <img 
                                    src={product.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23cccccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'} 
                                    alt={product.name} 
                                    className="product-image-thumbnail" 
                                    onError={(e) => { 
                                      e.currentTarget.onerror = null; 
                                      e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23cccccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'; 
                                    }} 
                                  />
                                </td>
                                <td style={{ fontWeight: 600 }}>{product.name}</td>
                                <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{product.slug}</td>
                                <td>{product.category?.name || 'فاقد دسته‌بندی'}</td>
                                <td style={{ fontWeight: 'bold' }}>{Number(product.price).toLocaleString('fa-IR')}</td>
                                <td>{product.type === 'PHYSICAL' ? 'سخت‌افزار فیزیکی' : 'لایسنس دیجیتال'}</td>
                                <td>{product.type === 'PHYSICAL' ? (product.inventory !== null ? product.inventory : 0) : 'نامحدود (دیجیتال)'}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => openEditProductModal(product)}>ویرایش</button>
                                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => handleDeleteProduct(product.id, product.name)}>حذف</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={9} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>هیچ محصولی در دیتابیس یافت نشد.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* PAGE: ORDERS */}
                {activeMenu === 'site-orders' && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>لیست سفارشات و فاکتورهای مشتریان</h3>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th style={{ width: '60px' }}>ردیف</th><th>مشتری</th><th>شماره تماس</th><th>ایمیل</th><th>مبلغ کل (تومان)</th><th>وضعیت پرداخت</th><th>تاریخ ثبت</th></tr></thead>
                        <tbody>
                          {siteOrders.length > 0 ? (
                            siteOrders.map((order, idx) => (
                              <tr key={order.id} onClick={() => setSelectedSiteOrder(order)} style={{ cursor: 'pointer' }}>
                                <td>{idx + 1}</td>
                                <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                                <td>{order.customerPhone}</td>
                                <td>{order.customerEmail}</td>
                                <td style={{ fontWeight: 'bold' }}>{Number(order.totalAmount).toLocaleString('fa-IR')}</td>
                                <td><span className={`status-pill ${order.isPaid ? 'success' : 'cancel'}`}>{order.isPaid ? 'پرداخت شده' : 'پرداخت نشده'}</span></td>
                                <td style={{ fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>هیچ سفارشی در دیتابیس وجود ندارد.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* PAGE: TICKETS FROM SITE CONTACT FORM */}
                {activeMenu === 'site-tickets' && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>تیکت‌های دریافتی از فرم تماس با ما سایت</h3>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th style={{ width: '60px' }}>ردیف</th><th>فرستنده</th><th>تلفن تماس</th><th>واحد مربوطه</th><th style={{ width: '40%' }}>متن درخواست</th><th>وضعیت بررسی</th><th>تاریخ ارسال</th><th style={{ width: '120px' }}>عملیات</th></tr></thead>
                        <tbody>
                          {siteTickets.length > 0 ? (
                            siteTickets.map((ticket, idx) => (
                              <tr key={ticket.id} onClick={() => setSelectedSiteTicket(ticket)} style={{ cursor: 'pointer' }}>
                                <td>{idx + 1}</td>
                                <td style={{ fontWeight: 600 }}>{ticket.name}</td>
                                <td>{ticket.phone}</td>
                                <td>{ticket.department === 'technical' ? 'پشتیبانی فنی' : ticket.department === 'sales' ? 'فروش' : ticket.department === 'billing' ? 'مالی' : 'مدیریت'}</td>
                                <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{ticket.message}</td>
                                <td><span className={`status-pill ${ticket.status}`}>{ticket.status === 'new' ? 'جدید' : ticket.status === 'progress' ? 'در حال بررسی' : ticket.status === 'success' ? 'بسته شده' : 'لغو شده'}</span></td>
                                <td style={{ fontSize: '0.8rem' }}>{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</td>
                                <td>
                                  <select value={ticket.status} onChange={(e) => { e.stopPropagation(); handleUpdateTicketStatus(ticket.id, e.target.value); }} onClick={(e) => e.stopPropagation()} style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.8rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontFamily: 'var(--font-family)', cursor: 'pointer' }}>
                                    <option value="new">جدید</option>
                                    <option value="progress">بررسی</option>
                                    <option value="success">بسته شد</option>
                                    <option value="cancel">لغو شد</option>
                                  </select>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>هیچ تیکتی از فرم تماس با ما سایت دریافت نشده است.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ==========================================================================
             View 2: Support Ticket Submissions (Original Dashboard functionality)
             ========================================================================== */}
          {activeMenu === 'submissions' && (
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title-row">
                  <h2 className="card-title">درگاه درخواست خدمات انفورماتیک غیر حضوری</h2>
                  <div style={{ display: 'flex', gap: '8px', visibility: selectedRowIds.length > 0 ? 'visible' : 'hidden' }}>
                    <button className="btn-secondary" onClick={handleArchiveSelected}>
                      <span>بایگانی</span>
                    </button>
                    <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={handleDeleteSelected}>
                      <Trash2 size={16} />
                      <span>حذف ({selectedRowIds.length})</span>
                    </button>
                  </div>
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

                {/* Sub Tab Content: Search & Table Filter */}
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
                      <button className="btn-secondary btn-icon-only" onClick={() => window.print()} title="چاپ گزارش">
                        <Printer size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                              checked={isAllSelected}
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
                            <tr 
                              key={ticket.id} 
                              onClick={() => setSelectedTicket(ticket)}
                              className={selectedRowIds.includes(ticket.id) ? 'selected' : ''}
                            >
                              <td className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
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
                    <span className="footer-info">
                      نمایش {filteredTickets.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} تا {Math.min(currentPage * itemsPerPage, filteredTickets.length)} از {filteredTickets.length} رکورد
                    </span>

                    <div className="pagination">
                      <button 
                        className="pagination-btn" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                        title="صفحه اول"
                      >
                        <ChevronsRight size={16} />
                      </button>
                      <button 
                        className="pagination-btn" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        title="صفحه قبل"
                      >
                        <ChevronRight size={16} />
                      </button>

                      <span className="pagination-info">
                        صفحه
                        <input 
                          type="number" 
                          className="page-input" 
                          value={currentPage}
                          min={1}
                          max={totalPages || 1}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= totalPages) setCurrentPage(val);
                          }}
                        />
                        از {totalPages || 1}
                      </span>

                      <button 
                        className="pagination-btn" 
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        title="صفحه بعد"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        className="pagination-btn" 
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(totalPages)}
                        title="صفحه آخر"
                      >
                        <ChevronsLeft size={16} />
                      </button>
                    </div>

                    <div className="per-page-selector">
                      <span>تعداد رکوردهای لیست:</span>
                      <select 
                        className="per-page-select"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(parseInt(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        <option value={5}>۵</option>
                        <option value={10}>۱۰</option>
                        <option value={20}>۲۰</option>
                        <option value={100}>۱۰۰</option>
                      </select>
                    </div>
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

          {/* Archive View */}
          {activeMenu === 'archive' && (
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-title-row">
                  <h2 className="card-title">بخش تیکت‌های بایگانی شده</h2>
                  <div style={{ display: 'flex', gap: '8px', visibility: archiveSelectedRowIds.length > 0 ? 'visible' : 'hidden' }}>
                    <button className="btn-secondary" style={{ color: 'var(--primary)', borderColor: 'var(--border)' }} onClick={handleUnarchiveSelected}>
                      <span>خروج از بایگانی</span>
                    </button>
                    <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={handleDeleteArchivedSelected}>
                      <Trash2 size={16} />
                      <span>حذف دائمی ({archiveSelectedRowIds.length})</span>
                    </button>
                  </div>
                </div>

                <div className="controls-row">
                  <div className="search-box">
                    <Search size={18} style={{ color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="جستجو در بایگانی..."
                      className="search-input"
                      value={archiveSearchQuery}
                      onChange={(e) => {
                        setArchiveSearchQuery(e.target.value);
                        setArchiveCurrentPage(1);
                      }}
                    />
                    {archiveSearchQuery && (
                      <button className="close-btn" style={{ marginLeft: 8 }} onClick={() => setArchiveSearchQuery('')}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="checkbox-cell">
                        <input 
                          type="checkbox" 
                          className="custom-checkbox"
                          checked={isAllArchiveSelected}
                          onChange={toggleArchiveSelectAll}
                        />
                      </th>
                      <th style={{ width: '60px' }}>ردیف</th>
                      <th>تاریخ ثبت</th>
                      <th>نام و نام خانوادگی</th>
                      <th>موبایل</th>
                      <th style={{ width: '35%' }}>شرح ایراد</th>
                      <th>وضعیت کار</th>
                      <th>اولویت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentArchiveItems.length > 0 ? (
                      currentArchiveItems.map((ticket, index) => (
                        <tr 
                          key={ticket.id} 
                          onClick={() => setSelectedTicket(ticket)}
                          className={archiveSelectedRowIds.includes(ticket.id) ? 'selected' : ''}
                        >
                          <td className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              className="custom-checkbox"
                              checked={archiveSelectedRowIds.includes(ticket.id)}
                              onChange={(e) => toggleArchiveRowSelection(ticket.id, e as any)}
                            />
                          </td>
                          <td>{((archiveCurrentPage - 1) * archiveItemsPerPage) + index + 1}</td>
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
                          هیچ تیکت بایگانی شده‌ای یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredArchiveTickets.length > 0 && (
                <div className="table-footer">
                  <span className="footer-info">
                    نمایش {filteredArchiveTickets.length > 0 ? (archiveCurrentPage - 1) * archiveItemsPerPage + 1 : 0} تا {Math.min(archiveCurrentPage * archiveItemsPerPage, filteredArchiveTickets.length)} از {filteredArchiveTickets.length} رکورد
                  </span>

                  <div className="pagination">
                    <button 
                      className="pagination-btn" 
                      disabled={archiveCurrentPage === 1}
                      onClick={() => setArchiveCurrentPage(1)}
                      title="صفحه اول"
                    >
                      <ChevronsRight size={16} />
                    </button>
                    <button 
                      className="pagination-btn" 
                      disabled={archiveCurrentPage === 1}
                      onClick={() => setArchiveCurrentPage(prev => prev - 1)}
                      title="صفحه قبل"
                    >
                      <ChevronRight size={16} />
                    </button>

                    <span className="pagination-info">
                      صفحه
                      <input 
                        type="number" 
                        className="page-input" 
                        value={archiveCurrentPage}
                        min={1}
                        max={archiveTotalPages || 1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= archiveTotalPages) setArchiveCurrentPage(val);
                        }}
                      />
                      از {archiveTotalPages || 1}
                    </span>

                    <button 
                      className="pagination-btn" 
                      disabled={archiveCurrentPage === archiveTotalPages || archiveTotalPages === 0}
                      onClick={() => setArchiveCurrentPage(prev => prev + 1)}
                      title="صفحه بعد"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      className="pagination-btn" 
                      disabled={archiveCurrentPage === archiveTotalPages || archiveTotalPages === 0}
                      onClick={() => setArchiveCurrentPage(archiveTotalPages)}
                      title="صفحه آخر"
                    >
                      <ChevronsLeft size={16} />
                    </button>
                  </div>

                  <div className="per-page-selector">
                    <span>تعداد رکوردهای لیست:</span>
                    <select 
                      className="per-page-select"
                      value={archiveItemsPerPage}
                      onChange={(e) => {
                        setArchiveItemsPerPage(parseInt(e.target.value));
                        setArchiveCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fallback view simulation for other menu links */}
          {activeMenu !== 'submissions' && activeMenu !== 'archive' && !isSiteAdminMenu(activeMenu) && (
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

            {/* Audit Log */}
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

      {/* Delete Confirmation Modal */}
      <div className={`modal-overlay ${showDeleteConfirm ? 'open' : ''}`} onClick={() => setShowDeleteConfirm(false)}>
        <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body delete-confirm-body">
            <div className="delete-confirm-message">
              <AlertTriangle size={28} className="delete-confirm-icon" />
              <span>آیا مطمئن به حذف هستید؟</span>
            </div>
            <div className="delete-confirm-actions">
              <button className="btn-confirm-yes" onClick={confirmDeleteSelected}>بله</button>
              <button className="btn-confirm-no" onClick={() => setShowDeleteConfirm(false)}>خیر</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Archive Confirmation Modal */}
      <div className={`modal-overlay ${showArchiveConfirm ? 'open' : ''}`} onClick={() => setShowArchiveConfirm(false)}>
        <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body delete-confirm-body">
            <div className="delete-confirm-message">
              <Archive size={28} className="delete-confirm-icon" style={{ color: 'var(--primary)' }} />
              <span>آیا مطمئن به بایگانی هستید؟</span>
            </div>
            <div className="delete-confirm-actions">
              <button className="btn-confirm-yes" style={{ backgroundColor: 'var(--primary)' }} onClick={confirmArchiveSelected}>بله</button>
              <button className="btn-confirm-no" onClick={() => setShowArchiveConfirm(false)}>خیر</button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
         NEW MODAL: ADD / EDIT PRODUCT MODAL (SITE ADMIN)
         ========================================================== */}
      {showProductModal && (
        <div className="modal-overlay open" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? `ویرایش محصول: ${editingProduct.name}` : 'افزودن محصول جدید به وب‌سایت'}
              </h3>
              <button className="close-btn" onClick={() => setShowProductModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>نام محصول <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>نامک انگلیسی (Slug) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={productFormData.slug}
                    onChange={(e) => setProductFormData({ ...productFormData, slug: e.target.value })}
                    placeholder="مثال: super-modem-4g"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>دسته‌بندی محصول <span style={{ color: '#ef4444' }}>*</span></label>
                  <select 
                    className="modal-select" 
                    value={productFormData.categoryId}
                    onChange={(e) => setProductFormData({ ...productFormData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">انتخاب دسته‌بندی...</option>
                    {siteCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>قیمت محصول (تومان) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="number" 
                    className="modal-input" 
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>آدرس تصویر محصول</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={productFormData.image}
                    onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                    placeholder="مثال: /images/modem.jpg"
                    style={{ direction: 'ltr', textAlign: 'left' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>نوع محصول</label>
                  <select 
                    className="modal-select" 
                    value={productFormData.type}
                    onChange={(e) => setProductFormData({ ...productFormData, type: e.target.value })}
                  >
                    <option value="PHYSICAL">سخت‌افزار فیزیکی</option>
                    <option value="DIGITAL">لایسنس / فایل دیجیتال</option>
                  </select>
                </div>

                {productFormData.type === 'PHYSICAL' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>تعداد موجودی انبار</label>
                    <input 
                      type="number" 
                      className="modal-input" 
                      value={productFormData.inventory}
                      onChange={(e) => setProductFormData({ ...productFormData, inventory: e.target.value })}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>لینک دانلود فایل لایسنس</label>
                    <input 
                      type="text" 
                      className="modal-input" 
                      value={productFormData.downloadUrl}
                      onChange={(e) => setProductFormData({ ...productFormData, downloadUrl: e.target.value })}
                      placeholder="مثال: /downloads/license.zip"
                      style={{ direction: 'ltr', textAlign: 'left' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>توضیحات کوتاه معرفی محصول <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea 
                    rows={3}
                    className="modal-textarea" 
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>مشخصات فنی محصول (فرمت JSON معتبر)</label>
                  <textarea 
                    rows={4}
                    className="modal-textarea" 
                    value={productFormData.specs}
                    onChange={(e) => setProductFormData({ ...productFormData, specs: e.target.value })}
                    style={{ direction: 'ltr', textAlign: 'left', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>انصراف</button>
                <button type="submit" className="btn-extend">ذخیره تغییرات محصول</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
         NEW MODAL: VIEW SITE ORDER DETAILS (SITE ADMIN)
         ========================================================== */}
      {selectedSiteOrder && (
        <div className="modal-overlay open" onClick={() => setSelectedSiteOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">جزئیات سفارش #{selectedSiteOrder.id.substring(0, 8)}</h3>
              <button className="close-btn" onClick={() => setSelectedSiteOrder(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div><strong>نام مشتری:</strong> {selectedSiteOrder.customerName}</div>
                <div><strong>تلفن تماس:</strong> {selectedSiteOrder.customerPhone}</div>
                <div><strong>ایمیل مشتری:</strong> {selectedSiteOrder.customerEmail}</div>
                <div><strong>مبلغ کل:</strong> {Number(selectedSiteOrder.totalAmount).toLocaleString('fa-IR')} تومان</div>
                <div style={{ gridColumn: 'span 2' }}><strong>آدرس ارسال:</strong> {selectedSiteOrder.shippingAddress || 'تحویل دیجیتالی (ایمیل)'}</div>
                <div style={{ gridColumn: 'span 2', marginTop: 8 }}>
                  <strong>وضعیت فاکتور: </strong> 
                  <span className={`status-pill ${selectedSiteOrder.isPaid ? 'success' : 'cancel'}`}>
                    {selectedSiteOrder.isPaid ? 'پرداخت شده' : 'پرداخت نشده'}
                  </span>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '8px 0 12px 0', fontSize: '0.9rem', fontWeight: 700 }}>اقلام سبد خرید</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedSiteOrder.items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-base)', borderRadius: '6px' }}>
                      <div>{item.product?.name} (x{item.quantity})</div>
                      <div style={{ fontWeight: 'bold' }}>{Number(item.price * item.quantity).toLocaleString('fa-IR')} تومان</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedSiteOrder(null)}>بستن پنجره</button>
              <button 
                className="btn-extend" 
                onClick={() => handleUpdateOrderStatus(selectedSiteOrder.id, !selectedSiteOrder.isPaid)}
                style={{ backgroundColor: selectedSiteOrder.isPaid ? '#ef4444' : '#10b981' }}
              >
                {selectedSiteOrder.isPaid ? 'تغییر به پرداخت نشده' : 'تغییر به پرداخت شده'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
         NEW MODAL: VIEW SITE CONTACT TICKET DETAILS (SITE ADMIN)
         ========================================================== */}
      {selectedSiteTicket && (
        <div className="modal-overlay open" onClick={() => setSelectedSiteTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">مشاهده پیام تماس با ما</h3>
              <button className="close-btn" onClick={() => setSelectedSiteTicket(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div><strong>فرستنده پیام:</strong> {selectedSiteTicket.name}</div>
                <div><strong>شماره تماس:</strong> {selectedSiteTicket.phone}</div>
                <div>
                  <strong>واحد مربوطه:</strong> {' '}
                  {selectedSiteTicket.department === 'technical' ? 'پشتیبانی فنی سخت‌افزار و شبکه' :
                   selectedSiteTicket.department === 'sales' ? 'واحد فروش و استعلام قیمت' :
                   selectedSiteTicket.department === 'billing' ? 'واحد مالی و فاکتورها' : 'ارتباط مستقیم با مدیریت'}
                </div>
                <div><strong>تاریخ ارسال:</strong> {new Date(selectedSiteTicket.createdAt).toLocaleDateString('fa-IR')}</div>
              </div>

              <div>
                <strong style={{ display: 'block', marginBottom: '8px' }}>متن پیام فرستاده شده:</strong>
                <div style={{ padding: 16, backgroundColor: 'var(--bg-base)', borderRadius: 8, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {selectedSiteTicket.message}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>بروزرسانی وضعیت بررسی تیکت:</strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: 8 }}>
                  {['new', 'progress', 'success', 'cancel'].map(s => (
                    <button 
                      key={s}
                      type="button"
                      className={`btn-secondary ${selectedSiteTicket.status === s ? 'active' : ''}`}
                      onClick={() => handleUpdateTicketStatus(selectedSiteTicket.id, s)}
                      style={{ 
                        flex: 1, 
                        justifyContent: 'center',
                        backgroundColor: selectedSiteTicket.status === s ? 'var(--primary)' : 'transparent',
                        color: selectedSiteTicket.status === s ? 'white' : 'var(--text-main)'
                      }}
                    >
                      {s === 'new' ? 'جدید' : s === 'progress' ? 'بررسی' : s === 'success' ? 'انجام شد' : 'لغو شده'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setSelectedSiteTicket(null)}>بستن پنجره</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
