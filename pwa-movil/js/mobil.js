// Acceso de demostración para el prototipo móvil; requiere un backend para producción.
const usuariosDemo = [
    {
        usuario: "reinaldo",
        rut: "12345678-9",
        clave: "1234",
        rol: "tecnico",
        nombre: "Reinaldo Tapia"
    },
    {
        usuario: "admin",
        rut: "98765432-1",
        clave: "admin123",
        rol: "administrador",
        nombre: "Administrador Central"
    }
];

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const usuarioIngresado = document.getElementById("username").value.trim().toLowerCase();
        const claveIngresada = document.getElementById("password").value;
        const errorDiv = document.getElementById("error-message");

        errorDiv.classList.add("d-none");

        const usuario = usuariosDemo.find(
            (cuenta) => cuenta.usuario === usuarioIngresado || cuenta.rut.toLowerCase() === usuarioIngresado
        );

        if (!usuario || usuario.clave !== claveIngresada) {
            errorDiv.textContent = "Usuario o contraseña incorrectos.";
            errorDiv.classList.remove("d-none");
            return;
        }

        if (usuario.rol !== "tecnico") {
            errorDiv.textContent = "Acceso denegado. Esta aplicación es solo para técnicos.";
            errorDiv.classList.remove("d-none");
            return;
        }

        sessionStorage.setItem("tecnico_nombre", usuario.nombre);
        window.location.assign("home.html");
    });
}

const homePage = document.getElementById("homePage");

if (homePage) {
    const tecnicoNombre = sessionStorage.getItem("tecnico_nombre");

    if (!tecnicoNombre) {
        window.location.replace("login.html");
    } else {
        document.getElementById("tecnicoNombre").textContent = tecnicoNombre;
    }

    document.getElementById("logoutButton").addEventListener("click", () => {
        sessionStorage.removeItem("tecnico_nombre");
        window.location.replace("login.html");
    });
}

const detailPage = document.getElementById("detailPage");

