import stripe
from django.conf import settings
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentCreateSerializer

# Set up Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class AppointmentListCreateView(generics.ListCreateAPIView):
    """View to list all appointments and create new ones"""
    
    queryset = Appointment.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    def perform_create(self, serializer):
        """Save the appointment with pending payment status"""
        serializer.save(payment_status='pending')


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, or delete a specific appointment"""
    
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


@api_view(['POST'])
def create_payment_intent(request):
    """Create a Stripe PaymentIntent for an appointment"""
    
    try:
        appointment_id = request.data.get('appointment_id')
        amount = request.data.get('amount', 5000)  # Default $50.00 in cents
        
        if not appointment_id:
            return Response(
                {'error': 'appointment_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Appointment not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency='usd',
            metadata={
                'appointment_id': appointment_id,
                'provider_name': appointment.provider_name,
                'client_email': appointment.client_email
            },
            automatic_payment_methods={'enabled': True}
        )
        
        # Update appointment with PaymentIntent ID
        appointment.stripe_payment_intent_id = intent.id
        appointment.save()
        
        return Response({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id,
            'amount': amount
        })
        
    except Exception as e:
        return Response(
            {'error': f'Stripe error: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def confirm_payment(request):
    """Confirm payment and update appointment status"""
    
    try:
        payment_intent_id = request.data.get('payment_intent_id')
        
        if not payment_intent_id:
            return Response(
                {'error': 'payment_intent_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Retrieve PaymentIntent from Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        # Find appointment by PaymentIntent ID
        try:
            appointment = Appointment.objects.get(
                stripe_payment_intent_id=payment_intent_id
            )
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Appointment not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update appointment based on payment status
        if intent.status == 'succeeded':
            appointment.payment_status = 'paid'
        elif intent.status in ['requires_payment_method', 'requires_confirmation']:
            appointment.payment_status = 'pending'
        else:
            appointment.payment_status = 'failed'
        
        appointment.save()
        
        return Response({
            'status': appointment.payment_status,
            'appointment': AppointmentSerializer(appointment).data
        })
        
    except Exception as e:
        return Response(
            {'error': f'Stripe error: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Server error: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'Django appointment booking API is running'
    })
