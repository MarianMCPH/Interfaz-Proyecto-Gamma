// Lógica general del Panel Administrativo de Escritorio - FYAG SpA

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Reloj en tiempo real para el Dashboard y Gestión de Obras
    const clockElement = document.getElementById("live-clock");
    
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            };
            clockElement.textContent = now.toLocaleDateString('es-ES', options);
        }
        
        updateClock();
        setInterval(updateClock, 1000);
    }

    // 2. Control de sesión y cierre de sesión administrativo
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            console.log("Sesión administrativa finalizada correctamente.");
        });
    }

});