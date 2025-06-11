// Variables globales
const clientes = [];


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

    const calculos = calcularCampos({altura, peso, edad, grasa, actividad, objetivo});
    const cliente = {
        nombre, altura, peso, edad, grasa,
        masaMagra: calculos.masaMagra,
        masaGrasa: calculos.masaGrasa,
        imc: calculos.imc,
        mb: calculos.mb,
        caloriasObjetivo: calculos.caloriasObjetivo,
        actividad: actividadTxt,
        objetivo: objetivoTxt
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
    if (clientes.length === 0) return alert('No hay datos para exportar');
    const encabezado = [
        'Nombre','Altura','Peso','Edad','% Graso','M. Magra','M. Grasa','IMC','MB','Calorías Objetivo','Actividad','Objetivo'
    ];
    const filas = clientes.map(c => [
        c.nombre, c.altura, c.peso, c.edad, c.grasa, c.masaMagra, c.masaGrasa, c.imc, c.mb, c.caloriasObjetivo, c.actividad, c.objetivo
    ]);
    const csv = [encabezado, ...filas].map(f => f.join(';')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'}); // comprobar si se puede crear en string aunque creo que blob es más rápido
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes_fitness.csv';
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
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return;
    const headers = lines[0].split(';');
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(';');
        if (row.length < 12) continue;
        const cliente = {
            nombre: row[0],
            altura: Number(row[1]),
            peso: Number(row[2]),
            edad: Number(row[3]),
            grasa: Number(row[4]),
            masaMagra: row[5],
            masaGrasa: row[6],
            imc: row[7],
            mb: row[8],
            caloriasObjetivo: row[9],
            actividad: row[10],
            objetivo: row[11]
        };
        clientes.push(cliente);
    }
    renderTabla();
}
