let appointments = [];


/* GET TODAY IN LOCAL DATE */

function getToday() {
    const now = new Date();

    return (
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0")
    );
}


/* DISPLAY QUEUE */

async function displayQueue() {

    const { data, error } = await db
        .from("appointments")
        .select("*")
        .order("token", { ascending: true });

    if (error) {
        console.error("Appointment loading error:", error);
        return;
    }

    appointments = data || [];

    const today = getToday();

    const todayAppointments =
        appointments.filter(
            appointment =>
                appointment.date === today
        );


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


    document.getElementById("totalToday").textContent =
        todayAppointments.length;

    document.getElementById("waitingCount").textContent =
        waiting;

    document.getElementById("completedCount").textContent =
        completed;


    const queue =
        document.getElementById("queue");


    if (todayAppointments.length === 0) {

        queue.innerHTML = `
            <div class="empty">
                🩺 No patients are scheduled for today.
            </div>
        `;

        return;
    }


    queue.innerHTML =
        todayAppointments
            .map(createQueueItem)
            .join("");
}


/* CREATE QUEUE ITEM */

function createQueueItem(appointment) {

    let statusClass = "waiting";

    if (appointment.status === "In Consultation") {
        statusClass = "consultation";
    }

    if (appointment.status === "Completed") {
        statusClass = "completed";
    }


    let actionButtons = "";


    if (appointment.status === "Waiting") {

        actionButtons = `
            <button
                class="start-btn"
                onclick="startConsultation('${appointment.id}')">

                ▶ Start Consultation

            </button>
        `;
    }


    if (appointment.status === "In Consultation") {

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

                        <br>

                        👨‍⚕️
                        ${escapeHTML(
                            appointment.doctor
                        )}

                    </div>

                    <span class="status ${statusClass}">
                        ${escapeHTML(
                            appointment.status
                        )}
                    </span>

                </div>

            </div>


            <div class="buttons">

                <button
                    class="view-btn"
                    onclick="viewPatient('${encodeURIComponent(
                        appointment.patientID
                    )}')">

                    👁 View Patient

                </button>

                ${actionButtons}

            </div>

        </div>
    `;
}


/* START CONSULTATION */

async function startConsultation(id) {

    const { error } = await db
        .from("appointments")
        .update({
            status: "In Consultation"
        })
        .eq("id", id);


    if (error) {
        console.error(error);
        alert("Could not update appointment.");
        return;
    }


    displayQueue();
}


/* COMPLETE CONSULTATION */

async function completeConsultation(id) {

    const { error } = await db
        .from("appointments")
        .update({
            status: "Completed"
        })
        .eq("id", id);


    if (error) {
        console.error(error);
        alert("Could not update appointment.");
        return;
    }


    displayQueue();
}


/* VIEW PATIENT */

function viewPatient(id) {

    const patientID =
        decodeURIComponent(id);

    window.location.href =
        "patient.html?patient=" +
        encodeURIComponent(patientID);
}


/* SEARCH PATIENT */

async function doctorSearchPatient() {

    const searchBox =
        document.getElementById(
            "doctorPatientSearch"
        );

    const result =
        document.getElementById(
            "doctorPatientResult"
        );

    const patientID =
        searchBox.value
            .trim()
            .toLowerCase();


    if (!patientID) {

        result.innerHTML =
            "<p>Please enter a Patient ID.</p>";

        result.style.display =
            "block";

        return;
    }


    const { data: patients, error } =
        await db
            .from("patients")
            .select("*");


    if (error) {

        console.error(error);

        result.innerHTML =
            "<p>❌ Could not load patient data.</p>";

        result.style.display =
            "block";

        return;
    }


    const patient =
        patients.find(
            patient =>
                String(patient.id)
                    .toLowerCase() ===
                patientID
        );


    if (!patient) {

        result.innerHTML = `
            <p>
                ❌ No patient found with ID:
                <strong>
                    ${escapeHTML(patientID)}
                </strong>
            </p>
        `;

        result.style.display =
            "block";

        return;
    }


    result.innerHTML = `

        <h3>
            👤 ${escapeHTML(patient.name)}
        </h3>

        <p>

            <strong>Patient ID:</strong>
            ${escapeHTML(patient.id)}

            <br>

            <strong>Age:</strong>
            ${escapeHTML(patient.age || "—")}

            <br>

            <strong>Gender:</strong>
            ${escapeHTML(patient.gender || "—")}

            <br>

            <strong>Height:</strong>
            ${escapeHTML(patient.height || "—")}

            <br>

            <strong>Village:</strong>
            ${escapeHTML(patient.village || "—")}

            <br>

            <strong>Mobile:</strong>
            ${escapeHTML(patient.mobile || "—")}

            <br>

            <strong>Address:</strong>
            ${escapeHTML(patient.address || "—")}

        </p>

        <button
            class="view-btn"
            onclick="viewPatient(
                '${encodeURIComponent(patient.id)}'
            )">

            View Full Patient Profile

        </button>
    `;


    result.style.display =
        "block";
}


/* SECURITY */

function escapeHTML(text) {

    return String(text)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* INITIAL LOAD */

displayQueue();


/* AUTO REFRESH EVERY 3 SECONDS */

setInterval(
    displayQueue,
    3000
);