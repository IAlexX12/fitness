// =====================
// Variables globales
// =====================
window.clientes = [];

// =====================
// Utilidades
// =====================
function pad(n) {
    return n.toString().padStart(2, '0');
}

function obtenerFechaHoraActual() {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`;
}

// =====================
// Cálculos
// =====================
function calcularCampos({ altura, peso, edad, grasa, actividad, objetivo }) {
    const masaGrasa = peso * (grasa / 100);
    const masaMagra = peso - masaGrasa;
    const imc = peso / Math.pow(altura / 100, 2);
    const mb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad);
    const caloriasMantenimiento = mb * actividad;
    let caloriasObjetivo = caloriasMantenimiento;
    if (objetivo === 'deficit') caloriasObjetivo -= 400;
    if (objetivo === 'volumen') caloriasObjetivo += 300;
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
function renderTabla() {
    const tbody = document.querySelector('#clientesTable tbody');
    tbody.innerHTML = '';
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
            <td>${(cliente.alergias || []).join(', ')}</td>
            <td>
                <button class="btn btn-informe btn-sm me-1" onclick="generarInforme(${idx})">Generar informe</button>
                <button class="btn btn-warning btn-sm me-1" onclick="abrirEditarCliente(${idx})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="borrarCliente(${idx})">Borrar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// =====================
// Importar CSV
// =====================
function importarDesdeCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
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
        'alergias': 'alergias'
    };
    clientes.length = 0;
    lines.slice(1).forEach(line => {
        if (!line.trim()) return;
        const values = line.split(',');
        const cliente = {};
        headers.forEach((header, idx) => {
            const key = map[header.trim().toLowerCase()];
            if (!key) return;
            if (key === 'alergias') {
                cliente.alergias = values[idx] ? values[idx].split(';').map(a => a.trim()).filter(a => a) : [];
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
    }
}

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
    // alergias

    // Limpiar estados de validación al abrir el modal
    document.querySelectorAll('#editNombre, #editAltura, #editPeso, #editEdad, #editGrasa').forEach(input => {
        input.classList.remove('is-invalid');
        const feedback = document.querySelector(`.${input.id}-feedback`);
        if (feedback) feedback.textContent = '';
    });

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
    
    const alergiasSelect = document.getElementById('alergias');
    const alergias = Array.from(alergiasSelect.selectedOptions).map(opt => opt.text);
    const alimentosSelect = document.getElementById('alimentos');
    const alimentos = Array.from(alimentosSelect.selectedOptions).map(opt => opt.text);

    const calculos = calcularCampos({ altura, peso, edad, grasa, actividad, objetivo });
    const cliente = {
        nombre: formatearNombre(nombre), altura, peso, edad, grasa,
        masaMagra: calculos.masaMagra,
        masaGrasa: calculos.masaGrasa,
        imc: calculos.imc,
        mb: calculos.mb,
        caloriasObjetivo: calculos.caloriasObjetivo,
        actividad: actividadTxt,
        objetivo: objetivoTxt,
        alergias: alergias,
        alimentos: alimentos
    };
    clientes.push(cliente);
    renderTabla();
    setTimeout(() => {
        this.reset();
        document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }, 0);
});

// Exportar a CSV
document.getElementById('exportarCSV').addEventListener('click', function () {
    let csv = 'Nombre,Altura,Peso,Edad,% Graso,M. Magra,M. Grasa,IMC,MB,Calorías Objetivo,Actividad,Objetivo,Alergias\n';
    clientes.forEach(cliente => {
        const altura = Number(cliente.altura);
        const peso = Number(cliente.peso);
        const edad = Number(cliente.edad);
        const grasa = Number(cliente.grasa);
        let actividad = cliente.actividad;
        if (isNaN(Number(actividad))) {
            actividad = 1.2;
        } else {
            actividad = Number(actividad);
        }
        let objetivo = cliente.objetivo;
        if (!['deficit', 'volumen', 'recomposicion'].includes(objetivo)) {
            objetivo = 'deficit';
        }
        const calculos = calcularCampos({ altura, peso, edad, grasa, actividad, objetivo });
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
            (cliente.alergias || "").join(';')
        ].join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fecha = obtenerFechaHoraActual();
    a.download = `clientes+${fecha}.csv`;
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

// =====================
// Guardar cambios del modal de edición - Función modificada
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
        // alergias
        const calculos = calcularCampos({ altura, peso, edad, grasa, actividad, objetivo });
        clientes[idx] = {
            nombre: formatearNombre(nombre), altura, peso, edad, grasa, actividad, objetivo,
            masaMagra: calculos.masaMagra,
            masaGrasa: calculos.masaGrasa,
            imc: calculos.imc,
            mb: calculos.mb,
            caloriasObjetivo: calculos.caloriasObjetivo,
            alergias: clientes[idx].alergias, // mantiene las alergias originales
            alimentos: clientes[idx].alimentos || [] // mantiene los alimentos originales
        };
        renderTabla();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarClienteModal'));
        modal.hide();
    });
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
  grasa: { min: 1, max: 60, mensaje: 'Debe ser entre 1% y 60%' }
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
  const campos = ['nombre', 'altura', 'peso', 'edad', 'grasa'];

  campos.forEach(id => {
    const input = document.getElementById(id);
    if (!validarCampo(input)) {
      valido = false;
    }
  });

  return valido;
}

// Función para validar todo el formulario de edición
function validarFormularioEdicionCompleto() {
    let valido = true;
    const campos = ['editNombre', 'editAltura', 'editPeso', 'editEdad', 'editGrasa'];

    campos.forEach(id => {
        const input = document.getElementById(id);
        if (!validarCampoEdicion(input)) {
            valido = false;
        }
    });

    return valido;
}

// =====================
// Configurar eventos
// =====================
function configurarValidaciones() {
  // Validación en tiempo real
  document.querySelectorAll('#nombre, #altura, #peso, #edad, #grasa').forEach(input => {
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
    document.querySelectorAll('#editNombre, #editAltura, #editPeso, #editEdad, #editGrasa').forEach(input => {
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
