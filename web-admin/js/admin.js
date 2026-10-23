/* =================================================_
   Lógica Interactiva - Login Portal Administrativo FYAG
   ================================================= */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Módulo de Login cargado correctamente.");

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            const userInput = document.getElementById("username").value.trim();
            const passInput = document.getElementById("password").value.trim();

            // Validación simple previa al envío (simulando autenticación)
            if (userInput === "" || passInput === "") {
                e.preventDefault();
                alert("Por favor, ingrese su usuario y contraseña para continuar.");
                return;
            }

            // Simulación visual antes de redirigir al dashboard
            console.log("Credenciales ingresadas. Validando acceso mediante token JWT...");
        });
    }
});

/* =================================================_
   Lógica Interactiva - Panel Administrativo & Dashboard FYAG
   ================================================= */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Dashboard Operativo FYAG - JavaScript cargado correctamente.");

    // 1. Funcionalidad para el botón de Cerrar Sesión
    const btnLogout = document.getElementById("logout-btn");
    if (btnLogout) {
        btnLogout.addEventListener("click", function (e) {
            const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión en el sistema?");
            if (!confirmar) {
                e.preventDefault(); // Cancela la redirección si el usuario cancela
            }
        });
    }

    // 2. Funcionalidad para el botón de "+ Nueva orden de trabajo"
    const btnNuevaObra = document.getElementById("btnNuevaObra");
    if (btnNuevaObra) {
        btnNuevaObra.addEventListener("click", function () {
            alert("Acción simulada: Aquí se abrirá el formulario para registrar una nueva Orden de Trabajo (Próxima integración con FastAPI).");
        });
    }

    // 3. Funcionalidad para seleccionar todos los checkboxes de la tabla de órdenes
    const selectAllCheckbox = document.getElementById("selectAll");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            const rowCheckboxes = document.querySelectorAll('tbody input.form-check-input');
            rowCheckboxes.forEach(cb => {
                cb.checked = selectAllCheckbox.checked;
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    function actualizarReloj() {
        const elementoReloj = document.getElementById("live-clock");
        if (elementoReloj) {
            const ahora = new Date();
            // Opciones para formatear la fecha y hora en español
            const opciones = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            };
            elementoReloj.textContent = ahora.toLocaleDateString('es-ES', opciones);
        }
    }

    // Actualiza al cargar y luego cada 1 segundo
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
});