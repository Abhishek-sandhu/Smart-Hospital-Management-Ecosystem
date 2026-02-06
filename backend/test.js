const axios = require('axios');

async function testGetAppointments() {
  try {
    // Login as patient
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test2@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;

    // Get appointments
    const response = await axios.get('http://localhost:5000/api/patient/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Appointments response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testGetAppointments();