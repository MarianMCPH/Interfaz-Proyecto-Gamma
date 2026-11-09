// Bandeja de auditoría. Datos de ejemplo (luego vendrán de la API).
// Estados de la interfaz (maqueta): PROCESO (EN_EJECUCION), PENDIENTE (BD: FINALIZADA), APROBADA (BD: CERRADA, bloqueada) y OBSERVADA (devuelta; vuelve a EN_EJECUCION).
const OBRAS = [
  { id: 1042, cliente: 'Packing Frutícola Ñuble', tecnico: 'Carlos Soto', fecha: '2026-11-03', direccion: 'Ruta N-59, km 12, Chillán', servicio: 'Mantención preventiva cámara', fotos: 4, firmante: 'Pedro Muñoz', estado: 'PENDIENTE',
    materiales: [['FLT-001', 'Filtro deshidratador', '1 un'], ['GAS-404', 'Gas refrigerante R404A', '1,5 kg']] },
  { id: 1043, cliente: 'Viña Valle Sur', tecnico: 'Marcela Rojas', fecha: '2026-11-04', direccion: 'Camino a Cato s/n', servicio: 'Reparación túnel de congelado', fotos: 3, firmante: 'Ana Fuentes', estado: 'PENDIENTE',
    materiales: [['COR-022', 'Correa de ventilador', '2 un'], ['ACE-050', 'Aceite para compresor', '2 lt']] },
  { id: 1038, cliente: 'Frigorífico Los Aromos', tecnico: 'Carlos Soto', fecha: '2026-10-30', direccion: 'Parcela 8, San Carlos', servicio: 'Climatización industrial', fotos: 5, firmante: 'Luis Parra', estado: 'APROBADA',
    materiales: [['CON-031', 'Contactor 25A', '1 un']] },
  { id: 1040, cliente: 'Packing Frutícola Ñuble', tecnico: 'Diego Vega', fecha: '2026-11-02', direccion: 'Ruta N-59, km 12, Chillán', servicio: 'Emergencia: falla de evaporador', fotos: 2, firmante: 'Pedro Muñoz', estado: 'OBSERVADA',
    materiales: [['TER-040', 'Termostato digital', '1 un']] },
  { id: 1045, cliente: 'Viña Valle Sur', tecnico: 'Diego Vega', fecha: '2026-11-05', direccion: 'Camino a Cato s/n', servicio: 'Mantención preventiva', fotos: 3, firmante: 'Ana Fuentes', estado: 'PENDIENTE',
    materiales: [['SEL-010', 'Sello de puerta cámara', '1 un']] },
  { id: 1046, cliente: 'Frigorífico Los Aromos', tecnico: 'Marcela Rojas', fecha: '', direccion: 'Parcela 8, San Carlos', servicio: 'Mantención preventiva', fotos: 0, firmante: '', estado: 'PROCESO', materiales: [] }
];

const ETIQ = { PROCESO: 'En proceso', PENDIENTE: 'Pendiente', APROBADA: 'Aprobada', OBSERVADA: 'Observación' };
const CHECK = ['Limpieza o cambio de filtros', 'Nivel de gas refrigerante', 'Temperatura de salida de aire', 'Ruidos o vibraciones anormales'];
const $ = id => document.getElementById(id);
const toast = bootstrap.Toast.getOrCreateInstance($('toastAviso'));
let obraActual = null, tab = '';

