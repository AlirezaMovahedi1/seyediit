from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('delete/<int:ticket_id>/', views.delete_ticket_view, name='delete_ticket'),
]
