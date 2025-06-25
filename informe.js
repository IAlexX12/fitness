// informe.js
// Función para generar un informe PDF de un cliente usando jsPDF

// Asegúrate de que dibujarTabals.js esté incluido antes de este archivo en index.html

window.generarInforme = function(idx) {
    if (!window.clientes || !window.clientes[idx]) {
        alert('No se encontró el cliente.');
        return;
    }
    const cliente = window.clientes[idx];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // =====================
    // Plantilla personalizada
    // =====================

    // ====== BLOQUE DE DATOS DEL CLIENTE ======
    doc.text("Informe Personalizado de Cliente", 15, 20);
    doc.setFontSize(12);
    doc.text(`Nombre: ${cliente.nombre}`, 15, 35);
    doc.text(`Altura: ${cliente.altura} cm`, 15, 45);
    doc.text(`Peso: ${cliente.peso} kg`, 15, 55);
    doc.text(`Edad: ${cliente.edad}`, 15, 65);
    doc.text(`% Graso: ${cliente.grasa}`, 15, 75);
    doc.text(`Masa Magra: ${cliente.masaMagra} kg`, 15, 85);
    doc.text(`Masa Grasa: ${cliente.masaGrasa} kg`, 15, 95);
    doc.text(`IMC: ${cliente.imc}`, 15, 105);
    doc.text(`MB: ${cliente.mb}`, 15, 115);
    doc.text(`Calorías Objetivo: ${cliente.caloriasObjetivo}`, 15, 125);
    doc.text(`Actividad: ${cliente.actividad}`, 15, 135);
    doc.text(`Objetivo: ${cliente.objetivo}`, 15, 145);
    doc.text(`Alergias: ${(cliente.alergias || "").join(', ')}`, 15, 155);

    // ====== BLOQUE DE PORCIONES ======
    const calcPorciones = new PorcionesCalculator(cliente);
    const resumen = calcPorciones.getResumen();
    let yPorciones = 165;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 200);
    doc.text('Plan de Porciones (1 porción = 100 kcal):', 15, yPorciones);
    doc.setTextColor(30,30,30);
    yPorciones += 7;
    doc.text(`Total de porciones: ${resumen.total}`, 15, yPorciones);
    yPorciones += 6;
    doc.text(`Porciones de proteína: ${resumen.proteina}`, 15, yPorciones);
    yPorciones += 6;
    doc.text(`Porciones de carbohidrato: ${resumen.carbohidrato}`, 15, yPorciones);
    yPorciones += 6;
    doc.text(`Porciones de grasa: ${resumen.grasa}`, 15, yPorciones);

    // ====== BLOQUE DE TABLAS DE ALIMENTOS ======
    // Se usa la clase dibujarTablas.js para dibujar las tablas
    const drawer = new AlimentosTableDrawer(cliente, doc);
    drawer.dibujarTablas();

    doc.save(`informe_${cliente.nombre}.pdf`);
};


