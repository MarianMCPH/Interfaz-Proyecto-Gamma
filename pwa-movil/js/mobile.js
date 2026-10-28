/* =================================================_
   Lógica Interactiva - Login PWA Móvil FYAG
   ================================================= */

document.addEventListener("DOMContentLoaded", function () {
    console.log("Módulo de Login PWA Móvil cargado correctamente.");

    const pwaLoginForm = document.getElementById("pwaLoginForm");

    if (pwaLoginForm) {
        pwaLoginForm.addEventListener("submit", function (e) {
            const userInput = document.getElementById("pwaUser").value.trim();
            const passInput = document.getElementById("pwaPass").value.trim();

            if (userInput === "" || passInput === "") {
                e.preventDefault();
                alert("Por favor, ingrese sus credenciales para acceder al portal de terreno.");
                return;
            }

            console.log("Autenticando técnico en terreno vía token JWT...");
        });
    }
});

/* =================================================_
   Lógica Interactiva - PWA Móvil FYAG (Itinerario)
   ================================================= */

document.addEventListener("DOMContentLoaded", function () {
    console.log("PWA Móvil - Itinerario de Faenas cargado correctamente.");

    // ==========================================
    // 1. DETECTOR DE ESTADO DE RED (ONLINE / OFFLINE)
    // ==========================================
    function actualizarEstadoConexion() {
        const badge = document.getElementById("network-status-badge");
        const icon = document.getElementById("network-icon");
        const text = document.getElementById("network-text");

        if (navigator.onLine) {
            // Con conexión a internet
            badge.className = "badge bg-success text-white px-2 py-1 online-badge";
            icon.className = "bi bi-circle-fill me-1";
            text.textContent = "En línea";
        } else {
            // Sin conexión (Modo Offline rural para PWA)
            badge.className = "badge bg-warning text-dark px-2 py-1 online-badge";
            icon.className = "bi bi-wifi-off me-1";
            text.textContent = "Sin conexión (Offline)";
        }
    }

    // Escuchar eventos de cambio de red del navegador
    window.addEventListener("online", actualizarEstadoConexion);
    window.addEventListener("offline", actualizarEstadoConexion);
    
    // Comprobar al cargar la página
    actualizarEstadoConexion();


    // ==========================================
    // 2. FUNCIONALIDAD PARA CERRAR SESIÓN
    // ==========================================
    const btnLogout = document.getElementById("logout-btn");
    if (btnLogout) {
        btnLogout.addEventListener("click", function (e) {
            const confirmar = confirm("¿Desea cerrar sesión en la aplicación móvil?");
            if (!confirmar) {
                e.preventDefault();
            }
        });
    }


    // ==========================================
    // 3. ATENDER EMERGENCIA (QUIEBRE CADENA DE FRÍO)
    // ==========================================
    const btnAtenderEmergencia = document.getElementById("btnAtenderEmergencia");
    if (btnAtenderEmergencia) {
        btnAtenderEmergencia.addEventListener("click", function () {
            alert("Atendiendo Faena Prioritaria por quiebre de cadena de frío. Abriendo protocolo de emergencia...");
        });
    }


    // ==========================================
    // 4. BOTÓN ¿CÓMO LLEGAR? (GEOLOCALIZACIÓN / MAPAS)
    // ==========================================
    const btnComoLlegar = document.getElementById("btnComoLlegar");
    if (btnComoLlegar) {
        btnComoLlegar.addEventListener("click", function () {
            const direccion = encodeURIComponent("Hijuela El Rosal s/n, Ruta 148, Bulnes, Ñuble");
            window.open(`https://www.google.com/maps/search/?api=1&query=${direccion}`, '_blank');
        });
    }


    // ==========================================
    // 5. BOTÓN INICIAR FAENA (CAPTURA GPS [HU-09])
    // ==========================================
    const btnIniciarFaena = document.getElementById("btnIniciarFaena");
    if (btnIniciarFaena) {
        btnIniciarFaena.addEventListener("click", function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        alert(`¡Geolocalización GPS capturada (Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)})!\nIniciando faena OT #105...`);
                    },
                    function (error) {
                        alert("Sin señal GPS precisa o permiso denegado. Iniciando faena en modo local (Offline)...");
                    }
                );
            } else {
                alert("Iniciando faena OT #105...");
            }
        });
    }
});