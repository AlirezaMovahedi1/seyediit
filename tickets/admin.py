from django.contrib import admin
from .models import Department, Ticket, TicketLog

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

class TicketLogInline(admin.TabularInline):
    model = TicketLog
    readonly_fields = ('user', 'action', 'created_at')
    extra = 0
    can_delete = False

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'mobile', 'priority', 'status', 'creator', 'assignee', 'created_at')
    list_filter = ('status', 'priority', 'created_at')
    search_fields = ('full_name', 'mobile', 'description', 'creator__username', 'assignee__username')
    inlines = [TicketLogInline]
    
    def save_model(self, request, obj, form, change):
        is_new = not obj.pk
        super().save_model(request, obj, form, change)
        
        if is_new:
            obj.add_log(request.user, "فرم ثبت اطلاعات ارسال شد.")
        else:
            # بررسی تغییرات وضعیت یا ارجاع
            changes = []
            if 'status' in form.changed_data:
                changes.append(f"وضعیت به '{obj.get_status_display()}' تغییر یافت.")
            if 'assignee' in form.changed_data:
                assignee_name = obj.assignee.get_full_name() or obj.assignee.username if obj.assignee else "هیچکس"
                changes.append(f"مسئول رسیدگی به '{assignee_name}' تغییر یافت.")
            if 'priority' in form.changed_data:
                changes.append(f"اولویت به '{obj.get_priority_display()}' تغییر یافت.")
            
            if changes:
                obj.add_log(request.user, " | ".join(changes))

@admin.register(TicketLog)
class TicketLogAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'user', 'action', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('ticket__full_name', 'user__username', 'action')
