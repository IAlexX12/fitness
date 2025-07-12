// ============================================================
// RESUMEN DE LA CLASE PRINCIPAL FITNESS
// ============================================================
// Este archivo gestiona toda la lógica de la aplicación Fitness:
//
// - Variables globales
// - Renderizado dinámico de la tabla de clientes en la clase Taabla.js
// - Ordenación de la tabla por columnas (ASC/DESC)
// - Importación y exportación de clientes en formato CSV
// - Alta, edición y borrado de clientes (incluyendo modal de edición)
// - Validación de formularios (alta y edición) y feedback visual (Usando funciones de la clase validadorForm.js)
// - Integración con Choices.js para alergias y alimentos
// - Gestión de eventos y listeners para formularios y botones
//
// Clases auxiliares como Calculos, ModalEditarCliente y ValidadorForm son usadas como complementos
// ============================================================


// =====================
// Variables globales
// =====================
window.clientes = [];
let ordenColumna = null;
let ordenAscendente = true;

// =====================
// Renderizado
// =====================
// Primer render
document.addEventListener('DOMContentLoaded', function () {
    renderTabla();
    configurarOrdenTabla();
    actualizarIconosOrden();
});

// Reemplazo de renderTabla por TablaClientes.renderTabla
function renderTabla() {
    window.TablaClientes.renderTabla(clientes);
}

// Orden de la tabla (ASC/DESC)
function configurarOrdenTabla() {
    TablaClientes.configurarOrdenTabla(clientes);
}

// Ordena clientes
function ordenarClientes(columna, asc) {
    TablaClientes.ordenarClientes(clientes, columna, asc);
}

// Actualizar iconos de ordenado
function actualizarIconosOrden() {
    TablaClientes.actualizarIconosOrden();
}

// =====================
// Importar CSV
// =====================
function importarDesdeCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const map = {
        'nombre': 'nombre',
        'altura': 'altura',
        'peso': 'peso',
        'edad': 'edad',
        '% graso': 'grasa',
        'm. magra': 'masaMagra',
        'm. grasa': 'masaGrasa',
        'imc': 'imc',
        'mb': 'mb',
        'calorías objetivo': 'caloriasObjetivo',
        'actividad': 'actividad',
        'objetivo': 'objetivo',
        '% objetivo': 'porcentajeObjetivo',
        'alergias': 'alergias',
        'alimentos': 'alimentos',
        'fecha alta': 'fechaAlta'
    };
    clientes.length = 0;
    lines.slice(1).forEach(line => {
        if (!line.trim()) return;
        const values = line.split(',');
        const cliente = {};
        headers.forEach((header, idx) => {
            const key = map[header];
            if (!key) return;
            if (key === 'alergias') {
                cliente.alergias = values[idx] ? values[idx].split(';').map(a => a.trim()).filter(a => a) : [];
            } else if (key === 'alimentos') {
                cliente.alimentos = values[idx] ? values[idx].split(';').map(a => a.trim()).filter(a => a) : [];
            } else {
                cliente[key] = values[idx];
            }
        });
        clientes.push(cliente);
    });
    renderTabla();
}

// =====================
// Borrar cliente
// =====================
window.borrarCliente = function (idx) {
    if (confirm('Confirmar borrado del cliente?')) {
        clientes.splice(idx, 1);
        renderTabla();
        mostrarToast('Cliente borrado correctamente', 'danger');
    }
}

// Borrar todos los clientes
document.getElementById('borrarTodos').addEventListener('click', function () {
    if (confirm('¿Seguro que quieres borrar todos los clientes?')) {
        clientes.length = 0;
        localStorage.removeItem('clientes');
        renderTabla();
    }
});

