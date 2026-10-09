
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Temporary storage
let appointments = [];
let nextId = 1;

// GET: Display all appointments
app.get("/api/appointments", function(req, res) {
    res.json(appointments);
});

// POST: Create an appointment
app.post("/api/appointments", function(req, res) {
    const { name, email, doctor, date } = req.body;

    // Validate the data
    if (!name || !email || !doctor || !date) {
        return res.status(400).json({
            message: "Please fill in all fields"
        });
    }

    // Create appointment
    const appointment = {
        id: nextId++,
        name: name,
        email: email,
        doctor: doctor,
        date: date
    };

    // Save temporarily
    appointments.push(appointment);

    // Send response
    res.status(201).json({
        message: "Appointment booked successfully!",
        appointment: appointment
    });
});

// Handle unknown API routes
app.use("/api", function(req, res) {
    res.status(404).json({
        message: "API route not found"
    });
});

// Handle server errors
app.use(function(err, req, res, next) {
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
});

// Start server
app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}`);
});