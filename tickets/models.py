from django.db import models
from django.contrib.auth.models import User

class Department(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام دپارتمان")
    code = models.CharField(max_length=50, unique=True, verbose_name="کد دپارتمان")

    class Meta:
        verbose_name = "دپارتمان"
        verbose_name_plural = "دپارتمان‌ها"

    def __str__(self):
        return self.name

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('new', 'جدید'),
        ('in_progress', 'در حال بررسی'),
        ('resolved', 'پاسخ داده شده'),
        ('closed', 'بسته شده'),
    ]

    PRIORITY_CHOICES = [
        ('normal', 'عادی'),
        ('high', 'فوری'),
        ('critical', 'بحرانی'),
    ]

    full_name = models.CharField(max_length=200, verbose_name="نام و نام خانوادگی")
    mobile = models.CharField(max_length=20, verbose_name="موبایل")
    description = models.TextField(verbose_name="شرح ایراد")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name="آخرین وضعیت کار")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal', verbose_name="اولویت")
    
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets', verbose_name="ایجاد کننده", null=True, blank=True)
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets', verbose_name="مسئول رسیدگی")
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='tickets', verbose_name="دپارتمان", null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ آخرین بروزرسانی")

    class Meta:
        verbose_name = "تیکت"
        verbose_name_plural = "تیکت‌ها"
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.id} - {self.full_name} ({self.get_status_display()})"

    def add_log(self, user, action):
        """
        یک لاگ جدید برای این تیکت ثبت می‌کند.
        """
        return TicketLog.objects.create(ticket=self, user=user, action=action)

class TicketLog(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='logs', verbose_name="تیکت")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="کاربر")
    action = models.TextField(verbose_name="اقدام")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")

    class Meta:
        verbose_name = "لاگ تیکت"
        verbose_name_plural = "لاگ‌های تیکت‌ها"
        ordering = ['-created_at']

    def __str__(self):
        user_str = self.user.username if self.user else "سیستم"
        return f"تیکت #{self.ticket.id} - توسط {user_str} در {self.created_at.strftime('%Y-%m-%d %H:%M')}"
