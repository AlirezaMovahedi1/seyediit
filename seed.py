import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from tickets.models import Department, Ticket, TicketLog

# 1. Create Superuser if not exists
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser('admin', 'admin@company.com', 'admin123')
    admin.first_name = "مدیر"
    admin.last_name = "سیستم"
    admin.save()
    print("Superuser 'admin' created.")
else:
    admin = User.objects.get(username='admin')
    print("Superuser 'admin' already exists.")

# 2. Create staff users
staff_users = [
    ('reza', 'رضا', 'رضایی', 'reza123'),
    ('sara', 'سارا', 'احمدی', 'sara123'),
    ('ali', 'علی', 'کریمی', 'ali123')
]

users = [admin]
for username, first, last, pwd in staff_users:
    if not User.objects.filter(username=username).exists():
        u = User.objects.create_user(username, f'{username}@company.com', pwd)
        u.first_name = first
        u.last_name = last
        u.is_staff = True
        u.save()
        users.append(u)
        print(f"User '{username}' created.")
    else:
        users.append(User.objects.get(username=username))

# 3. Clear existing tickets to avoid conflicts
Ticket.objects.all().delete()

# 4. Create Mock Tickets and Logs
tickets_data = [
    {
        "full_name": "خانم اعظم پور",
        "mobile": "09124673445",
        "description": "vpn.756 ارور میده",
        "status": "new",
        "priority": "normal",
    },
    {
        "full_name": "خانم مقصودی",
        "mobile": "09173025851",
        "description": "سامانه ثبت وصل نمیشه",
        "status": "new",
        "priority": "normal",
    },
    {
        "full_name": "خانم حیدری",
        "mobile": "09900386171",
        "description": "vpn وصل نمیشه",
        "status": "new",
        "priority": "normal",
    },
    {
        "full_name": "آقای اسکندری",
        "mobile": "09165688609",
        "description": "ارور کارتریج",
        "status": "new",
        "priority": "normal",
    },
    {
        "full_name": "آقای میرحسینی",
        "mobile": "09133411362",
        "description": "کاتب نصب شود برامون شنبه",
        "status": "new",
        "priority": "normal",
    },
    {
        "full_name": "خانم پنجعلی",
        "mobile": "09196021443",
        "description": "نمایست",
        "status": "new",
        "priority": "normal",
    },
    {
        "full_name": "آقای شجاعی",
        "mobile": "09131988970",
        "description": "مشکل جابجایی پرینتر",
        "status": "new",
        "priority": "normal",
    },
    {
        "full_name": "خانم مرادی",
        "mobile": "09171414623",
        "description": "سامانه اجرا گزارش افزوده بادوتا سیستم میندازتمون بیرون",
        "status": "new",
        "priority": "normal",
    },
]

for i, t_data in enumerate(tickets_data):
    ticket = Ticket.objects.create(
        full_name=t_data["full_name"],
        mobile=t_data["mobile"],
        description=t_data["description"],
        status=t_data["status"],
        priority=t_data["priority"],
        creator=admin
    )
    print(f"Ticket #{ticket.id} created.")
    # Add initial logs
    ticket.add_log(admin, "فرم ثبت اطلاعات ارسال شد.")

print("Seeding finished successfully.")
