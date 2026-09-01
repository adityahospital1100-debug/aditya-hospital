let patients =
    JSON.parse(
        localStorage.getItem(
            "careSyncPatients"
        )
    ) || [];


function getPatientID() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("patient");
}


function loadPatient() {

    const patientID =
        getPatientID();


    const patient =
        patients.find(
            p => p.id === patientID
        );


    if (!patient) {

        alert("Patient not found.");

        return;
    }


    const fields = {

        profileID:
            patient.id,

        profileName:
            patient.name,

        profileAge:
            patient.age,

        profileGender:
            patient.gender,

        profileHeight:
            patient.height || "—",

        profileVillage:
            patient.village || "—",

        profileMobile:
            patient.mobile || "—",

        profileAddress:
            patient.address || "—"

    };


    Object.keys(fields).forEach(
        id => {

            const element =
                document.getElementById(id);


            if (element) {

                element.textContent =
                    fields[id];

            }

        }
    );
}


loadPatient();