// Bandeja de auditoría. Datos de ejemplo (luego vendrán de la API).
// Estados de la interfaz: PENDIENTE (en BD: FINALIZADA), CERRADA (bloqueada) y DEVUELTA (vuelve a EN_EJECUCION).
const OBRAS = [
  { id: 1042, cliente: 'Packing Frutícola Ñuble', tecnico: 'Carlos Soto', fecha: '2026-11-03', direccion: 'Ruta N-59, km 12, Chillán', servicio: 'Mantención preventiva cámara', fotos: 4, firmante: 'Pedro Muñoz', estado: 'PENDIENTE',
    materiales: [['FLT-001', 'Filtro deshidratador', '1 un'], ['GAS-404', 'Gas refrigerante R404A', '1,5 kg']] },
  { id: 1043, cliente: 'Viña Valle Sur', tecnico: 'Marcela Rojas', fecha: '2026-11-04', direccion: 'Camino a Cato s/n', servicio: 'Reparación túnel de congelado', fotos: 3, firmante: 'Ana Fuentes', estado: 'PENDIENTE',
    materiales: [['COR-022', 'Correa de ventilador', '2 un'], ['ACE-050', 'Aceite para compresor', '2 lt']] },
  { id: 1038, cliente: 'Frigorífico Los Aromos', tecnico: 'Carlos Soto', fecha: '2026-10-30', direccion: 'Parcela 8, San Carlos', servicio: 'Climatización industrial', fotos: 5, firmante: 'Luis Parra', estado: 'CERRADA',
    materiales: [['CON-031', 'Contactor 25A', '1 un']] },
  { id: 1040, cliente: 'Packing Frutícola Ñuble', tecnico: 'Diego Vega', fecha: '2026-11-02', direccion: 'Ruta N-59, km 12, Chillán', servicio: 'Emergencia: falla de evaporador', fotos: 2, firmante: 'Pedro Muñoz', estado: 'DEVUELTA',
    materiales: [['TER-040', 'Termostato digital', '1 un']] },
  { id: 1045, cliente: 'Viña Valle Sur', tecnico: 'Diego Vega', fecha: '2026-11-05', direccion: 'Camino a Cato s/n', servicio: 'Mantención preventiva', fotos: 3, firmante: 'Ana Fuentes', estado: 'PENDIENTE',
    materiales: [['SEL-010', 'Sello de puerta cámara', '1 un']] }
];

const BADGE = { PENDIENTE: ['warning text-dark', 'Pendiente de auditoría'], CERRADA: ['success', 'Cerrada'], DEVUELTA: ['danger', 'Devuelta al técnico'] };
const $ = id => document.getElementById(id);
let obraActual = null;
const modal = new bootstrap.Modal($('modalAuditar'));
const toast = bootstrap.Toast.getOrCreateInstance($('toastAviso'));

