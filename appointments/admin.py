from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    """Admin configuration for Appointment model"""
    
    list_display = [
        'id',
        'provider_name',
        'client_email',
        'appointment_time',
        'payment_status',
        'created_at'
    ]
    
    list_filter = [
        'payment_status',
        'created_at',
        'appointment_time'
    ]
    
    search_fields = [
        'provider_name',
        'client_email',
        'stripe_payment_intent_id'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'stripe_payment_intent_id'
    ]
    
    date_hierarchy = 'appointment_time'
    
    ordering = ['-created_at']
