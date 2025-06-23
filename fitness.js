// Variables globales
const clientes = [];

// Importar csv desde localStorage a la tabla de clientes
const csv = localStorage.getItem('clientesCSV');
if (csv) {
    importarDesdeCSV(csv);
    localStorage.removeItem('clientesCSV');
    const pantallaPrincipal = document.getElementById('pantallaPrincipal');
    if (pantallaPrincipal) pantallaPrincipal.style.display = '';
    }

// función para calcular los campos necesarios
function calcularCampos({altura, peso, edad, grasa, actividad, objetivo}) {
    // Masa magra y masa grasa
    const masaGrasa = peso * (grasa / 100);
    const masaMagra = peso - masaGrasa;
    // IMC
    const imc = peso / Math.pow(altura / 100, 2);
    // Metabolismo basal (fuente internet)
    const mb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad); // Hay que poner mas decimales?
    // Calorías mantenimiento
    const caloriasMantenimiento = mb * actividad;
    // Calorías objetivo
    let caloriasObjetivo = caloriasMantenimiento;
    if (objetivo === 'deficit') caloriasObjetivo -= 400;
    if (objetivo === 'volumen') caloriasObjetivo += 300;
    // Recomposición: mantenimiento
    return {
        masaMagra: masaMagra.toFixed(1),
        masaGrasa: masaGrasa.toFixed(1),
        imc: imc.toFixed(1),
        mb: mb.toFixed(0),
        caloriasObjetivo: Math.round(caloriasObjetivo)
    };
}

// Event listener para el formulario
document.getElementById('fitnessForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const altura = Number(document.getElementById('altura').value);
    const peso = Number(document.getElementById('peso').value);
    const edad = Number(document.getElementById('edad').value);
    const grasa = Number(document.getElementById('grasa').value);
    const actividad = Number(document.getElementById('actividad').value);
    const objetivo = document.getElementById('objetivo').value;
    const actividadTxt = document.getElementById('actividad').selectedOptions[0].text;
    const objetivoTxt = document.getElementById('objetivo').selectedOptions[0].text;
    const alergiasSelect = document.getElementById('habilidades');
    const alergias = Array.from(alergiasSelect.selectedOptions).map(opt => opt.text);
    console.log('Alergias seleccionadas:', alergias);

    const calculos = calcularCampos({altura, peso, edad, grasa, actividad, objetivo});
    const cliente = {
        nombre, altura, peso, edad, grasa,
        masaMagra: calculos.masaMagra,
        masaGrasa: calculos.masaGrasa,
        imc: calculos.imc,
        mb: calculos.mb,
        caloriasObjetivo: calculos.caloriasObjetivo,
        actividad: actividadTxt,
        objetivo: objetivoTxt,
        alergias: alergias // esto debe ser un array, aunque esté vacío
    };
    clientes.push(cliente);
    renderTabla();
    this.reset();
});

// Renderizar la tabla de clientes
function renderTabla() {
    const tbody = document.querySelector('#clientesTable tbody');
    tbody.innerHTML = '';
    clientes.forEach((c, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.nombre}</td>
            <td>${c.altura}</td>
            <td>${c.peso}</td>
            <td>${c.edad}</td>
            <td>${c.grasa}</td>
            <td>${c.masaMagra}</td>
            <td>${c.masaGrasa}</td>
            <td>${c.imc}</td>
            <td>${c.mb}</td>
            <td>${c.caloriasObjetivo}</td>
            <td>${c.actividad}</td>
            <td>${c.objetivo}</td>
            <td>[${(c.alergias || []).map(a => `"${a}"`).join(', ')}]</td>
            <td><button class="btn btn-delete btn-sm" onclick="borrarCliente(${idx})">Borrar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

window.borrarCliente = function(idx) {
    if (confirm('Confirmar borrado del cliente?')) {
        clientes.splice(idx, 1);
        renderTabla();
    }
}


// Event listener para botón de exportar CSV
document.getElementById('exportarCSV').addEventListener('click', function() {
    let csv = 'Nombre,Altura,Peso,Edad,% Graso,M. Magra,M. Grasa,IMC,MB,Calorías Objetivo,Actividad,Objetivo,Alergias\n';
    clientes.forEach(cliente => {
        csv += [
            cliente.nombre,
            cliente.altura,
            cliente.peso,
            cliente.edad,
            cliente.grasa,
            cliente.mMagra,
            cliente.mGrasa,
            cliente.imc,
            cliente.mb,
            cliente.caloriasObjetivo,
            cliente.actividad,
            cliente.objetivo,
            (cliente.alergias || []).join(';')
        ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.csv';
    a.click();
    URL.revokeObjectURL(url);
});

// Event listener para el botón de importar CSV
document.getElementById('importarCSV').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

// Event listener para el input de archivo
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        const text = evt.target.result;
        importarDesdeCSV(text);
    };
    reader.readAsText(file);
});

// Importar CSV
function importarDesdeCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    clientes.length = 0; // Limpia el array actual

    lines.slice(1).forEach(line => {
        if (!line.trim()) return;
        const values = line.split(',');
        const cliente = {};
        headers.forEach((header, idx) => {
            if (header === 'Alergias') {
                // Convierte el string de alergias en array
                cliente.alergias = values[idx] ? values[idx].split(';').map(a => a.trim()).filter(a => a) : [];
            } else {
                cliente[header.trim().toLowerCase().replace(/ /g, '')] = values[idx];
            }
        });
        clientes.push(cliente);
    });
    renderTabla();
}

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa el select múltiple
  const selectHabilidades = new Choices('#habilidades', {
    removeItemButton: true,       // Permite eliminar items seleccionados
    searchEnabled: true,         // Habilita la búsqueda
    duplicateItemsAllowed: false, // Evita duplicados
    placeholder: true,            // Habilita texto placeholder
    placeholderValue: 'Busca o selecciona habilidades...',
    searchPlaceholderValue: 'Escribe para buscar...',
    shouldSort: false,            // Desactiva orden automático
    loadingText: 'Cargando...',
    noResultsText: 'No se encontraron resultados',
    noChoicesText: 'No hay más opciones para seleccionar',
    itemSelectText: 'Presiona para seleccionar',
    maxItemCount: 5,             // Límite de selecciones (opcional)
  });

  // Manejo del formulario
  const formulario = document.getElementById('miFormulario');

  formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores seleccionados
    const valores = selectHabilidades.getValue(true);
    console.log('Habilidades seleccionadas:', valores); // solo para probar

    alert('Habilidades enviadas: ${valores.map(item => item.value).join(',')}');
  });

  
});