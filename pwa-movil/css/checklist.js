const CHECKLISTS = {
  camara: [
    { id: 'c1', texto: 'Temperatura de la cámara dentro del rango', obligatorio: true },
    { id: 'c2', texto: 'Estado del sello de la puerta', obligatorio: true },
    { id: 'c3', texto: 'Funcionamiento del evaporador', obligatorio: true },
    { id: 'c4', texto: 'Drenaje sin obstrucciones', obligatorio: false },
    { id: 'c5', texto: 'Iluminación interior operativa', obligatorio: false }
  ],
  tunel: [
    { id: 't1', texto: 'Temperatura de congelado alcanzada', obligatorio: true },
    { id: 't2', texto: 'Velocidad de ventiladores', obligatorio: true },
    { id: 't3', texto: 'Presión del sistema de refrigeración', obligatorio: true },
    { id: 't4', texto: 'Estado de la cinta transportadora', obligatorio: false }
  ],
  clima: [
    { id: 'k1', texto: 'Limpieza o cambio de filtros', obligatorio: true },
    { id: 'k2', texto: 'Nivel de gas refrigerante', obligatorio: true },
    { id: 'k3', texto: 'Temperatura de salida de aire', obligatorio: false },
    { id: 'k4', texto: 'Ruidos o vibraciones anormales', obligatorio: false }
  ]
};

const respuestas = {};          
const selCategoria = document.getElementById('categoria');
const lista = document.getElementById('listaItems');
const barra = document.getElementById('barra');
const aviso = document.getElementById('aviso');
const btn = document.getElementById('btnContinuar');

function itemsActuales() { return CHECKLISTS[selCategoria.value]; }

function dibujar() {
  lista.innerHTML = '';
  itemsActuales().forEach(it => {
    const card = document.createElement('div');
    card.className = 'card item-card shadow-sm' + (it.obligatorio ? ' obligatorio' : '');
    card.id = 'card-' + it.id;
    card.innerHTML = `
      <div class="card-body">
        <p class="fw-semibold mb-2">${it.texto}
          ${it.obligatorio ? '<span class="text-danger" title="Obligatorio">*</span>' : ''}</p>
        <div class="row g-2">
          <div class="col-6">
            <input type="radio" class="btn-check" name="${it.id}" id="${it.id}-ok" value="ok" autocomplete="off">
            <label class="btn btn-outline-success btn-resp w-100" for="${it.id}-ok">Cumple</label>
          </div>
          <div class="col-6">
            <input type="radio" class="btn-check" name="${it.id}" id="${it.id}-falla" value="falla" autocomplete="off">
            <label class="btn btn-outline-danger btn-resp w-100" for="${it.id}-falla">No cumple</label>
          </div>
        </div>
      </div>`;
    card.querySelectorAll('input').forEach(r =>
      r.addEventListener('change', () => { respuestas[it.id] = r.value; actualizar(); }));
    if (respuestas[it.id]) card.querySelector(`#${it.id}-${respuestas[it.id]}`).checked = true;
    lista.appendChild(card);
  });
  actualizar();
}

function actualizar() {
  const items = itemsActuales();
  const respondidos = items.filter(i => respuestas[i.id]).length;
  barra.style.width = Math.round((respondidos / items.length) * 100) + '%';

  const faltantes = items.filter(i => i.obligatorio && !respuestas[i.id]);
  items.forEach(i => {
    const c = document.getElementById('card-' + i.id);
    c.classList.toggle('completo', !!respuestas[i.id]);
    c.classList.remove('falta');
  });

  if (faltantes.length) {
    btn.disabled = true;
    aviso.textContent = 'Faltan ' + faltantes.length + ' ítem(s) obligatorio(s) por responder.';
    aviso.classList.remove('d-none');
  } else {
    btn.disabled = false;
    aviso.classList.add('d-none');
  }
}

selCategoria.addEventListener('change', dibujar);

btn.addEventListener('click', () => {
  sessionStorage.setItem('checklist', JSON.stringify({ categoria: selCategoria.value, respuestas }));
  window.location.href = 'insumos.html';
});

dibujar();
