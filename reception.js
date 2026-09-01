let patients =
    JSON.parse(localStorage.getItem("careSyncPatients")) || [];

function generatePatientID() {

    const year = new Date().getFullYear();

    const number =
        String(patients.length + 1).padStart(5, "0");

    return `ADH-${year}-${number}`;
}


function registerPatient() {

    const name =
        document.getElementById("patientName").value.trim();

    const age =
        document.getElementById("age").value.trim();

    const gender =
        document.getElementById("gender").value;

    const height =
        document.getElementById("height").value.trim();

    const village =
        document.getElementById("village").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const address =
        document.getElementById("address").value.trim();


    if (!name || !age || !gender || !mobile) {

        alert(
            "Please fill in the required patient details."
        );

        return;
    }


    const patient = {

        id: generatePatientID(),

        name: name,

        age: age,

        gender: gender,

        height: height,

        village: village,

        mobile: mobile,

        address: address,

        registeredAt:
            new Date().toISOString()

    };


    patients.push(patient);


    localStorage.setItem(
        "careSyncPatients",
        JSON.stringify(patients)
    );


    alert(
        `Patient registered successfully!\n\nPatient ID: ${patient.id}`
    );


    if (
        typeof displayPatients === "function"
    ) {
        displayPatients();
    }
}


function searchPatients() {

    const input =
        document
            .getElementById("patientSearch")
            .value
            .trim()
            .toLowerCase();


    const results =
        document.getElementById("patientList");


    if (!input) {

        results.innerHTML = "";

        return;
    }


    patients =
        JSON.parse(
            localStorage.getItem("careSyncPatients")
        ) || [];


    const matches =
        patients.filter(patient =>

            String(patient.id)
                .toLowerCase()
                .includes(input)

            ||

            String(patient.name)
                .toLowerCase()
                .includes(input)

            ||

            String(patient.mobile)
                .toLowerCase()
                .includes(input)

        );


    if (matches.length === 0) {

        results.innerHTML = `
            <div class="empty">
                No patient found.
            </div>
        `;

        return;
    }


    results.innerHTML =
        matches
            .map(patient => `

                <div class="patient-item">

                    <strong>
                        ${escapeHTML(patient.name)}
                    </strong>

                    <small>
                        Patient ID:
                        ${escapeHTML(patient.id)}
                    </small>

                    <small>
                        Mobile:
                        ${escapeHTML(patient.mobile || "—")}
                    </small>

                    <button
                        class="primary"
                        onclick="openPatient('${encodeURIComponent(patient.id)}')">

                        View Patient

                    </button>

                </div>

            `)
            .join("");
}


function openPatient(id) {

    const patientID =
        decodeURIComponent(id);

    window.location.href =
        "patient.html?patient=" +
        encodeURIComponent(patientID);
}


function openAppointments() {

    window.location.href =
        "appointments.html";
}


function escapeHTML(text) {

    return String(text)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}