// Imágenes de ejemplo generadas en el navegador (se reemplazan por las reales de la API)
function placeholder(texto, w = 640, h = 420, fondo = '#495057') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${fondo}"/>` +
    `<text x="50%" y="50%" fill="#fff" font-family="Arial" font-size="${Math.round(h / 9)}" text-anchor="middle" dominant-baseline="middle">${texto}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function firmaSvg(nombre) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="110"><rect width="100%" height="100%" fill="#fff"/>` +
    `<path d="M20 70 C50 10, 80 110, 110 50 S170 20, 200 70 S270 90, 300 40" stroke="#1d3557" stroke-width="3" fill="none"/>` +
    `<text x="160" y="102" font-family="Arial" font-size="12" fill="#555" text-anchor="middle">${nombre}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function fechaCL(iso) { const [a, m, d] = iso.split('-'); return `${d}-${m}-${a}`; }

function filtradas() {
  const t = $('fTecnico').value, e = $('fEstado').value, c = $('fCliente').value.trim().toLowerCase(), f = $('fFecha').value;
  return OBRAS.filter(o => (!t || o.tecnico === t) && (!e || o.estado === e) &&
    (!c || o.cliente.toLowerCase().includes(c)) && (!f || o.fecha === f));
}

function dibujarTabla() {
  const lista = filtradas();
  $('vacio').classList.toggle('d-none', lista.length > 0);
  $('tbody').innerHTML = lista.map(o => {
    const [cls, txt] = BADGE[o.estado];
    const cerrada = o.estado === 'CERRADA';
    return `<tr class="${cerrada ? 'fila-cerrada' : ''}">
      <td class="fw-semibold">#${o.id}</td><td>${o.cliente}</td><td>${o.tecnico}</td><td>${fechaCL(o.fecha)}</td>
      <td class="text-center">${o.fotos}</td><td class="text-center text-success">&#10003;</td>
      <td><span class="badge text-bg-${cls}">${txt}</span></td>
      <td class="text-end"><button class="btn btn-sm ${cerrada ? 'btn-outline-secondary' : 'btn-primary'}" data-id="${o.id}">
        ${cerrada ? 'Ver detalle' : 'Auditar obra'}</button></td></tr>`;
  }).join('');
}

function dibujarResumen() {
  const n = e => OBRAS.filter(o => o.estado === e).length;
  const t = (titulo, num, cls) => `<div class="col-6 col-md-4"><div class="card shadow-sm tarjeta-resumen border-${cls}">
      <div class="card-body"><div class="text-muted small">${titulo}</div><div class="numero text-${cls}">${num}</div></div></div></div>`;
  $('resumen').innerHTML = t('Pendientes de auditoría', n('PENDIENTE'), 'warning') + t('Cerradas', n('CERRADA'), 'success') + t('Devueltas al técnico', n('DEVUELTA'), 'danger');
}

function cargarTecnicos() {
  [...new Set(OBRAS.map(o => o.tecnico))].sort().forEach(t => {
    $('fTecnico').insertAdjacentHTML('beforeend', `<option>${t}</option>`);
  });
}

function mostrarFoto(i) {
  $('visor').innerHTML = `<img src="${placeholder('Foto ' + (i + 1) + ' de ' + obraActual.fotos)}" alt="Foto ${i + 1} de la obra">`;
  document.querySelectorAll('.miniatura').forEach((m, k) => m.classList.toggle('activa', k === i));
}

function abrir(id) {
  obraActual = OBRAS.find(o => o.id === id);
  const o = obraActual;
  $('tituloModal').textContent = `Auditar obra #${o.id} — ${o.cliente}`;
  $('datosObra').innerHTML = [['Cliente', o.cliente], ['Dirección', o.direccion], ['Técnico', o.tecnico],
    ['Servicio', o.servicio], ['Fecha', fechaCL(o.fecha)], ['Firmante', o.firmante]]
    .map(([k, v]) => `<dt class="col-4">${k}</dt><dd class="col-8">${v}</dd>`).join('');
  $('materiales').innerHTML = o.materiales.map(m => `<tr><td>${m[0]}</td><td>${m[1]}</td><td class="text-end">${m[2]}</td></tr>`).join('');
  $('firma').innerHTML = `<img src="${firmaSvg(o.firmante)}" alt="Firma de ${o.firmante}">`;
  $('miniaturas').innerHTML = Array.from({ length: o.fotos }, (_, i) =>
    `<img class="miniatura" data-i="${i}" src="${placeholder('Foto ' + (i + 1), 192, 144)}" alt="Miniatura ${i + 1}">`).join('');
  mostrarFoto(0);

  // Reglas de bloqueo: una obra cerrada no se puede modificar (HU-08)
  const cerrada = o.estado === 'CERRADA';
  $('btnAutorizar').disabled = cerrada;
  $('btnDevolver').disabled = cerrada;
  $('notaEstado').textContent = cerrada ? 'Obra cerrada: registro bloqueado para resguardo contable.' : '';
  $('bloqueMotivo').classList.add('d-none');
  $('motivo').value = ''; $('motivo').classList.remove('is-invalid');
  modal.show();
}

function aviso(texto, tipo) {
  $('toastAviso').className = `toast text-bg-${tipo}`;
  $('toastTexto').textContent = texto;
  toast.show();
}

// Eventos
$('tbody').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) abrir(Number(b.dataset.id)); });
$('miniaturas').addEventListener('click', e => { const m = e.target.closest('.miniatura'); if (m) mostrarFoto(Number(m.dataset.i)); });
['fTecnico', 'fEstado', 'fCliente', 'fFecha'].forEach(id => $(id).addEventListener('input', dibujarTabla));
$('btnLimpiar').addEventListener('click', () => { ['fTecnico', 'fEstado', 'fCliente', 'fFecha'].forEach(id => $(id).value = ''); dibujarTabla(); });

$('btnAutorizar').addEventListener('click', () => {
  obraActual.estado = 'CERRADA';
  modal.hide(); dibujarTabla(); dibujarResumen();
  aviso(`Obra #${obraActual.id} autorizada para facturación y cerrada.`, 'success');
});

$('btnDevolver').addEventListener('click', () => {
  const bloque = $('bloqueMotivo');
  if (bloque.classList.contains('d-none')) { bloque.classList.remove('d-none'); $('motivo').focus(); return; }
  if (!$('motivo').value.trim()) { $('motivo').classList.add('is-invalid'); return; }
  obraActual.estado = 'DEVUELTA';
  modal.hide(); dibujarTabla(); dibujarResumen();
  aviso(`Obra #${obraActual.id} devuelta al técnico.`, 'danger');
});

cargarTecnicos(); dibujarTabla(); dibujarResumen();
