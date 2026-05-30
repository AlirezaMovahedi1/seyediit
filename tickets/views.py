from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Q
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Ticket, Department, TicketLog

def auto_login_dev(request):
    """
    برای راحتی تست، اگر کاربر لاگین نکرده باشد، به صورت خودکار با کاربر ادمین لاگین می‌شود.
    """
    if not request.user.is_authenticated:
        admin_user = User.objects.filter(username='admin').first()
        if admin_user:
            login(request, admin_user)

def dashboard_view(request):
    # لاگین خودکار جهت تسهیل تست محصول
    auto_login_dev(request)
    
    # دریافت پارامترهای فیلتر و جستجو
    search_query = request.GET.get('q', '')
    status_filter = request.GET.get('status', '')
    priority_filter = request.GET.get('priority', '')

    # فیلتر کردن تیکت‌ها
    tickets = Ticket.objects.all().select_related('creator', 'assignee')
    
    if search_query:
        tickets = tickets.filter(
            Q(full_name__icontains=search_query) | 
            Q(mobile__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    if status_filter:
        tickets = tickets.filter(status=status_filter)
    
    if priority_filter:
        tickets = tickets.filter(priority=priority_filter)

    # ثبت یا ویرایش تیکت (POST)
    if request.method == 'POST':
        ticket_id = request.POST.get('ticket_id')
        full_name = request.POST.get('full_name')
        mobile = request.POST.get('mobile')
        description = request.POST.get('description')
        status = request.POST.get('status', 'new')
        priority = request.POST.get('priority', 'normal')
        
        if full_name and mobile and description:
            if ticket_id:  # عملیات ویرایش
                ticket = get_object_or_404(Ticket, id=ticket_id)
                ticket.full_name = full_name
                ticket.mobile = mobile
                ticket.description = description
                ticket.status = status
                ticket.priority = priority
                ticket.save()
                ticket.add_log(request.user if request.user.is_authenticated else None, "اطلاعات ویرایش و بروزرسانی شد.")
            else:  # عملیات ایجاد
                ticket = Ticket.objects.create(
                    full_name=full_name,
                    mobile=mobile,
                    description=description,
                    status=status,
                    priority=priority,
                    creator=request.user if request.user.is_authenticated else None
                )
                ticket.add_log(request.user if request.user.is_authenticated else None, "فرم ثبت اطلاعات ارسال شد.")
            
            # در صورتی که درخواست AJAX باشد
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'status': 'success', 'ticket_id': ticket.id})
                
            return redirect('dashboard')

    # محاسبه آمار و ارقام گزارش‌ها
    total_tickets = Ticket.objects.count()
    status_counts = Ticket.objects.values('status').annotate(count=Count('id'))
    priority_counts = Ticket.objects.values('priority').annotate(count=Count('id'))
    
    # ساخت دیکشنری‌های کمکی برای آمار
    stats = {
        'total': total_tickets,
        'new': 0,
        'in_progress': 0,
        'resolved': 0,
        'closed': 0,
        'normal': 0,
        'high': 0,
        'critical': 0,
    }
    
    for item in status_counts:
        stats[item['status']] = item['count']
        
    for item in priority_counts:
        stats[item['priority']] = item['count']

    # آخرین لاگ‌های سیستم برای تب گزارش و نظارت
    recent_logs = TicketLog.objects.all().select_related('ticket', 'user')[:10]
    departments = Department.objects.all()

    context = {
        'tickets': tickets,
        'departments': departments,
        'stats': stats,
        'recent_logs': recent_logs,
        'filters': {
            'q': search_query,
            'status': status_filter,
            'priority': priority_filter,
        }
    }
    return render(request, 'tickets/dashboard.html', context)

def delete_ticket_view(request, ticket_id):
    """
    حذف درخواست از طریق درخواست POST امن.
    """
    auto_login_dev(request)
    if request.method == 'POST':
        ticket = get_object_or_404(Ticket, id=ticket_id)
        ticket.delete()
    return redirect('dashboard')