if (detailPage) {
    if (!sessionStorage.getItem("tecnico_nombre")) {
        window.location.replace("login.html");
    } else {
        const obras = {
            "105": {
                id: "#105",
                name: "Climatización",
                client: "Agroindustrial El Peumo de Bulnes SpA",
                address: "Hijuelas El Rosal s/n, Ruta 148, Bulnes, Ñuble",
                contact: "Juan Perez | +56 9 3472 8940",
                type: "Climatización",
                time: "16:30 hrs",
                budget: "PRES-2026-012",
                location: "Cámara de Frío #2",
                instructions: "Revisión de unidad manejadora de aire (UMAH) y Split Central. Inspección de filtros de aire, verificación de presión de gas refrigerante R-410A / R-32, limpieza de serpentín del evaporador y condensador, comprobación del sistema de drenaje de condensado y calibración de termostato digital.",
                equipment: [
                    "Equipo: Unidad de Climatización Roof-Top / Multi-Split Industrial",
                    "Tensión: 220V / 380V Trifásico",
                    "Caudal de Aire: 2.500 - 3.500 CFM",
                    "Tipo de Refrigerante: R-410A / R-32"
                ],
                emergency: false
            },
            "106": {
                id: "#106",
                name: "Climatización",
                client: "Frigorífico y Procesadora Frutícola Ñuble Ltda.",
                address: "Longitudinal Sur Km 398, Parque Industrial",
                contact: "Carlos Mendoza | +56 9 8765 4321",
                type: "Emergencia",
                time: "8:00 hrs",
                budget: "PRES-2026-019",
                location: "Cámara de Congelado #1",
                instructions: "Atención requerida: falla crítica en central de frío y riesgo inminente de quiebre en la cadena de frío de fruta fresca de exportación. Acciones iniciales: inspección urgente de compresor semihermético, verificación de fuga masiva de refrigerante R-404A en línea de líquido y revisión de disparo por alta temperatura.",
                equipment: [
                    "Equipo: Rack de Frío Industrial / Compresor Semihermético BITZER",
                    "Tensión: 380V Trifásico",
                    "Set Point Requerido: -22 °C",
                    "Tipo de Refrigerante: R-404A"
                ],
                emergency: true
            }
        };

        const workId = new URLSearchParams(window.location.search).get("id") || "105";
        const work = obras[workId];

        if (!work) {
            window.location.replace("home.html");
        } else {
            document.title = `FYAG - Detalle ${work.id}`;
            document.getElementById("workHeading").textContent = `ID: ${work.id} - ${work.name}`;
            document.getElementById("workClient").textContent = work.client;
            document.getElementById("workAddress").textContent = work.address;
            document.getElementById("workContact").textContent = work.contact;
            document.getElementById("workType").textContent = work.type;
            document.getElementById("workTime").textContent = work.time;
            document.getElementById("workBudget").textContent = work.budget;
            document.getElementById("workLocation").textContent = work.location;
            document.getElementById("workInstructions").textContent = work.instructions;

            const equipmentList = document.getElementById("workEquipment");
            work.equipment.forEach((item) => {
                const listItem = document.createElement("li");
                listItem.textContent = item;
                equipmentList.appendChild(listItem);
            });

            const workSummary = document.getElementById("workSummary");
            if (work.emergency) {
                workSummary.classList.add("is-emergency");
            }

            const gpsFeedback = document.getElementById("gpsFeedback");
            const directionsButton = document.getElementById("directionsButton");
            const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(work.address)}`;

            function showGpsFallback(message) {
                gpsFeedback.replaceChildren(document.createTextNode(`${message} Puedes consultar la dirección sin GPS. `));
                const mapLink = document.createElement("a");
                mapLink.href = mapSearchUrl;
                mapLink.target = "_blank";
                mapLink.rel = "noopener noreferrer";
                mapLink.textContent = "Abrir dirección en Maps";
                gpsFeedback.appendChild(mapLink);
                gpsFeedback.classList.remove("d-none");
            }

            directionsButton.addEventListener("click", () => {
                gpsFeedback.classList.add("d-none");

                if (!navigator.geolocation) {
                    showGpsFallback("Este dispositivo no permite obtener la ubicación.");
                    return;
                }

                directionsButton.disabled = true;
                directionsButton.textContent = "Buscando ubicación...";
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const origin = `${position.coords.latitude},${position.coords.longitude}`;
                        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(work.address)}&travelmode=driving`;
                        window.location.assign(directionsUrl);
                    },
                    (error) => {
                        const message = error.code === error.PERMISSION_DENIED
                            ? "No se permitió el acceso al GPS."
                            : "No se pudo obtener la ubicación actual.";
                        showGpsFallback(`${message} Puedes iniciar la faena de todas formas.`);
                        directionsButton.disabled = false;
                        directionsButton.textContent = "¿Cómo llegar?";
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
                );
            });

            document.getElementById("startWorkButton").addEventListener("click", () => {
                sessionStorage.setItem("faena_id", workId);
                window.location.assign(`formulario.html?id=${encodeURIComponent(workId)}`);
            });
        }
    }
}

const technicalForm = document.getElementById("technicalForm");

