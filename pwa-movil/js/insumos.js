const CATALOGO = [
  { id: 1, codigo: 'FLT-001', nombre: 'Filtro deshidratador', stock: 12, unidad: 'un', paso: 1 },
  { id: 2, codigo: 'GAS-404', nombre: 'Gas refrigerante R404A', stock: 18, unidad: 'kg', paso: 0.5 },
  { id: 3, codigo: 'SEL-010', nombre: 'Sello de puerta cámara', stock: 4, unidad: 'un', paso: 1 },
  { id: 4, codigo: 'COR-022', nombre: 'Correa de ventilador', stock: 9, unidad: 'un', paso: 1 },
  { id: 5, codigo: 'CON-031', nombre: 'Contactor 25A', stock: 6, unidad: 'un', paso: 1 },
  { id: 6, codigo: 'TER-040', nombre: 'Termostato digital', stock: 2, unidad: 'un', paso: 1 },
  { id: 7, codigo: 'ACE-050', nombre: 'Aceite para compresor', stock: 25, unidad: 'lt', paso: 0.5 }
];

const $ = id => document.getElementById(id);
let filas = [{ art: '', cant: '' }];       
const modalSol = new bootstrap.Modal($('modalSolicitud'));
const fmt = n => String(Math.round(n * 100) / 100);

function dibujar() {
  $('filas').innerHTML = filas.map((f, n) => {
    const ins = CATALOGO.find(i => i.id === Number(f.art));
    const listo = ins && Number(f.cant) > 0;
    const opts = CATALOGO.map(i => `<option value="${i.id}" ${i.id === Number(f.art) ? 'selected' : ''}>${i.codigo} · ${i.nombre} (stock ${fmt(i.stock)} ${i.unidad})</option>`).join('');
    return `<div class="fila" data-n="${n}">
      <label for="a${n}">Artículo / Repuesto</label>
      <select id="a${n}" class="form-select mb-2" data-campo="art"><option value="">Seleccionar opción</option>${opts}</select>
      <label for="c${n}">Cantidad Usada ${ins ? '(' + ins.unidad + ')' : ''}</label>
      <input id="c${n}" type="number" inputmode="decimal" min="0" ${ins ? `step="${ins.paso}" max="${ins.stock}"` : 'disabled'} class="form-control" placeholder="Ingrese cantidad" value="${f.cant}" data-campo="cant">
      <div class="cardex">
        <div><div class="fw-semibold">Estado Cardex</div>
          <div class="estado ${listo ? 'ok' : 'pend'}">${listo ? '<i class="bi bi-check-lg"></i> Rebajado de Stock' : 'Pendiente de datos'}</div></div>
        <button class="btn-basura" data-quitar="${n}" aria-label="Quitar material"><i class="bi bi-trash3-fill"></i></button>
      </div></div>`;
  }).join('');
}

function mostrarAviso(t) { $('aviso').textContent = t; $('aviso').classList.toggle('d-none', !t); }

$('filas').addEventListener('change', e => {
  const fila = e.target.closest('.fila'); if (!fila) return;
  const n = Number(fila.dataset.n), campo = e.target.dataset.campo;
  filas[n][campo] = e.target.value;
  if (campo === 'art') filas[n].cant = '';
  const ins = CATALOGO.find(i => i.id === Number(filas[n].art));
  if (campo === 'cant' && ins && Number(filas[n].cant) > ins.stock) {
    mostrarAviso(`No puede usar más de lo disponible: ${ins.nombre} (stock ${fmt(ins.stock)} ${ins.unidad}).`);
    filas[n].cant = String(ins.stock);
  } else mostrarAviso('');
  setTimeout(dibujar, 0);   
});
$('filas').addEventListener('click', e => {
  const b = e.target.closest('[data-quitar]'); if (!b) return;
  filas.splice(Number(b.dataset.quitar), 1);
  if (!filas.length) filas.push({ art: '', cant: '' });
  dibujar();
});
$('btnAgregar').addEventListener('click', () => { filas.push({ art: '', cant: '' }); dibujar(); });
$('btnSolicitar').addEventListener('click', () => { $('solTexto').value = ''; $('solTexto').classList.remove('is-invalid'); modalSol.show(); });
$('btnEnviarSol').addEventListener('click', () => {
  if (!$('solTexto').value.trim()) { $('solTexto').classList.add('is-invalid'); return; }
  modalSol.hide(); bootstrap.Toast.getOrCreateInstance($('toastOk')).show();
});

$('btnConfirmar').addEventListener('click', () => {
  const consumo = {};
  filas.forEach(f => { if (f.art && Number(f.cant) > 0) consumo[f.art] = (consumo[f.art] || 0) + Number(f.cant); });
  if (!Object.keys(consumo).length) { mostrarAviso('Agregue al menos un material con cantidad, o use "Solicitar Insumos" si no hay stock.'); return; }
  sessionStorage.setItem('consumo', JSON.stringify(consumo));
  window.location.href = 'evidencia.html';  
});

function red() { const e = $('estadoRed'); e.textContent = navigator.onLine ? 'En línea' : 'Sin conexión'; e.classList.toggle('sin-red', !navigator.onLine); }
window.addEventListener('online', red); window.addEventListener('offline', red); red();
dibujar();
