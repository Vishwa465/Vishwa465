from django.db import models
from django.utils import timezone


class Appointment(models.Model):
    """Model for storing appointment information"""
    
    provider_name = models.CharField(
        max_length=100,
        help_text="Name of the service provider"
    )
    
    appointment_time = models.DateTimeField(
        help_text="Date and time of the appointment"
    )
    
    client_email = models.EmailField(
        help_text="Email address of the client"
    )
    
    # Additional fields for better functionality
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Payment related fields
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('failed', 'Failed'),
            ('cancelled', 'Cancelled'),
        ],
        default='pending'
    )
    
    stripe_payment_intent_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Stripe PaymentIntent ID"
    )
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"Appointment with {self.provider_name} for {self.client_email} at {self.appointment_time}"
