from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('delete/<int:ticket_id>/', views.delete_ticket_view, name='delete_ticket'),
    
    # API endpoints for React
    path('api/tickets/', views.api_tickets_list, name='api_tickets_list'),
    path('api/tickets/<int:ticket_id>/delete/', views.api_ticket_delete, name='api_ticket_delete'),
    path('api/stats/', views.api_dashboard_stats, name='api_dashboard_stats'),
]
