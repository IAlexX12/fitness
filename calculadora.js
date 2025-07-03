// Clase para gestionar la calculadora de % graso YMCA

// =====================
// Inicialización de la calculadora de % graso YMCA
// =====================
document.getElementById('abrirCalculadoraGrasa').addEventListener('click', function () {
    // Rellena los campos si ya hay datos
    document.getElementById('alturaYMCA').value = document.getElementById('altura').value || '';
    document.getElementById('pesoYMCA').value = document.getElementById('peso').value || '';
    document.getElementById('cinturaYMCA').value = '';
    document.getElementById('sexoYMCA').value = 'hombre';
    document.getElementById('resultadoYMCA').classList.add('d-none');
    new bootstrap.Modal(document.getElementById('calculadoraGrasaModal')).show();
});

// =====================
// Manejador del formulario de la calculadora de % graso YMCA
// =====================
document.getElementById('formCalculadoraGrasa').addEventListener('submit', function (e) {
    e.preventDefault();
    const sexo = document.getElementById('sexoYMCA').value;
    const altura = parseFloat(document.getElementById('alturaYMCA').value);
    const peso = parseFloat(document.getElementById('pesoYMCA').value);
    const cintura = parseFloat(document.getElementById('cinturaYMCA').value);

    if (isNaN(altura) || isNaN(peso) || isNaN(cintura)) return;

    // Fórmula YMCA para calcular el % graso
    let grasa = 0;
    if (sexo === 'hombre') {
        grasa = ( ( (cintura * 0.74) - (peso * 0.082 + 44.74) ) / peso ) * 100;
    } else {
        grasa = ( ( (cintura * 0.74) - (peso * 0.082 + 34.89) ) / peso ) * 100;
    }
    grasa = Math.max(0, Math.round(grasa * 10) / 10);

    const resultado = document.getElementById('resultadoYMCA');
    resultado.textContent = `Tu % graso estimado es: ${grasa}%`;
    resultado.classList.remove('d-none');

    // Si quieres rellenar el campo principal automáticamente:
    document.getElementById('grasa').value = grasa;
});