if (technicalForm) {
    if (!sessionStorage.getItem("tecnico_nombre")) {
        window.location.replace("login.html");
    } else {
        const formulariosPorObra = {
            "105": {
                tipo: "Climatización",
                cliente: "Agroindustrial El Peumo de Bulnes SpA",
                puntos: [
                    { id: "filter-cleaning", label: "Estado y limpieza de filtros de aire", obligatorio: true },
                    { id: "refrigerant-pressure", label: "Presión de gas refrigerante", obligatorio: true },
                    { id: "coil-cleaning", label: "Limpieza de serpentín (evaporador y condensador)", obligatorio: true },
                    { id: "drainage", label: "Sistema de drenaje y bandeja de condensado", obligatorio: true },
                    { id: "thermostat", label: "Calibración del termostato digital", obligatorio: true }
                ]
            },
            "106": {
                tipo: "Climatización",
                cliente: "Frigorífico y Procesadora Frutícola Ñuble Ltda.",
                puntos: [
                    { id: "compressor-inspection", label: "Inspección del compresor semihermético", obligatorio: true },
                    { id: "refrigerant-leak", label: "Verificación de fuga de refrigerante R-404A", obligatorio: true },
                    { id: "high-temperature", label: "Revisión de disparo por alta temperatura", obligatorio: true },
                    { id: "cold-chain", label: "Confirmación del estado de la cadena de frío", obligatorio: true }
                ]
            }
        };

        const params = new URLSearchParams(window.location.search);
        const workId = params.get("id") || sessionStorage.getItem("faena_id") || "105";
        const formConfig = formulariosPorObra[workId];
        const formMessage = document.getElementById("formMessage");

        if (!formConfig) {
            window.location.replace("home.html");
        } else {
            const storageKey = `formulario_faena_${workId}`;
            const savedForm = JSON.parse(localStorage.getItem(storageKey) || "{}");
            document.title = `FYAG - Formulario Técnico ${workId}`;
            document.getElementById("formWorkId").textContent = `ID: #${workId} - ${formConfig.tipo}`;

            const connectionStatus = document.getElementById("connectionStatus");
            function updateConnectionStatus() {
                connectionStatus.lastChild.textContent = navigator.onLine ? " En línea" : " Sin conexión";
                connectionStatus.classList.toggle("offline-status", !navigator.onLine);
            }
            updateConnectionStatus();
            window.addEventListener("online", updateConnectionStatus);
            window.addEventListener("offline", updateConnectionStatus);

            const checklist = document.getElementById("technicalChecklist");
            formConfig.puntos.forEach((point) => {
                const card = document.createElement("section");
                card.className = "checklist-card";

                const label = document.createElement("label");
                label.htmlFor = point.id;
                label.textContent = point.label;

                if (point.obligatorio) {
                    const required = document.createElement("span");
                    required.className = "required-label";
                    required.textContent = "Obligatorio";
                    label.appendChild(required);
                }

                const select = document.createElement("select");
                select.className = "form-select checklist-select";
                select.id = point.id;
                select.name = point.id;
                select.required = point.obligatorio;
                select.setAttribute("aria-label", point.label);
                select.innerHTML = '<option value="">Seleccionar opción</option><option value="realizado">Realizado</option><option value="observacion">Requiere observación</option><option value="no-aplica">No aplica</option>';
                select.value = savedForm.respuestas?.[point.id] || "";
                card.append(label, select);
                checklist.appendChild(card);
            });

            const observationField = document.getElementById("technicalObservations");
            observationField.value = savedForm.observaciones || "";

            function saveProgress() {
                const respuestas = {};
                formConfig.puntos.forEach((point) => {
                    respuestas[point.id] = document.getElementById(point.id).value;
                });
                localStorage.setItem(storageKey, JSON.stringify({
                    respuestas,
                    observaciones: observationField.value,
                    actualizado: new Date().toISOString()
                }));
            }

            technicalForm.addEventListener("change", saveProgress);
            observationField.addEventListener("input", saveProgress);

            technicalForm.addEventListener("submit", (event) => {
                event.preventDefault();
                formMessage.classList.add("d-none");

                const incompletos = formConfig.puntos.filter(
                    (point) => point.obligatorio && !document.getElementById(point.id).value
                );

                if (incompletos.length) {
                    document.getElementById("formMessageText").textContent =
                        "Complete todos los ítems del protocolo antes de continuar.";
                    formMessage.classList.remove("d-none");
                    document.getElementById(incompletos[0].id).focus();
                    return;
                }

                saveProgress();
                sessionStorage.setItem("faena_id", workId);
                window.location.assign(`consumodeinsumos.html?id=${encodeURIComponent(workId)}`);
            });

            document.getElementById("backToWork").href = `detalledeobra.html?id=${encodeURIComponent(workId)}`;
        }
    }
}

const suppliesForm = document.getElementById("suppliesForm");

