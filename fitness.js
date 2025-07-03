// =====================
// Variables globales
// =====================
window.clientes = [];
let ordenColumna = null;
let ordenAscendente = true;

// =====================
// Utilidades
// =====================
function pad(n) {
    return n.toString().padStart(2, '0');
}

function obtenerFechaHoraActual() {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}:${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`;
}

// =====================
// Cálculos
// =====================
function calcularCampos({ altura, peso, edad, grasa, actividad, objetivo, porcentajeObjetivo }) {
    const masaGrasa = peso * (grasa / 100);
    const masaMagra = peso - masaGrasa;
    const imc = peso / Math.pow(altura / 100, 2);
    const mb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad);
    const caloriasMantenimiento = mb * actividad;
    let caloriasObjetivo = caloriasMantenimiento;
    const factor = porcentajeObjetivo / 100;

    switch(objetivo){
        case 'deficit':
            caloriasObjetivo -= caloriasMantenimiento * factor;
            break;
        case 'volumen':
            caloriasObjetivo += caloriasMantenimiento * factor;
            break;
        case 'mantenimiento':
            caloriasObjetivo = caloriasMantenimiento;
            break;
        case 'recomposicion':
            caloriasObjetivo -= caloriasMantenimiento * (factor / 2);
            break;
        default:
            caloriasObjetivo = caloriasMantenimiento;
    }

    return {
        masaMagra: masaMagra.toFixed(1),
        masaGrasa: masaGrasa.toFixed(1),
        imc: imc.toFixed(1),
        mb: mb.toFixed(0),
        caloriasObjetivo: Math.round(caloriasObjetivo)
    };
}

// =====================
// Renderizado
// =====================

// Primer render
document.addEventListener('DOMContentLoaded', function () {
    renderTabla();
    configurarOrdenTabla();
    actualizarIconosOrden();
});

function renderTabla() {
    const tbody = document.querySelector('#clientesTable tbody');
    tbody.innerHTML = '';
    // Actualiza el contador clientes
    const contador = document.getElementById('contadorClientesBadge');
    if (contador) contador.textContent = clientes.length;
    // Mostrar mensaje de no hay clientes
    if (clientes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="16" class="text-center">
                <div class="alert alert-info m-0 py-2" style="font-size:1.1rem;">
                    <i class="bi bi-info-circle-fill me-2"></i>
                    <strong>No hay clientes registrados</strong>
                </div>
            </td>
        `;
        tbody.appendChild(row);
        return;
    }
    clientes.forEach((cliente, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.altura}</td>
            <td>${cliente.peso}</td>
            <td>${cliente.edad}</td>
            <td>${cliente.grasa}</td>
            <td>${cliente.masaMagra}</td>
            <td>${cliente.masaGrasa}</td>
            <td>${cliente.imc}</td>
            <td>${cliente.mb}</td>
            <td>${cliente.caloriasObjetivo}</td>
            <td>${cliente.actividad}</td>
            <td>${cliente.objetivo}</td>
            <td>${cliente.porcentajeObjetivo}</td>
            <td>${(cliente.alergias || []).join(', ')}</td>
            <td>${(cliente.alimentos || []).join(', ')}</td> <!-- Añade esta línea -->
            <td>${cliente.fechaAlta || '-'}</td>
            <td>
            <button class="btn btn-outline-info btn-sm me-1" title="Informe" onclick="generarInforme(${idx})">
                <i class="bi bi-file-earmark-text"></i>
                <span class="d-none d-md-inline">Informe</span>
            </button>
            <button class="btn btn-outline-warning btn-sm me-1" title="Editar" onclick="abrirEditarCliente(${idx})">
                <i class="bi bi-pencil"></i>
                <span class="d-none d-md-inline">Editar</span>
            </button>
            <button class="btn btn-outline-danger btn-sm" title="Borrar" onclick="borrarCliente(${idx})">
                <i class="bi bi-trash"></i>
                <span class="d-none d-md-inline">Borrar</span>
            </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Orden de la tabla (ASC/DESC)
function configurarOrdenTabla() {
    document.querySelectorAll('#clientesTable th[data-sort]').forEach(th => {
        th.style.cursor = 'pointer';
        th.addEventListener('click', function() {
            const columna = th.getAttribute('data-sort');
            if (ordenColumna === columna) {
                ordenAscendente = !ordenAscendente;
            } else {
                ordenColumna = columna;
                ordenAscendente = true;
            }
            ordenarClientes(columna, ordenAscendente);
            renderTabla();
            actualizarIconosOrden();
        });
    });
}

// Ordena clientes
function ordenarClientes(columna, asc) {
    clientes.sort((a, b) => {
        let valA = a[columna];
        let valB = b[columna];
        if (columna === 'fechaAlta') {
            valA = new Date(valA);
            valB = new Date(valB);
        }
        if (!isNaN(valA) && !isNaN(valB) && valA !== '' && valB !== '') {
            valA = Number(valA);
            valB = Number(valB);
        }
        if (valA < valB) return asc ? -1 : 1;
        if (valA > valB) return asc ? 1 : -1;
        return 0;
    });
}

// Actualizar iconos de ordenado
function actualizarIconosOrden() {
    document.querySelectorAll('#clientesTable th[data-sort]').forEach(th => {
        const icon = th.querySelector('.sort-icon');
        const columna = th.getAttribute('data-sort');
        th.classList.remove('table-active');
        if (columna === ordenColumna) {
            th.classList.add('table-active');
            if (ordenAscendente) {
                icon.className = 'bi bi-arrow-up ms-1 sort-icon';
            } else {
                icon.className = 'bi bi-arrow-down ms-1 sort-icon';
            }
        } else {
            icon.className = 'bi bi-arrow-down-up ms-1 sort-icon';
        }
    });
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
        'alimentos': 'alimentos', // <-- Añade esta línea
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
document.getElementById('borrarTodos').addEventListener('click', function() {
    if (confirm('¿Seguro que quieres borrar todos los clientes?')) {
        clientes.length = 0;
        localStorage.removeItem('clientes');
        renderTabla();
    }
});

// =====================
// Editar cliente (modal)
// =====================
window.abrirEditarCliente = function (idx) {
    const cliente = clientes[idx];
    document.getElementById('editIndex').value = idx;
    document.getElementById('editNombre').value = cliente.nombre;
    document.getElementById('editAltura').value = cliente.altura;
    document.getElementById('editPeso').value = cliente.peso;
    document.getElementById('editEdad').value = cliente.edad;
    document.getElementById('editGrasa').value = cliente.grasa;
    document.getElementById('editActividad').value = cliente.actividad;
    document.getElementById('editObjetivo').value = cliente.objetivo;
    document.getElementById('editPorcentajeObjetivo').value = cliente.porcentajeObjetivo;

    // Seleccionar alergias
    const editAlergias = document.getElementById('editAlergias');
    Array.from(editAlergias.options).forEach(opt => {
        opt.selected = (cliente.alergias || []).includes(opt.text);
    });

    // Seleccionar alimentos
    const editAlimentos = document.getElementById('editAlimentos');
    Array.from(editAlimentos.options).forEach(opt => {
        opt.selected = (cliente.alimentos || []).includes(opt.text);
    });

    // Si usas Choices.js, actualiza:
    if (editAlergias.choices) editAlergias.choices.setChoiceByValue(cliente.alergias || []);
    if (editAlimentos.choices) editAlimentos.choices.setChoiceByValue(cliente.alimentos || []);

    // Limpiar estados de validación al abrir el modal
    document.querySelectorAll('#editNombre, #editAltura, #editPeso, #editEdad, #editGrasa, #editPorcentajeObjetivo').forEach(input => {
        input.classList.remove('is-invalid');
        const feedback = document.querySelector(`.${input.id}-feedback`);
        if (feedback) feedback.textContent = '';
    });

    toggleEditPorcentajeObjetivo();

    const modal = new bootstrap.Modal(document.getElementById('editarClienteModal'));
    modal.show();
}

// =====================
// Event listeners
// =====================
// Formulario de alta de cliente
document.getElementById('fitnessForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Limpiar errores previos
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.getElementById('infoMessage').style.display = 'none';

    // Validar antes de procesar
    if (!validarFormularioCompleto()) {
        document.getElementById('infoMessage').textContent = 'Por favor corrige los errores marcados';
        document.getElementById('infoMessage').style.display = 'block';
        document.getElementById('infoMessage').classList.add('alert-danger');
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const altura = Number(document.getElementById('altura').value);
    const peso = Number(document.getElementById('peso').value);
    const edad = Number(document.getElementById('edad').value);
    const grasa = Number(document.getElementById('grasa').value);

    const actividadTxt = document.getElementById('actividad').selectedOptions[0].text;
    const actividad = Number(document.getElementById('actividad').value);
    const objetivoTxt = document.getElementById('objetivo').selectedOptions[0].text;
    const objetivo = document.getElementById('objetivo').value;
    const porcentajeObjetivo = Number(document.getElementById('porcentajeObjetivo').value) || 0;

    const alergiasSelect = document.getElementById('alergias');
    const alergias = Array.from(alergiasSelect.selectedOptions).map(opt => opt.text);

    // Así recoges los alimentos seleccionados del select múltiple
    const alimentosSelect = document.getElementById('alimentos');
    const alimentos = Array.from(alimentosSelect.selectedOptions).map(opt => opt.text);

    const calculos = calcularCampos({ altura, peso, edad, grasa, actividad, objetivo, porcentajeObjetivo });
    const fechaActual = new Date().toLocaleDateString('es-ES');
    const cliente = {
        nombre: formatearNombre(nombre), altura, peso, edad, grasa,
        masaMagra: calculos.masaMagra,
        masaGrasa: calculos.masaGrasa,
        imc: calculos.imc,
        mb: calculos.mb,
        caloriasObjetivo: calculos.caloriasObjetivo,
        actividad: actividadTxt,
        objetivo: objetivoTxt,
        porcentajeObjetivo: porcentajeObjetivo,
        alergias: alergias,
        alimentos: alimentos, // <-- aquí se guarda el array de alimentos seleccionados
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

// Exportar a CSV
document.getElementById('exportarCSV').addEventListener('click', function () {
    let csv = 'Nombre,Altura,Peso,Edad,% Graso,M. Magra,M. Grasa,IMC,MB,Calorías Objetivo,Actividad,Objetivo,% Objetivo,Alergias,Fecha alta\n';
    clientes.forEach(cliente => {
        const altura = Number(cliente.altura);
        const peso = Number(cliente.peso);
        const edad = Number(cliente.edad);
        const grasa = Number(cliente.grasa);
        let actividad = cliente.actividad;
        const porcentajeObjetivo = Number(cliente.porcentajeObjetivo);
        if (isNaN(Number(actividad))) {
            actividad = 1.2;
        } else {
            actividad = Number(actividad);
        }
        let objetivo = cliente.objetivo;
        if (!['deficit', 'volumen', 'recomposicion','mantenimiento'].includes(objetivo)) {
            objetivo = 'deficit';
        }
        const calculos = calcularCampos({ altura, peso, edad, grasa, actividad, objetivo, porcentajeObjetivo });
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
            cliente.fechaAlta || '-'
        ].join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fecha = obtenerFechaHoraActual();
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
// Inicialización
// =====================
document.addEventListener('DOMContentLoaded', function () {
    configurarValidaciones();
    configurarValidacionesEdicion();

    togglePorcentajeObjetivo(); 
    toggleEditPorcentajeObjetivo(); 
    
    document.getElementById('objetivo').addEventListener('change', togglePorcentajeObjetivo);
    document.getElementById('editObjetivo').addEventListener('change', toggleEditPorcentajeObjetivo);


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
    porcentajeGroup.style.display = 'none';
} else {
    porcentajeGroup.style.display = 'block';
}
}

function toggleEditPorcentajeObjetivo() {
    const objetivo = document.getElementById('editObjetivo').value;
    const porcentajeGroup = document.getElementById('editPorcentajeObjetivo').parentElement;
    
    if (objetivo === 'mantenimiento') {
        porcentajeGroup.style.display = 'none';
    } else {
        porcentajeGroup.style.display = 'block';
    }
}

// =====================
// Guardar cambios del modal de edición
// =====================
const formEditarCliente = document.getElementById('formEditarCliente');
if (formEditarCliente) {
    formEditarCliente.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar el formulario completo antes de enviar
        if (!validarFormularioEdicionCompleto()) {
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

        // Recoger alergias y alimentos seleccionados del modal
        const editAlergias = document.getElementById('editAlergias');
        const alergias = Array.from(editAlergias.selectedOptions).map(opt => opt.text);

        const editAlimentos = document.getElementById('editAlimentos');
        const alimentos = Array.from(editAlimentos.selectedOptions).map(opt => opt.text);

        // alergias
        const calculos = calcularCampos({ altura, peso, edad, grasa, actividad, objetivo });
        clientes[idx] = {
            ...clientes[idx], // mantiene fechaAlta y otros campos
            nombre: formatearNombre(nombre), altura, peso, edad, grasa, actividad, objetivo,
            masaMagra: calculos.masaMagra,
            masaGrasa: calculos.masaGrasa,
            imc: calculos.imc,
            mb: calculos.mb,
            caloriasObjetivo: calculos.caloriasObjetivo,
            alergias: alergias,      // <-- añade esto
            alimentos: alimentos     // <-- y esto
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
// Configuración de validación
// =====================
const configValidacion = {
  nombre: {
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 
    mensaje: 'Solo se permiten letras y espacios (sin números ni símbolos)'
  },
  altura: { min: 100, max: 250, mensaje: 'Debe ser entre 100 y 250 cm' },
  peso: { min: 30, max: 300, mensaje: 'Debe ser entre 30 y 300 kg' },
  edad: { min: 15, max: 120, mensaje: 'Debe ser entre 15 y 120 años' },
  grasa: { min: 1, max: 60, mensaje: 'Debe ser entre 1% y 60%' },
  porcentajeObjetivo: { min: 0, max: 30, mensaje : 'El porcentaje debe estar entre 0% y 30%'}
};

// =====================
// Funciones de validación
// =====================
function validarCampo(input) {
  const id = input.id;
  const valor = input.value.trim();
  const feedback = document.querySelector(`.${id}-feedback`);
  
  feedback.textContent = '';
  input.classList.remove('is-invalid');

  // Validar campo vacío
  if (valor === '') {
    feedback.textContent = 'Este campo es obligatorio';
    input.classList.add('is-invalid');
    return false;
  }

  // Validación especial para nombre
  if (id === 'nombre') {
    if (!configValidacion.nombre.regex.test(valor)) {
      feedback.textContent = configValidacion.nombre.mensaje;
      input.classList.add('is-invalid');
      return false;
    }
    return true;
  }

  // Validación para porcentaje objetivo
  if (id === 'porcentajeObjetivo' || id === 'editPorcentajeObjetivo') {
    const numero = parseInt(valor);
    const config = configValidacion.porcentajeObjetivo;
    
    if (isNaN(numero) || numero < config.min || numero > config.max) {
      feedback.textContent = config.mensaje;
      input.classList.add('is-invalid');
      return false;
    }
    return true;
  }

  const numero = parseInt(valor);
  const config = configValidacion[id];

  if (numero < config.min || numero > config.max) {
    feedback.textContent = config.mensaje;
    input.classList.add('is-invalid');
    return false;
  }

  return true;
}

// =====================
// Validaciones para el formulario de edición
// =====================
function validarCampoEdicion(input) {
    const idOriginal = input.id.replace('edit', '').toLowerCase();
    const valor = input.value.trim();
    const feedback = document.querySelector(`.${input.id}-feedback`);
    
    if (!feedback) return true; // Si no hay elemento de feedback, continuar
    
    feedback.textContent = '';
    input.classList.remove('is-invalid');

    // Validar campo vacío
    if (valor === '') {
        feedback.textContent = 'Este campo es obligatorio';
        input.classList.add('is-invalid');
        return false;
    }

    // Validación especial para nombre
    if (idOriginal === 'nombre') {
        if (!configValidacion.nombre.regex.test(valor)) {
            feedback.textContent = configValidacion.nombre.mensaje;
            input.classList.add('is-invalid');
            return false;
        }
        return true;
    }

    const numero = parseInt(valor);
    const config = configValidacion[idOriginal];

    if (isNaN(numero) || numero < config.min || numero > config.max) {
        feedback.textContent = config.mensaje;
        input.classList.add('is-invalid');
        return false;
    }

    return true;
}


function validarFormularioCompleto() {
  let valido = true;
  const campos = ['nombre', 'altura', 'peso', 'edad', 'grasa', 'porcentajeObjetivo'];

  campos.forEach(id => {
    const input = document.getElementById(id);
    if (!validarCampo(input)) {
      valido = false;
    }
  });

  // Validar alergias
  const alergias = document.getElementById('alergias');
  if (!alergias.selectedOptions.length) {
    alergias.classList.add('is-invalid');
    valido = false;
  } else {
    alergias.classList.remove('is-invalid');
  }

  // Validar alimentos
  const alimentos = document.getElementById('alimentos');
  if (!alimentos.selectedOptions.length) {
    alimentos.classList.add('is-invalid');
    valido = false;
  } else {
    alimentos.classList.remove('is-invalid');
  }

  return valido;
}

function validarFormularioEdicionCompleto() {
  let valido = true;
  const campos = ['editNombre', 'editAltura', 'editPeso', 'editEdad', 'editGrasa', 'editPorcentajeObjetivo'];

  campos.forEach(id => {
    const input = document.getElementById(id);
    if (!validarCampoEdicion(input)) {
      valido = false;
    }
  });

  // Validar alergias edición
  const editAlergias = document.getElementById('editAlergias');
  if (!editAlergias.selectedOptions.length) {
    editAlergias.classList.add('is-invalid');
    valido = false;
  } else {
    editAlergias.classList.remove('is-invalid');
  }

  // Validar alimentos edición
  const editAlimentos = document.getElementById('editAlimentos');
  if (!editAlimentos.selectedOptions.length) {
    editAlimentos.classList.add('is-invalid');
    valido = false;
  } else {
    editAlimentos.classList.remove('is-invalid');
  }

  return valido;
}

// =====================
// Configurar eventos
// =====================
function configurarValidaciones() {
  // Validación en tiempo real
  document.querySelectorAll('#nombre, #altura, #peso, #edad, #grasa, #porcentajeObjetivo').forEach(input => {
    input.addEventListener('input', function() {
      if (this.id !== 'nombre') {
        this.value = this.value.replace(/\D/g, ''); // Solo números
      }
      validarCampo(this);
    });

    input.addEventListener('blur', function() {
      validarCampo(this);
    });
  });
}

// =====================
// Configurar eventos de validación para edición
// =====================
function configurarValidacionesEdicion() {
    document.querySelectorAll('#editNombre, #editAltura, #editPeso, #editEdad, #editGrasa, #editPorcentajeObjetivo').forEach(input => {
        input.addEventListener('input', function() {
            if (this.id !== 'editNombre') {
                this.value = this.value.replace(/\D/g, ''); // Solo números
            }
            validarCampoEdicion(this);
        });

        input.addEventListener('blur', function() {
            validarCampoEdicion(this);
        });
    });
}


// Función para formatear nombre 
function formatearNombre(nombre) {
    return nombre
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter(palabra => palabra.length > 0)
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}

// =====================
// Choices.js
// =====================
document.addEventListener('DOMContentLoaded', function () {
    // Choices para el alta
    new Choices('#alergias', { removeItemButton: true, searchEnabled: false });
    new Choices('#alimentos', { removeItemButton: true, searchEnabled: false });

    // Choices para el modal de edición
    new Choices('#editAlergias', { removeItemButton: true, searchEnabled: false });
    new Choices('#editAlimentos', { removeItemButton: true, searchEnabled: false });
});

window.addEventListener('beforeunload', function (e) {
  // Personaliza el mensaje si quieres, pero la mayoría de navegadores mostrarán su propio texto
  e.preventDefault();
  e.returnValue = '¿Estás seguro de que quieres recargar? Se perderán los cambios no guardados.';
});


