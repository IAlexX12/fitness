// informe.js
// Función para generar un informe PDF de un cliente usando jsPDF

window.generarInforme = function(idx) {
    if (!window.clientes || !window.clientes[idx]) {
        alert('No se encontró el cliente.');
        return;
    }
    const cliente = window.clientes[idx];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Plantilla personalizada
    doc.setFontSize(18);
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
    doc.text(`Alergias: ${(cliente.alergias || []).join(', ')}`, 15, 155);

    doc.save(`informe_${cliente.nombre}.pdf`);
};
