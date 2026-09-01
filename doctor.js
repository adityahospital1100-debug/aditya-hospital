let appointments =
    JSON.parse(
        localStorage.getItem(
            "careSyncAppointments"
        )
    ) || [];


/* DISPLAY QUEUE */

function displayQueue() {

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


    const waiting =
        todayAppointments.filter(
            a => a.status === "Waiting"
        ).length;


    const completed =
        todayAppointments.filter(
            a => a.status === "Completed"
        ).length;


    document.getElementById(
        "totalToday"
    ).textContent =
        todayAppointments.length;


    document.getElementById(
        "waitingCount"
    ).textContent =
        waiting;


    document.getElementById(
        "completedCount"
    ).textContent =
        completed;


    const queue =
        document.getElementById(
            "queue"
        );


    if (
        todayAppointments.length === 0
    ) {

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
            .map(
                createQueueItem
            )
            .join("");
}


/* QUEUE ITEM */

function createQueueItem(appointment) {

    let statusClass =
        "waiting";


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


/* START */

function startConsultation(id) {

    appointments =
        JSON.parse(
            localStorage.getItem(
                "careSyncAppointments"
            )
        ) || [];


    const appointment =
        appointments.find(
            a => a.id === id
        );


    if (!appointment) return;


    appointment.status =
        "In Consultation";


    localStorage.setItem(
        "careSyncAppointments",
        JSON.stringify(
            appointments
        )
    );


    displayQueue();
}


/* COMPLETE */

function completeConsultation(id) {

    appointments =
        JSON.parse(
            localStorage.getItem(
                "careSyncAppointments"
            )
        ) || [];


    const appointment =
        appointments.find(
            a => a.id === id
        );


    if (!appointment) return;


    appointment.status =
        "Completed";


    localStorage.setItem(
        "careSyncAppointments",
        JSON.stringify(
            appointments
        )
    );


    displayQueue();
}


/* VIEW PATIENT */

function viewPatient(id) {

    const patientID =
        decodeURIComponent(id);


    window.location.href =
        "patient.html?patient=" +
        encodeURIComponent(
            patientID
        );
}


function escapeHTML(text) {

    return String(text)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


displayQueue();

setInterval(
    displayQueue,
    3000
);