if (suppliesForm) {
    if (!sessionStorage.getItem("tecnico_nombre")) {
            window.location.replace("login.html");
    } else {
            const suppliesByWork = {
                "105": {
                    type: "Climatización",
                    materials: [
                        { id: "filter", name: "Filtro de aire", stock: 12, unit: "unidad" },
                        { id: "r410a", name: "Refrigerante R-410A", stock: 8, unit: "kg" },
                        { id: "r32", name: "Refrigerante R-32", stock: 5, unit: "kg" },
                        { id: "cleaner", name: "Limpiador de serpentín", stock: 10, unit: "litro" },
                        { id: "drain-hose", name: "Manguera de drenaje", stock: 6, unit: "metro" }
                    ]
                },
                "106": {
                    type: "Climatización",
                    materials: [
                        { id: "r404a", name: "Refrigerante R-404A", stock: 4, unit: "kg" },
                        { id: "compressor-oil", name: "Aceite para compresor", stock: 3, unit: "litro" },
                        { id: "copper-tube", name: "Tubería de cobre", stock: 8, unit: "metro" },
                        { id: "filter-drier", name: "Filtro deshidratador", stock: 5, unit: "unidad" }
                    ]
                }
            };

            const workId = new URLSearchParams(window.location.search).get("id")
                || sessionStorage.getItem("faena_id")
                || "105";
            const config = suppliesByWork[workId];

            if (!config) {
                window.location.replace("home.html");
            } else {
                const storageKey = `insumos_faena_${workId}`;
                const requestKey = `solicitud_insumos_${workId}`;
                const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
                const list = document.getElementById("materialsList");
                const status = document.getElementById("suppliesConnectionStatus");
                let nextRowId = 0;

                document.title = `FYAG - Consumo de Insumos ${workId}`;
                document.getElementById("suppliesWorkId").textContent = `ID: #${workId} - ${config.type}`;
                const formUrl = `formulario.html?id=${encodeURIComponent(workId)}`;
                document.getElementById("backToTechnicalForm").href = formUrl;
                document.getElementById("backToTechnicalFormBottom").href = formUrl;

                function updateConnectionStatus() {
                    status.lastChild.textContent = navigator.onLine ? " En línea" : " Sin conexión";
                    status.classList.toggle("offline-status", !navigator.onLine);
                }
                updateConnectionStatus();
                window.addEventListener("online", updateConnectionStatus);
                window.addEventListener("offline", updateConnectionStatus);

                function saveMaterials() {
                    const materials = Array.from(list.querySelectorAll(".material-row")).map((row) => ({
                        materialId: row.querySelector(".material-select").value,
                        quantity: row.querySelector(".material-quantity").value
                    }));
                    localStorage.setItem(storageKey, JSON.stringify({
                        materials,
                        updatedAt: new Date().toISOString()
                    }));
                }

                function updateMaterialStatus(row) {
                    const select = row.querySelector(".material-select");
                    const quantityInput = row.querySelector(".material-quantity");
                    const stockText = row.querySelector(".material-stock");
                    const selected = config.materials.find((material) => material.id === select.value);

                    if (!selected) {
                        quantityInput.removeAttribute("max");
                        stockText.textContent = "Rebajado de Stock";
                        stockText.classList.remove("stock-warning");
                        return;
                    }

                    quantityInput.max = String(selected.stock);
                    stockText.textContent = `✓ Rebajado de Stock (${selected.stock} ${selected.unit} disponibles)`;
                    stockText.classList.toggle(
                        "stock-warning",
                        Number(quantityInput.value) > selected.stock
                    );
                }

                function addMaterialRow(material = {}) {
                    nextRowId += 1;
                    const row = document.createElement("article");
                    row.className = "material-row";

                    const materialLabel = document.createElement("label");
                    materialLabel.htmlFor = `material-${nextRowId}`;
                    materialLabel.textContent = "Artículo / Repuesto";

                    const select = document.createElement("select");
                    select.id = `material-${nextRowId}`;
                    select.className = "form-select material-select";
                    select.required = true;
                    select.innerHTML = '<option value="">Seleccionar opción</option>';
                    config.materials.forEach((item) => {
                        const option = document.createElement("option");
                        option.value = item.id;
                        option.textContent = item.name;
                        select.appendChild(option);
                    });
                    select.value = material.materialId || "";

                    const quantityLabel = document.createElement("label");
                    quantityLabel.htmlFor = `quantity-${nextRowId}`;
                    quantityLabel.textContent = "Cantidad Usada";

                    const quantity = document.createElement("input");
                    quantity.id = `quantity-${nextRowId}`;
                    quantity.className = "form-control material-quantity";
                    quantity.type = "number";
                    quantity.min = "0";
                    quantity.step = "any";
                    quantity.placeholder = "Ingresar cantidad";
                    quantity.value = material.quantity || "";
                    quantity.required = true;

                    const stockLabel = document.createElement("p");
                    stockLabel.className = "material-status-label";
                    stockLabel.textContent = "Estado Cardex";

                    const rowFooter = document.createElement("div");
                    rowFooter.className = "material-row-footer";
                    const stockText = document.createElement("span");
                    stockText.className = "material-stock";
                    const remove = document.createElement("button");
                    remove.className = "remove-material";
                    remove.type = "button";
                    remove.setAttribute("aria-label", "Eliminar material");
                    remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21a2 2 0 0 1-2-2V7h14v12a2 2 0 0 1-2 2H7ZM4 4h5l1-1h4l1 1h5v2H4V4Z"/></svg>';
                    rowFooter.append(stockText, remove);
                    row.append(
                        materialLabel,
                        select,
                        quantityLabel,
                        quantity,
                        stockLabel,
                        rowFooter
                    );
                    list.appendChild(row);

                    select.addEventListener("change", () => {
                        updateMaterialStatus(row);
                        saveMaterials();
                    });
                    quantity.addEventListener("input", () => {
                        updateMaterialStatus(row);
                        saveMaterials();
                    });
                    remove.addEventListener("click", () => {
                        row.remove();
                        saveMaterials();
                    });
                    updateMaterialStatus(row);
                }

                (saved.materials || []).forEach(addMaterialRow);

                document.getElementById("addMaterialButton").addEventListener("click", () => {
                    addMaterialRow();
                    saveMaterials();
                    const newSelect = list.querySelector(".material-row:last-child .material-select");
                    newSelect.focus();
                    newSelect.scrollIntoView({ behavior: "smooth", block: "center" });
                });

                const requestDialog = document.getElementById("requestSuppliesDialog");
                document.getElementById("requestSuppliesButton").addEventListener("click", () => {
                    requestDialog.showModal();
                });
                document.getElementById("cancelSupplyRequest").addEventListener("click", () => {
                    requestDialog.close();
                });
                document.getElementById("supplyRequestForm").addEventListener("submit", (event) => {
                    event.preventDefault();
                    const requestText = document.getElementById("supplyRequestText").value.trim();
                    if (!requestText) return;
                    localStorage.setItem(requestKey, JSON.stringify({
                        detail: requestText,
                        createdAt: new Date().toISOString()
                    }));
                    requestDialog.close();
                    const message = document.getElementById("suppliesMessage");
                    message.textContent = "Solicitud de insumos guardada en este dispositivo.";
                    message.classList.remove("d-none");
                    document.getElementById("supplyRequestText").value = "";
                });

                suppliesForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    const rows = Array.from(list.querySelectorAll(".material-row"));
                    const invalidRow = rows.find((row) => {
                        const materialId = row.querySelector(".material-select").value;
                        const quantity = Number(row.querySelector(".material-quantity").value);
                        const selected = config.materials.find((item) => item.id === materialId);
                        return !selected || !Number.isFinite(quantity) || quantity <= 0 || quantity > selected.stock;
                    });

                    if (invalidRow) {
                        const selected = config.materials.find(
                            (item) => item.id === invalidRow.querySelector(".material-select").value
                        );
                        const feedback = document.getElementById("suppliesMessage");
                        feedback.textContent = selected
                            ? `Ingrese una cantidad mayor que cero y no superior al stock disponible (${selected.stock} ${selected.unit}).`
                            : "Seleccione un material e ingrese la cantidad utilizada.";
                        feedback.classList.remove("d-none");
                        invalidRow.scrollIntoView({ behavior: "smooth", block: "center" });
                        return;
                    }

                    saveMaterials();
                    const feedback = document.getElementById("suppliesMessage");
                    feedback.textContent = "Avance guardado en este dispositivo.";
                    feedback.classList.remove("d-none");
                });
            }
        }
}
