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

const NOMBRES = { clima: 'Climatización', camara: 'Cámara de frío', tunel: 'Túnel de congelado' };

function dibujar() {
  lista.innerHTML = '';
  document.getElementById('tipoServicio').textContent = NOMBRES[selCategoria.value];
  itemsActuales().forEach(it => {
    const card = document.createElement('div');
    card.className = 'item' + (it.obligatorio ? ' obligatorio' : '');
    card.id = 'card-' + it.id;
    const opciones = it.obligatorio
      ? '<option value="ok">Cumple</option><option value="falla">No cumple</option>'
      : '<option value="ok">Cumple</option><option value="falla">No cumple</option><option value="na">No aplica</option>';
    card.innerHTML = `
      <label class="etiqueta mb-2" for="s-${it.id}">${it.texto}${it.obligatorio ? ' <span class="text-danger" title="Obligatorio">*</span>' : ''}</label>
      <select class="form-select" id="s-${it.id}">
        <option value="">Seleccionar opción</option>${opciones}
      </select>`;
    const sel = card.querySelector('select');
    if (respuestas[it.id]) sel.value = respuestas[it.id];
    sel.classList.toggle('respondido', !!sel.value);
    sel.addEventListener('change', () => {
      if (sel.value) respuestas[it.id] = sel.value; else delete respuestas[it.id];
      sel.classList.toggle('respondido', !!sel.value);
      actualizar();
    });
    lista.appendChild(card);
  });
  actualizar();
}

function actualizar() {
  const items = itemsActuales();
  const respondidos = items.filter(i => respuestas[i.id]).length;
  barra.style.width = Math.round((respondidos / items.length) * 100) + '%';
  const faltantes = items.filter(i => i.obligatorio && !respuestas[i.id]);
  items.forEach(i => document.getElementById('card-' + i.id).classList.toggle('completo', !!respuestas[i.id]));
  btn.disabled = faltantes.length > 0;
  aviso.textContent = 'Complete todos los ítems del protocolo antes de continuar (faltan ' + faltantes.length + ' obligatorios).';
  aviso.classList.toggle('d-none', faltantes.length === 0);
}

function red() {
  const e = document.getElementById('estadoRed');
  e.textContent = navigator.onLine ? 'En línea' : 'Sin conexión';
  e.classList.toggle('sin-red', !navigator.onLine);
}
window.addEventListener('online', red); window.addEventListener('offline', red); red();

selCategoria.addEventListener('change', dibujar);

btn.addEventListener('click', () => {
  sessionStorage.setItem('checklist', JSON.stringify({ categoria: selCategoria.value, respuestas }));
  window.location.href = 'insumos.html';
});

dibujar();
