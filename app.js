// app.js – Dashboard, navegación y módulo de usuarios

const ADMIN_EMAIL = "fixprueba0@gmail.com";
const db = firebase.firestore();

firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const email = user.email.toLowerCase();
    document.getElementById("userEmail").textContent = email;

    const isAdmin = email === ADMIN_EMAIL;

    // Ocultar opción Usuarios si no es admin
    document.querySelectorAll(".admin-only").forEach(btn => {
        btn.style.display = isAdmin ? "block" : "none";
    });

    if (isAdmin) cargarUsuarios();
});

// ========================
// NAVEGACIÓN ENTRE SECCIONES
// ========================
document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const sec = btn.dataset.section;
        cambiarSeccion(sec);
    });
});

function cambiarSeccion(nombre) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById("sec-" + nombre).classList.remove("hidden");
    document.getElementById("tituloSeccion").textContent = nombre.toUpperCase();
}

// ========================
// CERRAR SESIÓN
// ========================
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await firebase.auth().signOut();
    localStorage.clear();
    window.location.href = "index.html";
});

// ========================
// MÓDULO USUARIOS (ADMIN)
// ========================
async function cargarUsuarios() {
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = "<tr><td colspan='4'>Cargando...</td></tr>";

    const snap = await db.collection("usuarios").get();

    let html = "";
    snap.forEach(doc => {
        const u = doc.data();
        html += `
        <tr>
            <td>${doc.id}</td>
            <td>${u.rol}</td>
            <td>${u.activo ? "Sí" : "No"}</td>
            <td>
                <button class="btn-primary" onclick="toggleActivo('${doc.id}', ${u.activo})">${u.activo ? "Desactivar" : "Activar"}</button>
                <button class="btn-secondary" onclick="eliminarUsuario('${doc.id}')">Eliminar</button>
            </td>
        </tr>`;
    });

    tbody.innerHTML = html;
}

window.toggleActivo = async function (email, estado) {
    await db.collection("usuarios").doc(email).update({ activo: !estado });
    cargarUsuarios();
};

window.eliminarUsuario = async function (email) {
    if (!confirm("¿Eliminar usuario?")) return;
    await db.collection("usuarios").doc(email).delete();
    cargarUsuarios();
};

// Guardar nuevo usuario
document.getElementById("formNuevoUsuario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("nuevoEmail").value.toLowerCase();
    const rol = document.getElementById("nuevoRol").value;
    const activo = document.getElementById("nuevoActivo").checked;

    await db.collection("usuarios").doc(email).set({ email, rol, activo }, { merge: true });

    alert("Usuario guardado.");
    cargarUsuarios();
});
// ========================
// MENU MÓVIL (toggle)
// ========================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// Cerrar sidebar cuando se selecciona una opción
document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });
});
