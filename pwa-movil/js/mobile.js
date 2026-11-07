document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('firmaCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dibujando = false;

        // Configuración del trazo
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';

        const iniciarDibujo = (e) => {
            dibujando = true;
            ctx.beginPath();
            const pos = obtenerPosicion(e);
            ctx.moveTo(pos.x, pos.y);
            e.preventDefault(); // Evita scroll en móviles
        };

        const dibujar = (e) => {
            if (!dibujando) return;
            const pos = obtenerPosicion(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            e.preventDefault();
        };

        const detenerDibujo = () => {
            dibujando = false;
            ctx.closePath();
        };

        const obtenerPosicion = (e) => {
            const rect = canvas.getBoundingClientRect();
            // Soporte para touch (celulares) y mouse (PC)
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        // Eventos Mouse (PC)
        canvas.addEventListener('mousedown', iniciarDibujo);
        canvas.addEventListener('mousemove', dibujar);
        canvas.addEventListener('mouseup', detenerDibujo);
        canvas.addEventListener('mouseout', detenerDibujo);

        // Eventos Touch (Móviles)
        canvas.addEventListener('touchstart', iniciarDibujo, {passive: false});
        canvas.addEventListener('touchmove', dibujar, {passive: false});
        canvas.addEventListener('touchend', detenerDibujo);

        // Funcionalidad del botón limpiar
        const btnLimpiar = document.getElementById('btnLimpiarFirma');
        if(btnLimpiar){
            btnLimpiar.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }
});