// =====================
// Event listeners
// =====================
// Formulario de alta de cliente
document.getElementById('fitnessForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Limpiar errores previos
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
    document.getElementById('infoMessage').style.display = 'none';

    // Validar antes de procesar
    let error = false;
    if (!ValidadorForm.validarFormularioCompleto()) {
        error = true;
    }

    // Validación de alergias y alimentos
    const alergiasSelect = document.getElementById('alergias');
    const alergias = Array.from(alergiasSelect.selectedOptions).map(opt => opt.text);
    const alergiasFeedback = document.querySelector('.alergias-feedback');
    if (alergias.length === 0) {
        if (alergiasFeedback) {
            alergiasFeedback.textContent = 'Debes seleccionar al menos una alergia.';
            alergiasFeedback.style.display = 'block';
        }
        error = true;
    }
    const alimentosSelect = document.getElementById('alimentos');
    const alimentos = Array.from(alimentosSelect.selectedOptions).map(opt => opt.text);
    const alimentosFeedback = document.querySelector('.alimentos-feedback');
    if (alimentos.length === 0) {
        if (alimentosFeedback) {
            alimentosFeedback.textContent = 'Debes seleccionar al menos un alimento.';
            alimentosFeedback.style.display = 'block';
        }
        error = true;
    }

    if (error) {
        document.getElementById('infoMessage').textContent = 'Por favor corrige los errores marcados';
        document.getElementById('infoMessage').style.display = 'block';
        document.getElementById('infoMessage').classList.add('alert-danger');
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const altura = parseFloat(document.getElementById('altura').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const edad = parseInt(document.getElementById('edad').value);
    const grasa = parseFloat(document.getElementById('grasa').value);

    const actividadTxt = document.getElementById('actividad').selectedOptions[0].text;
    const actividad = Number(document.getElementById('actividad').value);
    const objetivoTxt = document.getElementById('objetivo').selectedOptions[0].text;
    const objetivo = document.getElementById('objetivo').value;
    const porcentajeObjetivo = objetivo === 'mantenimiento' ? 0 : document.getElementById('porcentajeObjetivo').value;

    const calculos = Calculos.calcularCampos({ altura, peso, edad, grasa, actividad, objetivo, porcentajeObjetivo });
    const fechaActual = new Date().toLocaleDateString('es-ES');
    const cliente = {
        nombre: window.formatearNombre(nombre), altura, peso, edad, grasa,
        masaMagra: calculos.masaMagra,
        masaGrasa: calculos.masaGrasa,
        imc: calculos.imc,
        mb: calculos.mb,
        caloriasObjetivo: calculos.caloriasObjetivo,
        actividad: actividadTxt,
        objetivo: objetivoTxt,
        porcentajeObjetivo: porcentajeObjetivo,
        alergias: alergias,
        alimentos: alimentos,
        fechaAlta: fechaActual,
    };
    clientes.push(cliente);
    renderTabla();
    mostrarToast('Cliente añadido correctamente', 'success');
    setTimeout(() => {
        this.reset();
        document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }, 0);
});

// EXPORTAR a CSV
document.getElementById('exportarCSV').addEventListener('click', function () {
    let csv = 'Nombre,Altura,Peso,Edad,% Graso,M. Magra,M. Grasa,IMC,MB,Calorías Objetivo,Actividad,Objetivo,% Objetivo,Alergias,Alimentos,Fecha alta\n';
    clientes.forEach(cliente => {
        const altura = parseFloat(cliente.altura);
        const peso = parseFloat(cliente.peso);
        const edad = parseInt(cliente.edad);
        const grasa = parseFloat(cliente.grasa);
        let actividad = cliente.actividad;
        const porcentajeObjetivo = parseFloat(cliente.porcentajeObjetivo);
        if (isNaN(Number(actividad))) {
            actividad = 1.2;
        } else {
            actividad = Number(actividad);
        }
        let objetivo = cliente.objetivo;
        if (!['deficit', 'volumen', 'recomposicion', 'mantenimiento'].includes(objetivo)) {
            objetivo = 'deficit';
        }
        const calculos = Calculos.calcularCampos({ altura, peso, edad, grasa, actividad, objetivo, porcentajeObjetivo });
        csv += [
            cliente.nombre,
            cliente.altura,
            cliente.peso,
            cliente.edad,
            cliente.grasa,
            calculos.masaMagra,
            calculos.masaGrasa,
            calculos.imc,
            calculos.mb,
            cliente.caloriasObjetivo,
            cliente.actividad,
            cliente.objetivo,
            cliente.porcentajeObjetivo,
            (cliente.alergias || "").join(';'),
            (cliente.alimentos || "").join(';'),
            cliente.fechaAlta || '-'
        ].join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fecha = window.obtenerFechaHoraActual();
    a.download = `clientes_${fecha}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

// Importar desde CSV
document.getElementById('importarCSV').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

// Manejar la carga de archivo CSV
document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
        const text = evt.target.result;
        importarDesdeCSV(text);
    };
    reader.readAsText(file);
});

// =====================
// Inicialización y validaciones
// =====================
document.addEventListener('DOMContentLoaded', function () {
    configurarValidaciones();
    configurarValidacionesEdicion();

    document.getElementById('objetivo').addEventListener('change', function () {
        togglePorcentajeObjetivo();
    });

    document.getElementById('editObjetivo').addEventListener('change', function () {
        toggleEditPorcentajeObjetivo();
    });

    // Importar CSV desde localStorage
    const csv = localStorage.getItem('clientesCSV');
    if (csv) {
        importarDesdeCSV(csv);
        localStorage.removeItem('clientesCSV');
        const pantallaPrincipal = document.getElementById('pantallaPrincipal');
        if (pantallaPrincipal) pantallaPrincipal.style.display = '';
    }
    // Inicializar Choices.js
    if (window.Choices) {
        // Configuración común
        const commonConfig = {
            removeItemButton: true,
            searchEnabled: true,
            duplicateItemsAllowed: false,
            placeholder: true,
            shouldSort: false,
            loadingText: 'Cargando...',
            noResultsText: 'No se encontraron resultados',
            noChoicesText: 'No hay más opciones para seleccionar',
            itemSelectText: 'Presiona para seleccionar'
        };

        // Inicializar select de alergias
        new Choices('#alergias', {
            ...commonConfig,
            placeholderValue: 'Selecciona alergias...',
            searchPlaceholderValue: 'Buscar alergias...'
        });

        // Inicializar select de alimentos
        new Choices('#alimentos', {
            ...commonConfig,
            placeholderValue: 'Selecciona alimentos...',
            searchPlaceholderValue: 'Buscar alimentos...'
        });
    }
});

function togglePorcentajeObjetivo() {
    const objetivo = document.getElementById('objetivo').value;
    const porcentajeGroup = document.getElementById('porcentajeObjetivo').parentElement;

    if (objetivo === 'mantenimiento') {
        porcentajeGroup.value = 0;
        porcentajeGroup.dispatchEvent(new Event('input'));
        porcentajeGroup.style.display = objetivo === 'mantenimiento' ? 'none' : 'block';
    } else {
        porcentajeGroup.style.display = 'block';
    }
}

function toggleEditPorcentajeObjetivo() {
    const objetivo = document.getElementById('editObjetivo').value;
    const porcentajeGroup = document.getElementById('editPorcentajeObjetivo').parentElement;

    if (objetivo === 'mantenimiento') {
        porcentajeGroup.value = 0;
        porcentajeGroup.dispatchEvent(new Event('input'));
        porcentajeGroup.style.display = objetivo === 'mantenimiento' ? 'none' : 'block';
    } else {
        porcentajeGroup.style.display = 'block';
    }
}

// =====================
// Edición
// =====================
// Reemplaza la función global por la llamada a la clase ModalEditarCliente
window.abrirEditarCliente = function (idx) {
    ModalEditarCliente.abrir(idx, clientes);
};

// Guardar cambios en el formulario de edición
const formEditarCliente = document.getElementById('formEditarCliente');
if (formEditarCliente) {
    formEditarCliente.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar el formulario completo antes de enviar
        if (!ValidadorForm.validarFormularioEdicionCompleto()) {
            return;
        }

        const idx = parseInt(document.getElementById('editIndex').value, 10);
        const nombre = document.getElementById('editNombre').value;
        const altura = document.getElementById('editAltura').value;
        const peso = document.getElementById('editPeso').value;
        const edad = document.getElementById('editEdad').value;
        const grasa = document.getElementById('editGrasa').value;
        const actividadTxt = document.getElementById('editActividad').selectedOptions[0].text;
        const actividad = document.getElementById('editActividad').value;
        const objetivoTxt = document.getElementById('editObjetivo').selectedOptions[0].text;
        const objetivo = document.getElementById('editObjetivo').value;
        const porcentajeObjetivo = objetivo === 'mantenimiento' ? 0 : document.getElementById('editPorcentajeObjetivo').value;
        const calculos = Calculos.calcularCampos({ altura, peso, edad, grasa, actividad, objetivo, porcentajeObjetivo });
        clientes[idx] = {
            ...clientes[idx],
            nombre: window.formatearNombre(nombre),
            altura,
            peso,
            edad,
            grasa,
            actividad: actividadTxt,
            objetivo: objetivoTxt,
            porcentajeObjetivo,
            masaMagra: calculos.masaMagra,
            masaGrasa: calculos.masaGrasa,
            imc: calculos.imc,
            mb: calculos.mb,
            caloriasObjetivo: calculos.caloriasObjetivo
        };
        renderTabla();
        mostrarToast('Cliente editado correctamente', 'info');
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarClienteModal'));
        modal.hide();
    });
}

// =====================
// Mostrar toasts
// =====================
function mostrarToast(mensaje, tipo = 'success') {
    const toastEl = document.getElementById('toastConfirmacion');
    const toastMsg = document.getElementById('toastMensaje');
    toastMsg.textContent = mensaje;
    toastEl.className = `toast align-items-center text-bg-${tipo} border-0 shadow-lg rounded-4`;
    const toast = new bootstrap.Toast(toastEl, { delay: 1500 }); // 1,5 segundos
    toast.show();
}

// =====================
// Configurar eventos
// =====================
function configurarValidaciones() {
    // Campos que permiten decimales
    document.querySelectorAll('#altura, #peso, #grasa').forEach(input => {
        input.addEventListener('input', function() {
            // Permite números y un solo punto decimal
            this.value = this.value.replace(/[^0-9.]/g, '');
            // Evita múltiples puntos decimales
            if ((this.value.match(/\./g) || []).length > 1) {
                this.value = this.value.substring(0, this.value.lastIndexOf('.'));
            }
            ValidadorForm.validarCampo(this);
        });
    });

    // Campos que solo permiten enteros
    document.querySelectorAll('#edad, #porcentajeObjetivo').forEach(input => {
        input.addEventListener('input', function() {
            // Solo permite números enteros
            this.value = this.value.replace(/\D/g, '');
            ValidadorForm.validarCampo(this);
        });
    });

    // Validar al perder el foco
    document.querySelectorAll('#nombre, #altura, #peso, #edad, #grasa, #porcentajeObjetivo').forEach(input => {
        input.addEventListener('blur', function() {
            ValidadorForm.validarCampo(this);
        });
    });
}

// =====================
// Configurar eventos de validación para edición
// =====================
function configurarValidacionesEdicion() {
    // Campos que permiten decimales (edición)
    document.querySelectorAll('#editAltura, #editPeso, #editGrasa').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.]/g, '');
            if ((this.value.match(/\./g) || []).length > 1) {
                this.value = this.value.substring(0, this.value.lastIndexOf('.'));
            }
            ValidadorForm.validarCampoEdicion(this);
        });
    });

    // Campos que solo permiten enteros (edición)
    document.querySelectorAll('#editEdad, #editPorcentajeObjetivo').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            ValidadorForm.validarCampoEdicion(this);
        });
    });

    // Validar al perder el foco (edición)
    document.querySelectorAll('#editNombre, #editAltura, #editPeso, #editEdad, #editGrasa, #editPorcentajeObjetivo').forEach(input => {
        input.addEventListener('blur', function() {
            ValidadorForm.validarCampoEdicion(this);
        });
    });
}

// =====================
// Choices.js
// =====================
document.addEventListener('DOMContentLoaded', function () {
    // Choices para el alta
    new Choices('#alergias', { removeItemButton: true, searchEnabled: false });
    new Choices('#alimentos', { removeItemButton: true, searchEnabled: false });
});

window.addEventListener('beforeunload', function (e) {
    // Personaliza el mensaje si quieres, pero la mayoría de navegadores mostrarán su propio texto
    e.preventDefault();
});