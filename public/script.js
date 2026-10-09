
const form = document.getElementById("appointmentForm");
const message = document.getElementById("message");
const appointmentsDiv = document.getElementById("appointments");

// Book an appointment
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const appointment = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        doctor: document.getElementById("doctor").value,
        date: document.getElementById("date").value
    };

    try {
        const response = await fetch("/api/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointment)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        message.textContent = data.message;
        message.style.color = "green";

        form.reset();

        loadAppointments();

    } catch (error) {
        message.textContent = error.message || "Something went wrong";
        message.style.color = "red";
    }
});

// Get all appointments
async function loadAppointments() {
    try {
        const response = await fetch("/api/appointments");

        if (!response.ok) {
            throw new Error("Could not load appointments");
        }

        const appointments = await response.json();

        appointmentsDiv.replaceChildren();

        if (appointments.length === 0) {
            appointmentsDiv.textContent = "No appointments yet.";
            return;
        }

        appointments.forEach(function(appointment) {
            const card = document.createElement("div");
            card.className = "appointment";

            const details = [
                `Name: ${appointment.name}`,
                `Email: ${appointment.email}`,
                `Doctor: ${appointment.doctor}`,
                `Date: ${appointment.date}`
            ];

            details.forEach(function(detail) {
                const line = document.createElement("p");
                line.textContent = detail;
                card.appendChild(line);
            });

            appointmentsDiv.appendChild(card);
        });

    } catch (error) {
        appointmentsDiv.textContent = error.message;
    }
}

// Load appointments when the page opens
loadAppointments();