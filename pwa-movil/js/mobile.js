// 1. Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker PWA registrado con éxito:', reg.scope))
            .catch(err => console.error('Error al registrar Service Worker:', err));
    });
}

// 2. Control de estado (Emergencia vs Normal) mediante parámetros URL
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const urgencia = params.get('urgencia');

    if (urgencia === 'Emergencia Crítica' || urgencia === 'Emergencia') {
        const header = document.getElementById('header-bar');
        if (header) header.style.backgroundColor = '#dc3545';
        
        const badge = document.getElementById('obra-id-badge');
        if (badge) badge.innerHTML = 'ID: #106 - <span class="badge bg-danger">Emergencia Crítica</span>';
        
        const btnIniciar = document.getElementById('btn-iniciar');
        if (btnIniciar) btnIniciar.style.backgroundColor = '#dc3545';
    }
});