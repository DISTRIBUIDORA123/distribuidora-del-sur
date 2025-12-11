// auth.js – Lógica del login

const emailInput = document.getElementById("loginEmail");
const passInput  = document.getElementById("loginPass");
const btnLogin   = document.getElementById("btnLogin");
const errorBox   = document.getElementById("loginError");

btnLogin.addEventListener("click", login);

async function login() {
    const email = emailInput.value.trim();
    const pass  = passInput.value.trim();

    errorBox.textContent = "";

    if (!email || !pass) {
        errorBox.textContent = "Ingresa correo y contraseña.";
        return;
    }

    try {
        const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);

        // Guardar correo
        localStorage.setItem("correo", cred.user.email);

        // Redirigir al panel
        window.location.href = "home.html";

    } catch (e) {
        console.error("Login error:", e);
        errorBox.textContent = "Correo o contraseña incorrectos.";
    }
}
