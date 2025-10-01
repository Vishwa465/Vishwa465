# Django Appointment Booking System with Stripe Integration

A full-stack web application built with Django (backend) and React (frontend) that demonstrates appointment booking with integrated Stripe payment processing.

## 🚀 Features

- **Appointment Management**: Create, view, and manage appointments
- **Provider Information**: Store provider name, appointment time, and client email
- **Stripe Integration**: Mock payment processing with PaymentIntent creation
- **Real-time Updates**: Dynamic status updates and payment confirmation
- **Admin Interface**: Django admin panel for appointment management
- **REST API**: Complete RESTful API with Django REST Framework
- **Modern UI**: Responsive React frontend with Tailwind CSS

## 📋 Requirements Assessment Compliance

This project fulfills all requirements from the assessment:

✅ **Django Model**: `Appointment` model with `provider_name`, `appointment_time`, and `client_email` fields  
✅ **Form/API Endpoint**: REST API endpoints for creating appointments  
✅ **Mock Payment Flow**: Stripe PaymentIntent creation and confirmation (with mock mode for demonstration)  
✅ **GitHub Integration**: Ready for git workflow with dev/main branch structure  

## 🏗️ Project Structure

```
/app/
├── backend/                    # Django project settings
│   ├── settings.py            # Django configuration
│   ├── urls.py                # URL routing
│   └── ...
├── appointments/              # Django app for appointment management
│   ├── models.py             # Appointment model
│   ├── views.py              # API views and Stripe integration
│   ├── serializers.py        # DRF serializers
│   ├── urls.py               # App URL patterns
│   └── admin.py              # Admin interface configuration
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   └── App.css           # Styles
│   └── package.json          # Frontend dependencies
├── manage.py                  # Django management script
├── requirements.txt           # Python dependencies
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup (Django)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   # The .env file is already configured with development settings
   # For production, update these values:
   SECRET_KEY=your-django-secret-key
   STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

3. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```
   *Default admin credentials are already set up: admin/admin123*

5. **Start Django development server:**
   ```bash
   python manage.py runserver 0.0.0.0:8001
   ```

### Frontend Setup (React)

1. **Install Node.js dependencies:**
   ```bash
   cd frontend
   yarn install
   ```

2. **Start React development server:**
   ```bash
   yarn start
   ```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api/
- **Django Admin**: http://localhost:8001/admin/

## 📡 API Endpoints

### Appointments
- `GET /api/appointments/` - List all appointments
- `POST /api/appointments/` - Create new appointment
- `GET /api/appointments/{id}/` - Get specific appointment
- `PUT /api/appointments/{id}/` - Update appointment
- `DELETE /api/appointments/{id}/` - Delete appointment

### Stripe Payment Integration
- `POST /api/create-payment-intent/` - Create Stripe PaymentIntent
- `POST /api/confirm-payment/` - Confirm payment status

### Health Check
- `GET /api/health/` - API health status

## 💳 Stripe Integration

### How It Works

The application demonstrates a complete Stripe payment flow:

1. **Payment Intent Creation**: When a user wants to pay for an appointment, the frontend calls the `/api/create-payment-intent/` endpoint
2. **Mock Mode**: The system automatically detects if real Stripe keys are configured. If not, it uses mock mode for demonstration
3. **Payment Confirmation**: After payment processing (simulated), the `/api/confirm-payment/` endpoint updates the appointment status

### Mock vs Real Mode

**Mock Mode** (Default for demonstration):
- Activated when using placeholder Stripe keys
- Creates mock PaymentIntent IDs (format: `pi_mock_{appointment_id}_{amount}`)
- Simulates successful payment confirmation
- Perfect for testing and demonstration

**Real Mode** (With valid Stripe keys):
- Uses actual Stripe API calls
- Creates real PaymentIntents
- Handles actual payment processing
- Requires valid Stripe test or live keys

### Setting Up Real Stripe Integration

1. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Update `.env` file with your keys:
   ```bash
   STRIPE_PUBLIC_KEY=pk_test_your_actual_public_key
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
   ```
3. Restart the Django server

## 🧪 Testing the Application

### Manual Testing

1. **Create an Appointment:**
   ```bash
   curl -X POST http://localhost:8001/api/appointments/ \
     -H \"Content-Type: application/json\" \
     -d '{
       \"provider_name\": \"Dr. Smith\",
       \"appointment_time\": \"2025-12-25T10:00:00Z\",
       \"client_email\": \"john@example.com\"
     }'
   ```

2. **Create Payment Intent:**
   ```bash
   curl -X POST http://localhost:8001/api/create-payment-intent/ \
     -H \"Content-Type: application/json\" \
     -d '{\"appointment_id\": 1, \"amount\": 5000}'
   ```

3. **Confirm Payment:**
   ```bash
   curl -X POST http://localhost:8001/api/confirm-payment/ \
     -H \"Content-Type: application/json\" \
     -d '{\"payment_intent_id\": \"pi_mock_1_5000\"}'
   ```

### Using the Web Interface

1. Open http://localhost:3000 in your browser
2. Fill out the appointment form
3. Click \"Book Appointment\"
4. Click \"Pay $50.00\" to process payment
5. Watch the appointment status update to \"PAID\"

## 🔧 Development

### Django Admin

Access the Django admin at http://localhost:8001/admin/ to:
- View and manage appointments
- Monitor payment statuses
- Access user management

Default credentials: `admin` / `admin123`

### Database

The application uses SQLite for development (stored in `db.sqlite3`). The database includes:
- Appointment model with payment tracking
- Django's built-in user authentication
- Admin interface integration

## 🚀 Deployment Notes

For production deployment:

1. **Security**: Update `SECRET_KEY` and set `DEBUG=False`
2. **Database**: Consider PostgreSQL for production
3. **Static Files**: Configure static file serving
4. **CORS**: Update CORS settings for your domain
5. **Stripe**: Use live Stripe keys for production

## 📝 Git Workflow

This project is ready for the assessment git workflow:

1. **Clone the repository** (as provided in assessment)
2. **Work on dev branch** (default branch)
3. **Commit your changes** to dev branch
4. **Create pull request** from dev to main branch

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in the run commands
2. **Module not found**: Ensure virtual environment is activated and dependencies are installed
3. **Database errors**: Run `python manage.py migrate`
4. **CORS issues**: Check `CORS_ALLOWED_ORIGINS` in Django settings

### Checking Services

- **Django**: `curl http://localhost:8001/api/health/`
- **React**: `curl http://localhost:3000`
- **Database**: `python manage.py shell` then `from appointments.models import Appointment; print(Appointment.objects.count())`

## 📚 Additional Notes

### Architecture Decisions

1. **Django REST Framework**: Chosen for robust API development with built-in serialization and validation
2. **React Frontend**: Modern, responsive UI with real-time state management
3. **SQLite Database**: Simple setup for development, easily replaceable with PostgreSQL for production
4. **Mock Stripe Integration**: Allows demonstration without requiring actual Stripe account setup

### Future Enhancements

- User authentication and authorization
- Email notifications for appointments
- Calendar integration
- Advanced payment options
- Appointment scheduling conflicts prevention
- Real-time notifications

---

**Assessment Requirements Fulfilled:**
- ✅ Django project with Appointment model
- ✅ Form/API endpoint for appointment creation
- ✅ Mock Stripe payment flow demonstration
- ✅ Complete setup instructions
- ✅ Git-ready project structure
