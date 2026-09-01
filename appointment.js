let patients =
    JSON.parse(
        localStorage.getItem("careSyncPatients")
    ) || [];


let appointments =
    JSON.parse(
        localStorage.getItem("careSyncAppointments")
    ) || [];


let selectedPatient = null;


/* FIND PATIENT */

function findPatient() {

    patients =
        JSON.parse(
            localStorage.getItem("careSyncPatients")
        ) || [];


    const query =
        document
            .getElementById("patientSearch")
            .value
            .trim()
            .toLowerCase();


    const result =
        document.getElementById("patientResult");


    if (!query) {

        result.style.display = "none";

        selectedPatient = null;

        return;
    }


    const patient =
        patients.find(p =>

            String(p.id || "")
                .toLowerCase()
                .includes(query)

            ||

            String(p.name || "")
                .toLowerCase()
                .includes(query)

            ||

            String(p.mobile || "")
                .toLowerCase()
                .includes(query)

        );


    if (!patient) {

        result.innerHTML =
            "❌ Patient not found.";

        result.style.display = "block";

        selectedPatient = null;

        return;
    }


    selectedPatient = patient;


    result.innerHTML = `

        <strong>
            ${escapeHTML(patient.name)}
        </strong>

        <br>

        Patient ID:
        ${escapeHTML(patient.id)}

        <br>

        Mobile:
        ${escapeHTML(patient.mobile || "—")}

    `;


    result.style.display = "block";
}


/* BOOK APPOINTMENT */

function bookAppointment() {

    if (!selectedPatient) {

        alert(
            "Please search and select a patient first."
        );

        return;
    }


    const doctor =
        document.getElementById("doctor").value;

    const date =
        document.getElementById("appointmentDate").value;

    const time =
        document.getElementById("appointmentTime").value;


    if (!doctor) {

        alert("Please select a doctor.");

        return;
    }


    if (!date) {

        alert("Please select a date.");

        return;
    }


    if (!time) {

        alert("Please select a time.");

        return;
    }


    appointments =
        JSON.parse(
            localStorage.getItem(
                "careSyncAppointments"
            )
        ) || [];


    const sameDay =
        appointments.filter(
            a => a.date === date
        );


    const token =
        sameDay.length + 1;


    const appointment = {

        id:
            "APT-" + Date.now(),

        patientID:
            selectedPatient.id,

        patientName:
            selectedPatient.name,

        doctor:
            doctor,

        date:
            date,

        time:
            time,

        token:
            token,

        status:
            "Waiting",

        createdAt:
            new Date().toISOString()

    };


    appointments.push(
        appointment
    );


    localStorage.setItem(
        "careSyncAppointments",
        JSON.stringify(appointments)
    );


    const success =
        document.getElementById("success");


    success.innerHTML = `

        ✅ Appointment booked successfully!

        <br>

        Patient:
        <strong>
            ${escapeHTML(selectedPatient.name)}
        </strong>

        &nbsp; | &nbsp;

        Token:
        <strong>
            #${token}
        </strong>

    `;


    success.style.display = "block";


    document.getElementById(
        "patientSearch"
    ).value = "";


    document.getElementById(
        "patientResult"
    ).style.display = "none";


    document.getElementById(
        "doctor"
    ).value = "";


    document.getElementById(
        "appointmentTime"
    ).value = "";


    selectedPatient = null;


    displayAppointments();
}


/* DISPLAY APPOINTMENTS */

function displayAppointments() {

    appointments =
        JSON.parse(
            localStorage.getItem(
                "careSyncAppointments"
            )
        ) || [];


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayAppointments =
        appointments
            .filter(
                a => a.date === today
            )
            .sort(
                (a, b) =>
                    a.token - b.token
            );


    const queue =
        document.getElementById("queue");


    if (
        todayAppointments.length === 0
    ) {

        queue.innerHTML = `

            <div class="empty">
                No appointments for today.
            </div>

        `;

    } else {

        queue.innerHTML =
            todayAppointments
                .map(
                    createAppointmentHTML
                )
                .join("");
    }


    const history =
        document.getElementById("history");


    if (appointments.length === 0) {

        history.innerHTML = `

            <div class="empty">
                No appointment history yet.
            </div>

        `;

    } else {

        history.innerHTML =
            appointments
                .slice()
                .reverse()
                .map(
                    createAppointmentHTML
                )
                .join("");
    }
}


function createAppointmentHTML(a) {

    let statusClass = "";


    if (a.status === "Completed") {

        statusClass = "completed";

    }


    if (a.status === "In Consultation") {

        statusClass = "consultation";

    }


    return `

        <div class="appointment">

            <div class="appointment-top">

                <div class="token">
                    TOKEN #${a.token}
                </div>

                <div class="status ${statusClass}">
                    ${escapeHTML(a.status)}
                </div>

            </div>


            <div class="patient-name">

                ${escapeHTML(a.patientName)}

            </div>


            <div class="info">

                🪪 Patient ID:
                ${escapeHTML(a.patientID)}

                <br>

                👨‍⚕️ Doctor:
                ${escapeHTML(a.doctor)}

                <br>

                📅 Date:
                ${escapeHTML(a.date)}

                <br>

                🕐 Time:
                ${escapeHTML(a.time)}

            </div>

        </div>

    `;
}


function escapeHTML(text) {

    return String(text)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


displayAppointments();

setInterval(
    displayAppointments,
    3000
);