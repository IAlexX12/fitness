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

    // ====== FIN BLOQUE DE PORCIONES ======
    // Función para filtrar alimentos por alergias
    function filtrarAlimentosPorAlergias(alimentos, alergias) {
        if (!Array.isArray(alergias)) return alimentos;
        const alergiasLower = alergias.map(a => a.trim().toLowerCase());
        return alimentos.filter(a => !alergiasLower.includes((a.categoria || '').trim().toLowerCase()));
    }

    // Tablas de alimentos clasificados (si existen en localStorage)
    const clasificadosCSV = localStorage.getItem('clasificadosCSV');
    if (clasificadosCSV) {
        const lines = clasificadosCSV.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const idxNombre = headers.indexOf('nombre');
        const idxCategoria = headers.indexOf('categoria');
        const idxGramaje = headers.indexOf('gramaje');
        const idxProt = headers.indexOf('esproteico');
        const idxCarb = headers.indexOf('escarbohidrato');
        const idxGrasa = headers.indexOf('esgrasa');
        let proteicos = [], carbohidratos = [], grasas = [];
        lines.slice(1).forEach(line => {
            const values = line.split(',');
            const nombre = values[idxNombre];
            const categoria = values[idxCategoria];
            const gramaje = values[idxGramaje];
            if (values[idxProt] === '1') proteicos.push({nombre, categoria, gramaje});
            if (values[idxCarb] === '1') carbohidratos.push({nombre, categoria, gramaje});
            if (values[idxGrasa] === '1') grasas.push({nombre, categoria, gramaje});
        });
        
        // Filtrar por alergias usando la función filtrarAlimentosPorAlergias
        proteicos = filtrarAlimentosPorAlergias(proteicos, cliente.alergias);
        carbohidratos = filtrarAlimentosPorAlergias(carbohidratos, cliente.alergias);
        grasas = filtrarAlimentosPorAlergias(grasas, cliente.alergias);
        let y = 200; // Aumentado para evitar solapamiento con el bloque de porciones

        // Función para dibujar tablas
        function drawTable(title, data, color) {
            if (data.length === 0) return;
            const colX = [15, 60, 110, 150];
            const colW = [45, 50, 40];
            const rowH = 8;
            doc.setFontSize(13);
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(title, 15, y);
            y += 6;
            // Encabezado estilo
            doc.setFillColor(230,230,230);
            doc.rect(colX[0], y, colW[0]+colW[1]+colW[2], rowH, 'F');
            doc.setFontSize(11);
            doc.setTextColor(60,60,60);
            // Encabezado columnas
            doc.text('Nombre', colX[0]+2, y+6);
            doc.text('Categoría', colX[1]+2, y+6);
            doc.text('Gramaje', colX[2]+2, y+6);
            // Encabezado lineas
            doc.setDrawColor(120,120,120);
            doc.rect(colX[0], y, colW[0], rowH);
            doc.rect(colX[1], y, colW[1], rowH);
            doc.rect(colX[2], y, colW[2], rowH);
            y += rowH;
            // Filas de datos
            data.forEach(a => {
                doc.setTextColor(30,30,30);
                doc.text(a.nombre, colX[0]+2, y+6);
                doc.text(a.categoria, colX[1]+2, y+6);
                doc.text(a.gramaje + 'g', colX[2]+2, y+6);
                // Bordes de fila
                doc.setDrawColor(180,180,180);
                doc.rect(colX[0], y, colW[0], rowH);
                doc.rect(colX[1], y, colW[1], rowH);
                doc.rect(colX[2], y, colW[2], rowH);
                y += rowH;
            });
            y += 12;
        }
        drawTable('Proteínas', proteicos, [44, 62, 200]);
        drawTable('Carbohidratos', carbohidratos, [34, 197, 94]);
        drawTable('Grasas', grasas, [245, 158, 11]);
    }

    doc.save(`informe_${cliente.nombre}.pdf`);
};


