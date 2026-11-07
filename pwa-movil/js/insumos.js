// Catálogo de insumos (datos de ejemplo; luego vendrán de la API).
const CATALOGO = [
  { id: 1, codigo: 'FLT-001', nombre: 'Filtro deshidratador', stock: 12, unidad: 'un', paso: 1 },
  { id: 2, codigo: 'GAS-404', nombre: 'Gas refrigerante R404A', stock: 18, unidad: 'kg', paso: 0.5 },
  { id: 3, codigo: 'SEL-010', nombre: 'Sello de puerta cámara', stock: 4, unidad: 'un', paso: 1 },
  { id: 4, codigo: 'COR-022', nombre: 'Correa de ventilador', stock: 9, unidad: 'un', paso: 1 },
  { id: 5, codigo: 'CON-031', nombre: 'Contactor 25A', stock: 6, unidad: 'un', paso: 1 },
  { id: 6, codigo: 'TER-040', nombre: 'Termostato digital', stock: 2, unidad: 'un', paso: 1 },
  { id: 7, codigo: 'ACE-050', nombre: 'Aceite para compresor', stock: 25, unidad: 'lt', paso: 0.5 }
];

const consumo = {};   // { idInsumo: cantidad }
const cont = document.getElementById('catalogo');
const resumen = document.getElementById('resumen');
const aviso = document.getElementById('aviso');
const buscador = document.getElementById('buscador');
const sinRes = document.getElementById('sinResultados');
const contador = document.getElementById('contador');

const fmt = n => String(Math.round(n * 100) / 100);

function dibujar() {
  const q = buscador.value.trim().toLowerCase();
  const lista = CATALOGO.filter(i => i.nombre.toLowerCase().includes(q) || i.codigo.toLowerCase().includes(q));
  cont.innerHTML = '';
  sinRes.classList.toggle('d-none', lista.length > 0);

  lista.forEach(i => {
    const cant = consumo[i.id] || 0;
    const card = document.createElement('div');
    card.className = 'card insumo-card shadow-sm' + (cant > 0 ? ' seleccionado' : '');
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="fw-semibold">${i.nombre}</div>
            <div class="small text-muted">Código: ${i.codigo}</div>
          </div>
          <div class="text-end small ${i.stock <= 3 ? 'stock-bajo' : 'text-muted'}">
            Stock: ${fmt(i.stock)} ${i.unidad}
          </div>
        </div>
        <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
          <button class="btn btn-outline-danger btn-cant" data-id="${i.id}" data-op="-" aria-label="Quitar">&minus;</button>
          <span class="cant-valor">${fmt(cant)} <small>${i.unidad}</small></span>
          <button class="btn btn-outline-success btn-cant" data-id="${i.id}" data-op="+" aria-label="Agregar">+</button>
        </div>
      </div>`;
    cont.appendChild(card);
  });
}

function cambiar(id, op) {
  const ins = CATALOGO.find(i => i.id === id);
  let nueva = (consumo[id] || 0) + (op === '+' ? ins.paso : -ins.paso);
  if (nueva < 0) nueva = 0;
  if (nueva > ins.stock) {
    mostrarAviso('No puedes usar más de lo disponible: ' + ins.nombre + ' (stock ' + fmt(ins.stock) + ' ' + ins.unidad + ').');
    nueva = ins.stock;
  } else {
    aviso.classList.add('d-none');
  }
  if (nueva === 0) delete consumo[id]; else consumo[id] = nueva;
  dibujar();
  actualizarResumen();
}

function actualizarResumen() {
  const ids = Object.keys(consumo);
  contador.textContent = ids.length;
  if (!ids.length) {
    resumen.innerHTML = '<li class="list-group-item text-muted">Aún no has seleccionado insumos.</li>';
    return;
  }
  resumen.innerHTML = ids.map(id => {
    const i = CATALOGO.find(x => x.id === Number(id));
    return `<li class="list-group-item d-flex justify-content-between">
              <span>${i.nombre}</span><strong>${fmt(consumo[id])} ${i.unidad}</strong></li>`;
  }).join('');
}

function mostrarAviso(t) { aviso.textContent = t; aviso.classList.remove('d-none'); }

cont.addEventListener('click', e => {
  const b = e.target.closest('button[data-id]');
  if (b) cambiar(Number(b.dataset.id), b.dataset.op);
});
buscador.addEventListener('input', dibujar);

document.getElementById('btnConfirmar').addEventListener('click', () => {
  if (!Object.keys(consumo).length) {
    mostrarAviso('Selecciona al menos un insumo, o vuelve si no usaste materiales.');
    return;
  }
  // Guarda el consumo para la siguiente pantalla y avanza (Evidencia fotográfica: Integrante 4)
  sessionStorage.setItem('consumo', JSON.stringify(consumo));
  window.location.href = 'evidencia.html';
});

dibujar();
actualizarResumen();
