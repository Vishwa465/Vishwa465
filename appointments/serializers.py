from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for Appointment model"""
    
    class Meta:
        model = Appointment
        fields = [
            'id',
            'provider_name',
            'appointment_time',
            'client_email',
            'payment_status',
            'stripe_payment_intent_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'stripe_payment_intent_id']
        
    def validate_appointment_time(self, value):
        """Ensure appointment is not in the past"""
        from django.utils import timezone
        
        if value < timezone.now():
            raise serializers.ValidationError("Appointment time cannot be in the past.")
        return value


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments"""
    
    class Meta:
        model = Appointment
        fields = ['provider_name', 'appointment_time', 'client_email']
        
    def validate_appointment_time(self, value):
        """Ensure appointment is not in the past"""
        from django.utils import timezone
        
        if value < timezone.now():
            raise serializers.ValidationError("Appointment time cannot be in the past.")
        return value
