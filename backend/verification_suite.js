const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const AUTH_URL = `${BASE_URL}/auth`;
const PATIENT_URL = `${BASE_URL}/patient`;
const DOCTOR_URL = `${BASE_URL}/doctor`;
const ADMIN_URL = `${BASE_URL}/admin`;

// Test Data
const patientUser = {
    name: "Test Patient",
    email: `patient_${Date.now()}@test.com`,
    password: "password123",
    role: "patient",
    phone: "1234567890",
    dateOfBirth: "1990-01-01",
    gender: "male"
};

const doctorUser = {
    name: "Test Doctor",
    email: `doctor_${Date.now()}@test.com`,
    password: "password123",
    role: "doctor",
    phone: "0987654321",
    dateOfBirth: "1980-01-01",
    gender: "female",
    department: "Cardiology",
    specialization: "MBBS, MD"
};

const adminUser = { // specific seed admin or new one? prefer login existing admin if possible, but let's try creating one to be self-contained or use seed credentials
    email: "admin@hospital.com",
    password: "admin123"
};

let patientToken = "";
let doctorToken = "";
let adminToken = "";
let doctorId = "";

const fs = require('fs');

function log(message) {
    console.log(message);
    fs.appendFileSync('verification_output.txt', message + '\n', 'utf8');
}

async function runTests() {
    fs.writeFileSync('verification_output.txt', '', 'utf8'); // Clear previous log
    log("🚀 Starting Backend Verification Suite...");

    try {
        // 1. Register Patient
        log("\n1️⃣  Testing Patient Registration...");
        try {
            const res = await axios.post(`${AUTH_URL}/register`, patientUser);
            log(`✅ Patient Registered: ${res.status === 201 || res.status === 200}`);
        } catch (e) {
            log(`❌ Patient Registration Failed: ${e.response?.data?.message || e.message}`);
            if (e.response?.data) log(`   Details: ${JSON.stringify(e.response.data)}`);
        }

        // 2. Login Patient
        log("\n2️⃣  Testing Patient Login...");
        try {
            const res = await axios.post(`${AUTH_URL}/login`, { email: patientUser.email, password: patientUser.password });
            patientToken = res.data.token;
            log(`✅ Patient Login Successful. Token received.`);
        } catch (e) {
            log(`❌ Patient Login Failed: ${e.response?.data?.message || e.message}`);
        }

        // 3. Register Doctor
        log("\n3️⃣  Testing Doctor Registration...");
        try {
            const res = await axios.post(`${AUTH_URL}/register`, doctorUser);
            log(`✅ Doctor Registered: ${res.status === 201 || res.status === 200}`);
        } catch (e) {
            log(`❌ Doctor Registration Failed: ${e.response?.data?.message || e.message}`);
            if (e.response?.data) log(`   Details: ${JSON.stringify(e.response.data)}`);
        }

        // 4. Login Doctor
        log("\n4️⃣  Testing Doctor Login...");
        try {
            const res = await axios.post(`${AUTH_URL}/login`, { email: doctorUser.email, password: doctorUser.password });
            doctorToken = res.data.token;
            if (res.data.user && (res.data.user.id || res.data.user._id)) {
                doctorId = res.data.user.id || res.data.user._id;
            } else {
                try {
                    const meRes = await axios.get(`${AUTH_URL}/me`, { headers: { Authorization: `Bearer ${doctorToken}` } });
                    doctorId = meRes.data.data._id || meRes.data.data.id;
                } catch (err) {
                    log(`   Could not fetch doctor ID from /me: ${err.message}`);
                }
            }
            log(`✅ Doctor Login Successful. Doctor ID: ${doctorId}`);
        } catch (e) {
            log(`❌ Doctor Login Failed: ${e.response?.data?.message || e.message}`);
        }

        // 5. Patient Books Appointment
        log("\n5️⃣  Testing Appointment Booking...");
        if (patientToken && doctorId) {
            try {
                const appointmentData = {
                    doctor: doctorId,
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                    time: "10:00",
                    reason: "General Checkup"
                };
                const res = await axios.post(`${PATIENT_URL}/appointment`, appointmentData, {
                    headers: { Authorization: `Bearer ${patientToken}` }
                });
                log(`✅ Appointment Booked: ${res.status === 201 || res.status === 200}`);
            } catch (e) {
                log(`❌ Appointment Booking Failed: ${e.response?.data?.message || e.message}`);
                if (e.response?.data) log(`   Details: ${JSON.stringify(e.response.data)}`);
            }
        } else {
            log("⚠️  Skipping Appointment Booking (Missing token or doctor ID)");
        }

        // 6. Admin Login
        log("\n6️⃣  Testing Admin Login...");
        try {
            const res = await axios.post(`${AUTH_URL}/login`, adminUser);
            adminToken = res.data.token;
            log(`✅ Admin Login Successful.`);
        } catch (e) {
            log(`❌ Admin Login Failed: ${e.response?.data?.message || e.message}`);
        }

        // 7. Admin View Users
        log("\n7️⃣  Testing Admin View Users...");
        if (adminToken) {
            try {
                const res = await axios.get(`${ADMIN_URL}/users`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                log(`✅ Admin Fetched Users: Found ${res.data.count || res.data.length || 'some'} users`);
            } catch (e) {
                log(`❌ Admin View Users Failed: ${e.response?.data?.message || e.message}`);
            }

            // 8. Admin Get Insurances
            log("\n8️⃣  Testing Admin Get Insurances...");
            try {
                const res = await axios.get(`${ADMIN_URL}/insurances`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                log(`✅ Admin Fetched Insurances: ${res.status === 200}`);
            } catch (e) {
                log(`❌ Admin Get Insurances Failed: ${e.response?.data?.message || e.message}`);
            }

            // 9. Admin Create & Update Bill
            log("\n9️⃣  Testing Admin Create & Update Bill...");
            try {
                // Create Bill first
                // We need a patient ID.
                const usersRes = await axios.get(`${ADMIN_URL}/users`, { headers: { Authorization: `Bearer ${adminToken}` } });
                const patient = usersRes.data.find(u => u.role === 'patient');
                if (patient) {
                    const billRes = await axios.post(`${ADMIN_URL}/bill`, {
                        patient: patient._id,
                        appointment: null, // might fail if required? Model says not required.
                        amount: 100,
                        description: "Test Bill",
                        dueDate: new Date()
                    }, { headers: { Authorization: `Bearer ${adminToken}` } });

                    const billId = billRes.data._id;
                    log(`   Created Bill ID: ${billId}`);

                    // Update Status
                    const updateRes = await axios.put(`${ADMIN_URL}/bill/${billId}/status`, {
                        status: 'paid'
                    }, { headers: { Authorization: `Bearer ${adminToken}` } });
                    log(`✅ Admin Updated Bill Status: ${updateRes.status === 200} (Status: ${updateRes.data.status})`);

                } else {
                    log("⚠️  Skipping Bill Test (No patient found)");
                }

            } catch (e) {
                log(`❌ Admin Bill Test Failed: ${e.response?.data?.message || e.message}`);
                if (e.response?.data) log(`   Details: ${JSON.stringify(e.response.data)}`);
            }
        } else {
            log("⚠️  Skipping Admin View Users, Insurances, and Bill Tests (Missing token)");
        }

        log("\n🏁 Verification Complete.");

    } catch (error) {
        log(`❌ Unexpected Error in Test Suite: ${error.message}`);
    }
}

runTests();
