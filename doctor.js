/* =========================================
   ADITYA HOSPITAL
   DOCTOR DASHBOARD
   ========================================= */


/* =========================================
   APPOINTMENTS
   ========================================= */

let appointments =
    JSON.parse(
        localStorage.getItem("careSyncAppointments")
    ) || [];


/* =========================================
   DISPLAY TODAY'S QUEUE
   ========================================= */

function displayQueue() {

    appointments =
        JSON.parse(
            localStorage.getItem("careSyncAppointments")
        ) || [];


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayAppointments =
        appointments
            .filter(
                appointment =>
                    appointment.date === today
            )
            .sort(
                (a, b) =>
                    Number(a.token) -
                    Number(b.token)
            );


    /* COUNTS */

    const waiting =
        todayAppointments.filter(
            appointment =>
                appointment.status === "Waiting"
        ).length;


    const completed =
        todayAppointments.filter(
            appointment =>
                appointment.status === "Completed"
        ).length;


    const totalToday =
        document.getElementById("totalToday");

    const waitingCount =
        document.getElementById("waitingCount");

    const completedCount =
        document.getElementById("completedCount");


    if (totalToday) {
        totalToday.textContent =
            todayAppointments.length;
    }


    if (waitingCount) {
        waitingCount.textContent =
            waiting;
    }


    if (completedCount) {
        completedCount.textContent =
            completed;
    }


    /* QUEUE */

    const queue =
        document.getElementById("queue");


    if (!queue) return;


    if (todayAppointments.length === 0) {

        queue.innerHTML = `

            <div class="empty">

                🩺 No patients are scheduled
                for today.

            </div>

        `;

        return;
    }


    queue.innerHTML =
        todayAppointments
            .map(createQueueItem)
            .join("");
}


/* =========================================
   CREATE QUEUE ITEM
   ========================================= */

function createQueueItem(appointment) {

    let statusClass = "waiting";


    if (
        appointment.status ===
        "In Consultation"
    ) {

        statusClass =
            "consultation";
    }


    if (
        appointment.status ===
        "Completed"
    ) {

        statusClass =
            "completed";
    }


    let actionButtons = "";


    /* START CONSULTATION */

    if (
        appointment.status ===
        "Waiting"
    ) {

        actionButtons = `

            <button
                class="start-btn"
                onclick="startConsultation('${appointment.id}')">

                ▶ Start Consultation

            </button>

        `;
    }


    /* COMPLETE CONSULTATION */

    if (
        appointment.status ===
        "In Consultation"
    ) {

        actionButtons = `

            <button
                class="complete-btn"
                onclick="completeConsultation('${appointment.id}')">

                ✓ Complete

            </button>

        `;
    }


    return `

        <div class="queue-item">

            <div class="queue-left">

                <div class="token">
                    #${appointment.token}
                </div>


                <div>

                    <div class="patient-name">

                        ${escapeHTML(
                            appointment.patientName
                        )}

                    </div>


                    <div class="patient-details">

                        Patient ID:
                        ${escapeHTML(
                            appointment.patientID
                        )}

                        <br>

                        🕐
                        ${escapeHTML(
                            appointment.time
                        )}

                    </div>


                    <span
                        class="status ${statusClass}">

                        ${escapeHTML(
                            appointment.status
                        )}

                    </span>

                </div>

            </div>


            <div class="buttons">

                <button
                    class="view-btn"
                    onclick="viewPatient('${encodeURIComponent(appointment.patientID)}')">

                    👁 View Patient

                </button>


                ${actionButtons}

            </div>

        </div>

    `;
}


/* =========================================
   START CONSULTATION
   ========================================= */

function startConsultation(id) {

    appointments =
        JSON.parse(
            localStorage.getItem(
                "careSyncAppointments"
            )
        ) || [];


    const appointment =
        appointments.find(
            appointment =>
                appointment.id === id
        );


    if (!appointment) return;


    appointment.status =
        "In Consultation";


    localStorage.setItem(
        "careSyncAppointments",
        JSON.stringify(appointments)
    );


    displayQueue();
}


/* =========================================
   COMPLETE CONSULTATION
   ========================================= */

function completeConsultation(id) {

    appointments =
        JSON.parse(
            localStorage.getItem(
                "careSyncAppointments"
            )
        ) || [];


    const appointment =
        appointments.find(
            appointment =>
                appointment.id === id
        );


    if (!appointment) return;


    appointment.status =
        "Completed";


    localStorage.setItem(
        "careSyncAppointments",
        JSON.stringify(appointments)
    );


    displayQueue();
}


/* =========================================
   VIEW PATIENT
   ========================================= */

function viewPatient(id) {

    const patientID =
        decodeURIComponent(id);


    window.location.href =
        "patient.html?patient=" +
        encodeURIComponent(patientID);
}


/* =========================================
   SEARCH PATIENT
   ========================================= */

function doctorSearchPatient() {

    const searchBox =
        document.getElementById(
            "doctorPatientSearch"
        );


    const result =
        document.getElementById(
            "doctorPatientResult"
        );


    if (!searchBox || !result) {
        return;
    }


    const patientID =
        searchBox.value
            .trim()
            .toLowerCase();


    /* NOTHING ENTERED */

    if (!patientID) {

        result.innerHTML = `

            <p>
                Please enter a Patient ID.
            </p>

        `;

        result.style.display =
            "block";

        return;
    }


    /* GET PATIENTS */

    const patients =
        JSON.parse(
            localStorage.getItem(
                "careSyncPatients"
            )
        ) || [];


    /* FIND PATIENT */

    const patient =
        patients.find(
            patient =>
                String(patient.id)
                    .trim()
                    .toLowerCase() ===
                patientID
        );


    /* PATIENT NOT FOUND */

    if (!patient) {

        result.innerHTML = `

            <div class="empty">

                ❌ No patient found with ID:

                <strong>
                    ${escapeHTML(patientID)}
                </strong>

            </div>

        `;

        result.style.display =
            "block";

        return;
    }


    /* PATIENT FOUND */

    result.innerHTML = `

        <div class="patient-found">

            <h3>
                👤 ${escapeHTML(patient.name)}
            </h3>


            <div class="patient-info">

                <p>
                    <strong>Patient ID:</strong>
                    ${escapeHTML(patient.id)}
                </p>


                <p>
                    <strong>Age:</strong>
                    ${escapeHTML(patient.age)}
                </p>


                <p>
                    <strong>Gender:</strong>
                    ${escapeHTML(patient.gender)}
                </p>


                <p>
                    <strong>Height:</strong>
                    ${escapeHTML(
                        patient.height || "—"
                    )}
                </p>


                <p>
                    <strong>Village:</strong>
                    ${escapeHTML(
                        patient.village || "—"
                    )}
                </p>


                <p>
                    <strong>Mobile:</strong>
                    ${escapeHTML(
                        patient.mobile || "—"
                    )}
                </p>


                <p>
                    <strong>Address:</strong>
                    ${escapeHTML(
                        patient.address || "—"
                    )}
                </p>

            </div>


            <button
                class="view-btn"
                onclick="viewPatient('${encodeURIComponent(patient.id)}')">

                👁 View Full Patient Profile

            </button>

        </div>

    `;


    result.style.display =
        "block";
}


/* =========================================
   SECURITY / HTML ESCAPE
   ========================================= */

function escapeHTML(text) {

    return String(text)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


/* =========================================
   START DASHBOARD
   ========================================= */

displayQueue();


/* =========================================
   AUTO REFRESH QUEUE
   ========================================= */

setInterval(
    displayQueue,
    3000
);