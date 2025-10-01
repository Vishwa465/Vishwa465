import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    provider_name: '',
    appointment_time: '',
    client_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await axios.get(`${API}/health/`);
      console.log('Backend connection:', response.data);
    } catch (error) {
      console.error('Backend connection failed:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API}/appointments/`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setMessage('Error fetching appointments');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API}/appointments/`, formData);
      console.log('Appointment created:', response.data);
      setMessage('Appointment created successfully!');
      setFormData({ provider_name: '', appointment_time: '', client_email: '' });
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      setMessage(`Error: ${error.response?.data?.detail || 'Failed to create appointment'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (appointmentId) => {
    setPaymentLoading(true);
    setMessage('');

    try {
      // Create payment intent
      const paymentResponse = await axios.post(`${API}/create-payment-intent/`, {
        appointment_id: appointmentId,
        amount: 5000 // $50.00 in cents
      });

      console.log('Payment Intent created:', paymentResponse.data);
      
      // Simulate successful payment (in real app, you'd use Stripe Elements)
      setTimeout(async () => {
        try {
          const confirmResponse = await axios.post(`${API}/confirm-payment/`, {
            payment_intent_id: paymentResponse.data.payment_intent_id
          });
          
          console.log('Payment confirmed:', confirmResponse.data);
          setMessage(`Payment processed! Status: ${confirmResponse.data.status}`);
          fetchAppointments();
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError);
          setMessage('Error processing payment confirmation');
        } finally {
          setPaymentLoading(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error creating payment:', error);
      setMessage(`Payment Error: ${error.response?.data?.error || 'Payment failed'}`);
      setPaymentLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      paid: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booking System</h1>
          <p className="text-gray-600">Django + React + Stripe Integration</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') || message.includes('failed') 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book New Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="provider_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name
                </label>
                <input
                  type="text"
                  id="provider_name"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Dr. Smith"
                  data-testid="provider-name-input"
                />
              </div>

              <div>
                <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="appointment_time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  data-testid="appointment-time-input"
                />
              </div>

              <div>
                <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  id="client_email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="client@example.com"
                  data-testid="client-email-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="book-appointment-btn"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Appointments ({appointments.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No appointments booked yet.</p>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900" data-testid={`appointment-${appointment.id}-provider`}>
                          {appointment.provider_name}
                        </h3>
                        <p className="text-sm text-gray-600" data-testid={`appointment-${appointment.id}-email`}>
                          {appointment.client_email}
                        </p>
                        <p className="text-sm text-gray-600" data-testid={`appointment-${appointment.id}-time`}>
                          {formatDateTime(appointment.appointment_time)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.payment_status)}`}
                            data-testid={`appointment-${appointment.id}-status`}>
                        {appointment.payment_status.toUpperCase()}
                      </span>
                    </div>
                    
                    {appointment.payment_status === 'pending' && (
                      <button
                        onClick={() => handlePayment(appointment.id)}
                        disabled={paymentLoading}
                        className="mt-2 bg-green-600 text-white py-1 px-3 rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        data-testid={`pay-appointment-${appointment.id}-btn`}
                      >
                        {paymentLoading ? 'Processing...' : 'Pay $50.00'}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-8 text-center">
          <a
            href="/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            data-testid="admin-link"
          >
            Django Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;