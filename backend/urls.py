from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    """Root API endpoint"""
    return JsonResponse({
        'message': 'Django Appointment Booking API',
        'version': '1.0.0',
        'endpoints': {
            'appointments': '/api/appointments/',
            'admin': '/admin/',
            'health': '/api/health/'
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('appointments.urls')),
    path('api/', root_view, name='api-root'),
    path('', root_view, name='root'),
]
