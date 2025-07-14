// Clase para gestionar la calculadora de % graso YMCA

// =====================
// Inicialización de la calculadora de % graso YMCA
// =====================
document.getElementById('abrirCalculadoraGrasa').addEventListener('click', function () {
    // Rellena los campos si ya hay datos
    document.getElementById('alturaYMCA').value = document.getElementById('altura').value || '';
    document.getElementById('pesoYMCA').value = document.getElementById('peso').value || '';
    document.getElementById('cinturaYMCA').value = '';
    document.getElementById('cuelloYMCA').value = '';
    if(document.getElementById('caderaYMCA')) {
        document.getElementById('caderaYMCA').value = '';
        document.getElementById('caderaYMCA').removeAttribute('required');
    }
    document.getElementById('sexoYMCA').value = 'hombre';
    document.getElementById('resultadoYMCA').classList.add('d-none');
    document.getElementById('caderaYMCAContainer').classList.add('d-none');
    new bootstrap.Modal(document.getElementById('calculadoraGrasaModal')).show();
});

// Mostrar/ocultar campo cadera según sexo
const sexoYMCA = document.getElementById('sexoYMCA');
if (sexoYMCA) {
    sexoYMCA.addEventListener('change', function () {
        const caderaContainer = document.getElementById('caderaYMCAContainer');
        const caderaInput = document.getElementById('caderaYMCA');
        if (this.value === 'mujer') {
            caderaContainer.classList.remove('d-none');
            caderaInput.setAttribute('required', 'required');
        } else {
            caderaContainer.classList.add('d-none');
            caderaInput.removeAttribute('required');
        }
    });
}

// =====================
// Manejador del formulario de la calculadora de % graso YMCA
// =====================
document.getElementById('formCalculadoraGrasa').addEventListener('submit', function (e) {
    e.preventDefault();
    const sexo = document.getElementById('sexoYMCA').value;
    const altura = parseFloat(document.getElementById('alturaYMCA').value);
    const cintura = parseFloat(document.getElementById('cinturaYMCA').value);
    const cuello = parseFloat(document.getElementById('cuelloYMCA').value);
    let cadera = 0;
    if (sexo === 'mujer') {
        cadera = parseFloat(document.getElementById('caderaYMCA').value);
    }

    if (isNaN(altura) || isNaN(cintura) || isNaN(cuello) || (sexo === 'mujer' && isNaN(cadera))) return;

    // Fórmulas de % graso
    let grasa = 0;
    if (sexo === 'hombre') {
        grasa = 86.01 * Math.log10(cintura - cuello) - 70.041 * Math.log10(altura) + 36.76;
    } else {
        grasa = 163.205 * Math.log10(cintura + cadera - cuello) - 97.684 * Math.log10(altura) - 78.387;
    }
    grasa = Math.max(0, Math.round(grasa * 10) / 10);

    const resultado = document.getElementById('resultadoYMCA');
    resultado.textContent = `Tu % graso estimado es: ${grasa}%`;
    resultado.classList.remove('d-none');

    // Si quieres rellenar el campo principal automáticamente:
    document.getElementById('grasa').value = grasa;

    // Pasar de int a float
    const peso = parseFloat(document.getElementById('pesoYMCA').value);

});