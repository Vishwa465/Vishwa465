from django.urls import path
from . import views

app_name = 'appointments'

urlpatterns = [
    # Appointment CRUD endpoints
    path('appointments/', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    
    # Payment endpoints
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('confirm-payment/', views.confirm_payment, name='confirm-payment'),
    
    # Health check
    path('health/', views.health_check, name='health-check'),
]
