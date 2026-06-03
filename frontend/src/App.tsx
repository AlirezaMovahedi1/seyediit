import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Ticket,
  FileText,
  BarChart2,
  Sun,
  Moon,
  Search,
  Trash2,
  Eye,
  Edit3,
  PlusCircle,
  User,
  Clock,
  Activity,
  Phone,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  CornerDownRight,
  Briefcase
} from 'lucide-react'

// Define interfaces for TypeScript typings
interface TicketType {
  id: number
  full_name: string
  mobile: string
  description: string
  status: string
  status_display: string
  priority: string
  priority_display: string
  created_at: string
  updated_at: string
  creator: string
  assignee: string
}

interface StatsType {
  total: number
  new: number
  in_progress: number
  resolved: number
  closed: number
  normal: number
  high: number
  critical: number
}

interface LogType {
  id: number
  ticket_id: number
  ticket_name: string
  action: string
  user: string
  created_at: string
}

// Setup axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  }
})

function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'form' | 'table' | 'report'>('table')
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  // Core Data States
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    new: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    normal: 0,
    high: 0,
    critical: 0
  })
  const [logs, setLogs] = useState<LogType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')

  // Form Fields State
  const [ticketId, setTicketId] = useState<number | null>(null)
  const [fullName, setFullName] = useState<string>('')
  const [mobile, setMobile] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [statusVal, setStatusVal] = useState<string>('new')
  const [priorityVal, setPriorityVal] = useState<string>('normal')

  // Modals State
  const [viewTicket, setViewTicket] = useState<TicketType | null>(null)
  const [viewModalTab, setViewModalTab] = useState<'details' | 'logs'>('details')
  const [deleteConfirmTicket, setDeleteConfirmTicket] = useState<TicketType | null>(null)

  // Manage Dark Mode Theme toggling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // Fetch Tickets on Filter changes
  useEffect(() => {
    fetchTickets()
    fetchStats()
  }, [searchQuery, statusFilter, priorityFilter])

  // Fetch tickets API call
  const fetchTickets = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const response = await api.get('/tickets/', {
        params: {
          q: searchQuery,
          status: statusFilter,
          priority: priorityFilter
        }
      })
      setTickets(response.data)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('خطا در دریافت لیست تیکت‌ها از سرور. لطفاً مطمئن شوید سرور جنگو فعال است.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch Stats API call
  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/')
      setStats(response.data.stats)
      setLogs(response.data.logs)
    } catch (err) {
      console.error(err)
    }
  }

  // Form submit (create or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !mobile || !description) {
      alert('لطفاً تمامی فیلدهای اجباری را تکمیل فرمایید.')
      return
    }

    try {
      const payload = {
        ticket_id: ticketId,
        full_name: fullName,
        mobile: mobile,
        description: description,
        status: statusVal,
        priority: priorityVal
      }
      await api.post('/tickets/', payload)
      
      // Reset Form State
      resetForm()
      
      // Refresh Data
      fetchTickets()
      fetchStats()
      
      // Navigate to grid view
      setActiveTab('table')
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || 'خطا در ثبت اطلاعات تیکت.')
    }
  }

  // Handle delete action
  const handleDelete = async () => {
    if (!deleteConfirmTicket) return
    try {
      await api.post(`/tickets/${deleteConfirmTicket.id}/delete/`)
      setDeleteConfirmTicket(null)
      fetchTickets()
      fetchStats()
    } catch (err) {
      console.error(err)
      alert('خطا در حذف تیکت.')
    }
  }

  // Populate form for editing and redirect to form tab
  const handleEditClick = (ticket: TicketType) => {
    setTicketId(ticket.id)
    setFullName(ticket.full_name)
    setMobile(ticket.mobile)
    setDescription(ticket.description)
    setStatusVal(ticket.status)
    setPriorityVal(ticket.priority)
    
    // Switch to Form tab
    setActiveTab('form')
  }

  const resetForm = () => {
    setTicketId(null)
    setFullName('')
    setMobile('')
    setDescription('')
    setStatusVal('new')
    setPriorityVal('normal')
  }

  // Helpers to render status and priority badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
      case 'closed':
        return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400'
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'normal':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300'
      case 'critical':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800'
    }
  }

  // Filter logs for specific ticket in modal
  const ticketLogs = viewTicket ? logs.filter(log => log.ticket_id === viewTicket.id) : []

  return (
    <div className="flex flex-row min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* 1. LEFT HOVER-EXPANDABLE SIDEBAR */}
      <aside className="w-16 hover:w-64 transition-all duration-300 ease-in-out flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-md group z-30 shrink-0">
        
        {/* Sidebar Header Brand */}
        <div className="h-16 flex items-center justify-center border-b border-slate-100 dark:border-slate-700 px-4 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 shadow-sm">
              <Ticket size={20} />
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              سیدی آی‌تی
            </span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {/* Tab 2: Grid List */}
          <button
            onClick={() => setActiveTab('table')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group-hover:justify-start ${
              activeTab === 'table'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <div className="flex items-center justify-center w-6 shrink-0">
              <FileText size={20} />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
              جدول اطلاعات
            </span>
          </button>

          {/* Tab 1: Form submission */}
          <button
            onClick={() => {
              resetForm()
              setActiveTab('form')
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group-hover:justify-start ${
              activeTab === 'form'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <div className="flex items-center justify-center w-6 shrink-0">
              <PlusCircle size={20} />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
              ثبت اطلاعات جدید
            </span>
          </button>

          {/* Tab 3: Report & stats */}
          <button
            onClick={() => setActiveTab('report')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group-hover:justify-start ${
              activeTab === 'report'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <div className="flex items-center justify-center w-6 shrink-0">
              <BarChart2 size={20} />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm">
              گزارشات و آمار
            </span>
          </button>
        </nav>

        {/* Sidebar Footer User Panel */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 overflow-hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shrink-0">
              A
            </div>
            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                کاربر ادمین
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                admin@seyediit.ir
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* 2. TOP NAVBAR */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm z-20 shrink-0">
          
          {/* Header Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold bg-gradient-to-l from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              سامانه یکپارچه مدیریت تیکتینگ سیدی آی‌تی
            </h1>
          </div>

          {/* Theme switcher and user actions */}
          <div className="flex items-center gap-4">
            
            {/* Sync button */}
            <button
              onClick={() => {
                fetchTickets()
                fetchStats()
              }}
              title="بروزرسانی اطلاعات"
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin text-indigo-600' : ''} />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title={darkMode ? 'حالت روشن' : 'حالت تاریک'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                پشتیبان فعال
              </span>
            </div>
          </div>
        </header>

        {/* 3. MAIN TAB CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 flex items-center gap-3">
              <AlertTriangle className="shrink-0" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          {/* TAB 1: FORM VIEW ("ثبت اطلاعات") */}
          {activeTab === 'form' && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {ticketId ? 'ویرایش اطلاعات تیکت' : 'ثبت اطلاعات تیکت جدید'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    فرم مربوط به مشخصات و جزئیات تیکت پشتیبانی سیدی آی‌تی
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                      نام و نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: مریم رستمی"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-950 transition-all text-sm outline-none"
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                      شماره موبایل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="مثال: 09123456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-950 transition-all text-sm outline-none"
                      dir="ltr"
                      required
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                      وضعیت درخواست
                    </label>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-950 transition-all text-sm outline-none"
                    >
                      <option value="new">جدید (New)</option>
                      <option value="in_progress">در حال بررسی (In Progress)</option>
                      <option value="resolved">حل شده (Resolved)</option>
                      <option value="closed">بسته شده (Closed)</option>
                    </select>
                  </div>

                  {/* Priority Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                      درجه اهمیت (اولویت)
                    </label>
                    <select
                      value={priorityVal}
                      onChange={(e) => setPriorityVal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-950 transition-all text-sm outline-none"
                    >
                      <option value="normal">عادی (Normal)</option>
                      <option value="high">بالا (High)</option>
                      <option value="critical">بحرانی (Critical)</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                    توضیحات و شرح مشکل درخواست <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="جزئیات مشکل فنی یا درخواست کاربر را در این بخش با جزئیات کامل بنویسید..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-950 transition-all text-sm outline-none"
                    required
                  ></textarea>
                </div>

                {/* Submit Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                  {ticketId && (
                    <button
                      type="button"
                      onClick={() => {
                        resetForm()
                        setActiveTab('table')
                      }}
                      className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      انصراف
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-8 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-md hover:shadow-indigo-500/20"
                  >
                    {ticketId ? 'بروزرسانی اطلاعات' : 'ثبت تیکت جدید'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: GRID TABLE VIEW ("جدول اطلاعات") */}
          {activeTab === 'table' && (
            <div className="space-y-6">
              
              {/* Search & Filter Header bar */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-5">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  
                  {/* Live Search Input */}
                  <div className="relative w-full md:max-w-md">
                    <Search size={18} className="absolute right-4 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="جستجو در نام، شماره تماس، توضیحات..."
                      className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-950 transition-all text-sm outline-none"
                    />
                  </div>

                  {/* Dropdown Filters */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Status filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">وضعیت:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="">همه وضعیت‌ها</option>
                        <option value="new">جدید</option>
                        <option value="in_progress">در حال بررسی</option>
                        <option value="resolved">حل شده</option>
                        <option value="closed">بسته شده</option>
                      </select>
                    </div>

                    {/* Priority filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">اولویت:</span>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option value="">همه اولویت‌ها</option>
                        <option value="normal">عادی</option>
                        <option value="high">بالا</option>
                        <option value="critical">بحرانی</option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchQuery || statusFilter || priorityFilter) && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setStatusFilter('')
                          setPriorityFilter('')
                        }}
                        className="px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer"
                      >
                        پاکسازی فیلترها
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* Data Table Grid */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-right">
                    
                    {/* Table Header */}
                    <thead>
                      <tr className="bg-slate-50/60 dark:bg-slate-900/30 text-slate-400 text-xs font-bold border-b border-slate-100 dark:border-slate-700">
                        <th className="px-6 py-4">شناسه</th>
                        <th className="px-6 py-4">نام و نام خانوادگی</th>
                        <th className="px-6 py-4">شماره موبایل</th>
                        <th className="px-6 py-4">وضعیت</th>
                        <th className="px-6 py-4">اولویت</th>
                        <th className="px-6 py-4">تاریخ ثبت</th>
                        <th className="px-6 py-4 text-center">عملیات</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                            <div className="flex justify-center items-center gap-3">
                              <RefreshCw className="animate-spin text-indigo-600" />
                              <span>در حال بارگذاری اطلاعات تیکت‌ها...</span>
                            </div>
                          </td>
                        </tr>
                      ) : tickets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                            هیچ تیکتی با مشخصات وارد شده پیدا نشد.
                          </td>
                        </tr>
                      ) : (
                        tickets.map((ticket) => (
                          <tr
                            key={ticket.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            {/* ID */}
                            <td className="px-6 py-4 font-mono font-bold text-slate-400">
                              #{ticket.id}
                            </td>
                            
                            {/* Name */}
                            <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                              {ticket.full_name}
                            </td>
                            
                            {/* Mobile */}
                            <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                              {ticket.mobile}
                            </td>
                            
                            {/* Status */}
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(ticket.status)}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                                {ticket.status_display}
                              </span>
                            </td>
                            
                            {/* Priority */}
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                                {ticket.priority_display}
                              </span>
                            </td>
                            
                            {/* Created At */}
                            <td className="px-6 py-4 text-xs text-slate-400">
                              {ticket.created_at}
                            </td>

                            {/* Actions dropdown/buttons */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {/* View Button */}
                                <button
                                  onClick={() => {
                                    setViewTicket(ticket)
                                    setViewModalTab('details')
                                  }}
                                  title="مشاهده جزئیات کامل"
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Eye size={16} />
                                </button>

                                {/* Edit Button */}
                                <button
                                  onClick={() => handleEditClick(ticket)}
                                  title="ویرایش درخواست"
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit3 size={16} />
                                </button>

                                {/* Delete Button */}
                                <button
                                  onClick={() => setDeleteConfirmTicket(ticket)}
                                  title="حذف دائمی"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>

                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REPORTS VIEW ("گزارشات و آمار") */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              
              {/* Stat Counters grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Stats card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-1.5 w-full bg-indigo-600"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">کل تیکت‌ها</span>
                      <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.total}</span>
                    </div>
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <FileText size={24} />
                    </div>
                  </div>
                </div>

                {/* New Stats card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-1.5 w-full bg-blue-500"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">جدید</span>
                      <span className="text-3xl font-black text-blue-500">{stats.new}</span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-xl">
                      <Clock size={24} />
                    </div>
                  </div>
                </div>

                {/* In Progress Stats card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-1.5 w-full bg-amber-500"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">در حال بررسی</span>
                      <span className="text-3xl font-black text-amber-500">{stats.in_progress}</span>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl">
                      <Activity size={24} />
                    </div>
                  </div>
                </div>

                {/* Resolved Stats card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-1.5 w-full bg-emerald-500"></div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block mb-1">حل شده</span>
                      <span className="text-3xl font-black text-emerald-500">{stats.resolved}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
                      <CheckCircle2 size={24} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Priorities Overview & Recent Logs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Priorities breakdown card */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 lg:col-span-1">
                  <h3 className="text-md font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                    اولویت و درجه اهمیت تیکت‌ها
                  </h3>

                  <div className="space-y-4">
                    {/* Critical */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">بحرانی</span>
                      </div>
                      <span className="font-mono text-sm font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-lg">
                        {stats.critical} درخواست
                      </span>
                    </div>

                    {/* High */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">اولویت بالا</span>
                      </div>
                      <span className="font-mono text-sm font-bold bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-lg">
                        {stats.high} درخواست
                      </span>
                    </div>

                    {/* Normal */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-slate-400"></span>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">عادی</span>
                      </div>
                      <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                        {stats.normal} درخواست
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit Timeline Logs card */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 lg:col-span-2">
                  <h3 className="text-md font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                    لاگ‌های سیستمی و گزارش فعالیت‌ها
                  </h3>

                  <div className="flow-root max-h-[320px] overflow-y-auto pr-2">
                    <ul className="-mb-8">
                      {logs.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">
                          هیچ رویدادی تاکنون ثبت نشده است.
                        </p>
                      ) : (
                        logs.map((log, logIdx) => (
                          <li key={log.id}>
                            <div className="relative pb-8">
                              {logIdx !== logs.length - 1 ? (
                                <span className="absolute top-4 right-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-slate-700" aria-hidden="true"></span>
                              ) : null}
                              
                              <div className="relative flex space-x-3 space-x-reverse items-start">
                                {/* Activity Icon badge */}
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
                                    <Activity size={14} />
                                  </span>
                                </div>

                                {/* Log Details text */}
                                <div className="flex-1 min-w-0 pt-1">
                                  <p className="text-sm text-slate-600 dark:text-slate-300">
                                    <span className="font-bold text-slate-800 dark:text-white pl-1">
                                      {log.user}
                                    </span>
                                    {log.action}
                                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mr-2 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                                      تیکت #{log.ticket_id} ({log.ticket_name})
                                    </span>
                                  </p>
                                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{log.created_at}</span>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* 4. MODALS & POPUPS SECTION */}
      {/* ======================================================== */}

      {/* A. DETAILED TICKET VIEW MODAL (2 COLUMNS WITH TABS) */}
      {viewTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-slate-50 dark:bg-slate-900 px-8 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900">
                  تیکت #{viewTicket.id}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {viewTicket.full_name}
                </h3>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setViewTicket(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs Navigator */}
            <div className="px-8 border-b border-slate-100 dark:border-slate-700 flex gap-4 text-sm font-semibold">
              <button
                onClick={() => setViewModalTab('details')}
                className={`py-3 border-b-2 transition-all ${
                  viewModalTab === 'details'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                مشخصات و اطلاعات کامل تیکت
              </button>
              <button
                onClick={() => setViewModalTab('logs')}
                className={`py-3 border-b-2 transition-all ${
                  viewModalTab === 'logs'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                سوابق و تاریخچه تغییرات ({ticketLogs.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              
              {/* SUBTAB 1: TICKET INFORMATION DETAILS */}
              {viewModalTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  
                  {/* Left Column */}
                  <div className="space-y-4">
                    
                    {/* Client Name */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">نام و نام خانوادگی درخواست‌دهنده</span>
                      <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        {viewTicket.full_name}
                      </span>
                    </div>

                    {/* Mobile Number */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">شماره تماس مشتری</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-white flex items-center gap-2" dir="ltr">
                        <Phone size={16} className="text-slate-400" />
                        {viewTicket.mobile}
                      </span>
                    </div>

                    {/* Status & Priority Badge Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 block mb-2">وضعیت فعلی</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(viewTicket.status)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                          {viewTicket.status_display}
                        </span>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 block mb-2">سطح اولویت</span>
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityBadgeClass(viewTicket.priority)}`}>
                          {viewTicket.priority_display}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 flex flex-col">
                    
                    {/* Date Details */}
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">تاریخ ایجاد</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          {viewTicket.created_at}
                        </span>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">آخرین ویرایش</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          {viewTicket.updated_at}
                        </span>
                      </div>

                    </div>

                    {/* Assignment details */}
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                      
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">ثبت‌کننده</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          {viewTicket.creator}
                        </span>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">کارشناس مسئول</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Briefcase size={14} className="text-slate-400" />
                          {viewTicket.assignee}
                        </span>
                      </div>

                    </div>

                    {/* Description Text */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex-1 min-h-[140px] flex flex-col">
                      <span className="text-xs text-slate-400 block mb-2 shrink-0">توضیحات و شرح مشکل تیکت</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap flex-1">
                        {viewTicket.description}
                      </p>
                    </div>

                  </div>

                </div>
              )}

              {/* SUBTAB 2: TIMELINE CHANGES AND AUDIT LOGS FOR THIS TICKET */}
              {viewModalTab === 'logs' && (
                <div className="space-y-4">
                  {ticketLogs.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-8">
                      هیچ تغییر یا رویدادی برای این تیکت به ثبت نرسیده است.
                    </p>
                  ) : (
                    <div className="flow-root pr-2">
                      <ul className="-mb-8">
                        {ticketLogs.map((log, logIdx) => (
                          <li key={log.id}>
                            <div className="relative pb-8">
                              {logIdx !== ticketLogs.length - 1 ? (
                                <span className="absolute top-4 right-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-slate-700" aria-hidden="true"></span>
                              ) : null}
                              <div className="relative flex space-x-3 space-x-reverse items-start">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
                                    <CornerDownRight size={14} />
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                  <p className="text-sm text-slate-600 dark:text-slate-300">
                                    <span className="font-bold text-slate-800 dark:text-white pl-1">{log.user}</span>
                                    {log.action}
                                  </p>
                                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{log.created_at}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-900 px-8 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setViewTicket(null)}
                className="px-6 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
              <button
                onClick={() => {
                  handleEditClick(viewTicket)
                  setViewTicket(null)
                }}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                ویرایش این تیکت
              </button>
            </div>

          </div>

        </div>
      )}

      {/* B. DELETE CONFIRMATION WARNING MODAL (CENTER OF SCREEN) */}
      {deleteConfirmTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Body */}
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 mb-5">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                آیا از حذف این تیکت مطمئن هستید؟
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                شما در حال حذف تیکت متعلق به <span className="font-bold text-slate-800 dark:text-white">«{deleteConfirmTicket.full_name}»</span> هستید.
                این عملیات غیر قابل بازگشت بوده و تمامی اطلاعات تیکت و لاگ‌های مرتبط با آن به طور کامل و دائمی از پایگاه داده حذف خواهد شد.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirmTicket(null)}
                  className="flex-1 px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  خیر، انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-red-500/10"
                >
                  بله، حذف شود
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default App