function placeholder(texto, w = 640, h = 420) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#6c6fa3"/>` +
    `<text x="50%" y="50%" fill="#fff" font-family="Arial" font-size="${Math.round(h / 9)}" text-anchor="middle" dominant-baseline="middle">${texto}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
function firmaSvg(nombre) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="110"><rect width="100%" height="100%" fill="#fff"/>` +
    `<path d="M20 70 C50 10, 80 110, 110 50 S170 20, 200 70 S270 90, 300 40" stroke="#1d3557" stroke-width="3" fill="none"/>` +
    `<text x="160" y="102" font-family="Arial" font-size="12" fill="#555" text-anchor="middle">${nombre}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
const fechaCL = iso => { if (!iso) return '—'; const [a, m, d] = iso.split('-'); return `${d}-${m}-${a}`; };
const pill = e => `<span class="pill ${e}">${ETIQ[e]}</span>`;

function dibujarResumen() {
  const n = e => OBRAS.filter(o => o.estado === e).length;
  const k = (t, v, c) => `<div class="col-6 col-lg-3"><div class="kpi ${c}"><div class="text-muted small">${t}</div><div class="n">${v}</div></div></div>`;
  $('resumen').innerHTML = k('Pendientes de auditoría', n('PENDIENTE'), 'amarillo') + k('Aprobadas', n('APROBADA'), 'verde') +
    k('Con observación', n('OBSERVADA'), 'rojo') + k('En proceso', n('PROCESO'), 'amarillo');
}

function filtradas() {
  const q = $('buscar').value.trim().toLowerCase(), t = $('fTecnico').value;
  return OBRAS.filter(o => (!tab || o.estado === tab) && (!t || o.tecnico === t) &&
    (!q || `${o.id} ${o.cliente} ${o.servicio} ${o.tecnico}`.toLowerCase().includes(q)));
}

function dibujarTabla() {
  const lista = filtradas();
  $('vacio').classList.toggle('d-none', lista.length > 0);
  $('tbody').innerHTML = lista.map(o => {
    const aprobada = o.estado === 'APROBADA', proceso = o.estado === 'PROCESO';
    return `<tr class="${aprobada ? 'fila-cerrada' : ''}">
      <td class="fw-semibold">#${o.id}</td><td>${o.cliente}</td><td>${o.servicio}</td><td>${o.tecnico}</td><td>${fechaCL(o.fecha)}</td>
      <td class="text-center">${proceso ? '—' : `<span title="${o.fotos} fotos"><i class="bi bi-image"></i> ${o.fotos}</span> &nbsp; <i class="bi bi-pen" title="Firma del mandante"></i>`}</td>
      <td>${pill(o.estado)}</td>
      <td class="text-end"><button class="btn btn-sm ${aprobada ? 'btn-outline-secondary' : 'btn-indigo'}" data-id="${o.id}" ${proceso ? 'disabled' : ''}>${aprobada ? 'Ver detalle' : 'Auditar'}</button></td></tr>`;
  }).join('');
}

function mostrarFoto(i) {
  $('visor').innerHTML = `<img src="${placeholder('Foto ' + (i + 1) + ' de ' + obraActual.fotos)}" alt="Foto ${i + 1} de la obra">`;
  document.querySelectorAll('.miniatura').forEach((m, k) => m.classList.toggle('activa', k === i));
}

function abrir(id) {
  const o = obraActual = OBRAS.find(x => x.id === id);
  $('tituloObra').textContent = `Auditar Obra #${o.id}`; $('badgeObra').innerHTML = pill(o.estado);
  $('datosObra').innerHTML = [['Cliente', o.cliente], ['Dirección', o.direccion], ['Técnico', o.tecnico], ['Servicio', o.servicio], ['Fecha cierre', fechaCL(o.fecha)]]
    .map(([k, v]) => `<dt class="col-4">${k}</dt><dd class="col-8">${v}</dd>`).join('');
  $('checklistObra').innerHTML = CHECK.map((c, i) => {
    const mal = o.estado === 'OBSERVADA' && i === 1;
    return `<li class="list-group-item d-flex justify-content-between px-0"><span>${c}</span><span class="${mal ? 'text-danger' : 'text-success'} fw-semibold">${mal ? 'No cumple' : 'Cumple'}</span></li>`;
  }).join('');
  $('materiales').innerHTML = o.materiales.map(m => `<tr><td>${m[0]}</td><td>${m[1]}</td><td class="text-end">${m[2]}</td><td class="text-success"><i class="bi bi-check-lg"></i> Rebajado</td></tr>`).join('');
  $('firma').innerHTML = `<img src="${firmaSvg(o.firmante)}" alt="Firma de ${o.firmante}">`; $('firmante').textContent = 'Firmante: ' + o.firmante;
  $('miniaturas').innerHTML = Array.from({ length: o.fotos }, (_, i) => `<img class="miniatura" data-i="${i}" src="${placeholder('Foto ' + (i + 1), 192, 144)}" alt="Miniatura ${i + 1}">`).join('');
  mostrarFoto(0);
  const bloq = o.estado === 'APROBADA';   // HU-08: obra cerrada no se modifica
  $('btnAprobar').disabled = bloq; $('btnObservar').disabled = bloq;
  $('notaEstado').textContent = bloq ? 'Obra aprobada: registro bloqueado para resguardo contable.' : '';
  $('bloqueMotivo').classList.add('d-none'); $('motivo').value = ''; $('motivo').classList.remove('is-invalid');
  $('vistaLista').classList.add('d-none'); $('vistaDetalle').classList.remove('d-none'); window.scrollTo(0, 0);
}
function volver() { $('vistaDetalle').classList.add('d-none'); $('vistaLista').classList.remove('d-none'); dibujarTabla(); dibujarResumen(); }
function aviso(t, tipo) { $('toastAviso').className = `toast text-bg-${tipo}`; $('toastTexto').textContent = t; toast.show(); }

$('tbody').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) abrir(Number(b.dataset.id)); });
$('miniaturas').addEventListener('click', e => { const m = e.target.closest('.miniatura'); if (m) mostrarFoto(Number(m.dataset.i)); });
$('tabs').addEventListener('click', e => {
  const b = e.target.closest('button[data-f]'); if (!b) return;
  tab = b.dataset.f; document.querySelectorAll('#tabs .nav-link').forEach(x => x.classList.toggle('active', x === b)); dibujarTabla();
});
$('buscar').addEventListener('input', dibujarTabla); $('fTecnico').addEventListener('input', dibujarTabla);
$('btnVolver').addEventListener('click', volver);

$('btnAprobar').addEventListener('click', () => {
  obraActual.estado = 'APROBADA';   // TODO API: autoriza facturación y cierra la faena
  volver(); aviso(`Obra #${obraActual.id} aprobada y cerrada para facturación.`, 'success');
});
$('btnObservar').addEventListener('click', () => {
  if ($('bloqueMotivo').classList.contains('d-none')) { $('bloqueMotivo').classList.remove('d-none'); $('motivo').focus(); return; }
  if (!$('motivo').value.trim()) { $('motivo').classList.add('is-invalid'); return; }
  obraActual.estado = 'OBSERVADA';  // TODO API: devuelve al técnico con el motivo
  volver(); aviso(`Obra #${obraActual.id} devuelta al técnico con observación.`, 'warning');
});

[...new Set(OBRAS.map(o => o.tecnico))].sort().forEach(t => $('fTecnico').insertAdjacentHTML('beforeend', `<option>${t}</option>`));
$('fechaHoy').textContent = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
dibujarResumen(); dibujarTabla();
