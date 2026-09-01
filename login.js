function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    // Demo login
    localStorage.setItem("adityaHospitalLoggedIn", "true");

    window.location.href = "pages/reception.html";
}