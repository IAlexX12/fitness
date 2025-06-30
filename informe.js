window.generarInforme = function(idx) {
    if (!window.clientes || !window.clientes[idx]) {
        alert('No se encontró el cliente.');
        return;
    }

    const cliente = window.clientes[idx];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // ---------- TÍTULO PRINCIPAL ----------
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 100);
    doc.text("Informe Personalizado de Cliente", 15, 20);

    doc.setLineWidth(0.5);
    doc.setDrawColor(180);
    doc.line(15, 23, 195, 23);

    // ---------- DATOS PERSONALES CENTRADOS ----------
    let y = 30;
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    const tituloDatos = "Datos personales";
    const pageWidth = doc.internal.pageSize.getWidth();
    let textWidth = doc.getTextWidth(tituloDatos);
    doc.text(tituloDatos, (pageWidth - textWidth) / 2, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(0);
    const datos = [
        [`Nombre:`, cliente.nombre],
        [`Edad:`, `${cliente.edad} años`],
        [`Altura:`, `${cliente.altura} cm`],
        [`Peso:`, `${cliente.peso} kg`],
        [`IMC:`, cliente.imc],
        [`Masa Grasa:`, `${cliente.masaGrasa} kg`],
        [`Masa Magra:`, `${cliente.masaMagra} kg`],
        [`% Graso:`, cliente.grasa],
        [`MB:`, cliente.mb],
        [`Calorías Objetivo:`, `${cliente.caloriasObjetivo} kcal`],
        [`Actividad:`, cliente.actividad],
        [`Objetivo:`, cliente.objetivo],
        [`Alergias:`, (cliente.alergias || []).join(', ') || 'Ninguna']
    ];
    datos.forEach(([label, value]) => {
        const texto = `${label} ${value}`;
        textWidth = doc.getTextWidth(texto);
        doc.text(texto, (pageWidth - textWidth) / 2, y);
        y += 7;
    });
    y += 5;

    // ---------- QUÉ ES UNA PORCIÓN ----------
    doc.setFontSize(15);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Qué es una porción?", 15, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Una porción es una unidad de medida que se utiliza para organizar y equilibrar tu alimentación.", 15, y);
    y += 6;
    doc.text("En este sistema, una porción equivale a 100 kilocalorías (kcal). Así, puedes saber cuánto estás", 15, y);
    y += 6;
    doc.text("comiendo sin necesidad de contar calorías constantemente.", 15, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("Por ejemplo:", 15, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("100 gramos de pollo = 1 porción de proteína", 20, y);
    y += 6;
    doc.text("30 gramos de arroz crudo = 1 porción de carbohidratos", 20, y);
    y += 6;
    doc.text("10 gramos de aceite de oliva = 1 porción de grasa", 20, y);
    y += 10;

    // ---------- ¿PARA QUÉ SIRVEN LAS PORCIONES? ----------
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Para qué sirven las porciones?", 15, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Usar porciones es una forma práctica y visual de:", 15, y);
    y += 6;
    doc.text("• Controlar la cantidad de comida que consumes", 20, y);
    y += 6;
    doc.text("• Equilibrar los nutrientes que tu cuerpo necesita", 20, y);
    y += 6;
    doc.text("• Adaptar tu alimentación a tus objetivos (bajar de peso, ganar masa muscular, mantenerte saludable)", 20, y);
    if (y > 180) { // Si no hay espacio suficiente
    doc.addPage();
    y = 20;
    }
    // ---------- ¿CÓMO SE DIVIDEN LOS ALIMENTOS EN PORCIONES? ----------
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Cómo se dividen los alimentos en porciones?", 15, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Los alimentos se agrupan según el macronutriente principal que aportan:", 15, y);
    y += 7;

    // Tabla de grupos de alimentos
    doc.autoTable({
        startY: y,
        head: [['Grupo de alimentos', 'Qué aportan principalmente', 'Ejemplo de porción']],
        body: [
            ['Proteínas', 'Reparación y construcción de músculos', '100g de pollo o 200g de claras de huevo'],
            ['Carbohidratos', 'Energía rápida y sostenida', '30g de avena o 100g de patata'],
            ['Grasas', 'Energía, salud hormonal, absorción de vitaminas', '10g de aceite de oliva o 15g de nueces']
        ],
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [40, 60, 100],
            textColor: 255
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 15, right: 15 }
    });
    y = doc.lastAutoTable.finalY + 5;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Cada porción aporta unas 100 kcal.", 15, y);
    y += 10;

    // ---------- ¿CÓMO SE USAN? (EJEMPLO PRÁCTICO) ----------
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Cómo se usan? (Ejemplo práctico)", 15, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Supongamos que tu plan diario es consumir:", 15, y);
    y += 6;
    doc.text("4 porciones de proteína", 20, y);
    y += 6;
    doc.text("3 porciones de carbohidratos", 20, y);
    y += 6;
    doc.text("2 porciones de grasas", 20, y);
    y += 8;

    doc.text("Esto podría verse así en un plato:", 15, y);
    y += 6;

    // Dividir el texto largo en varias líneas para evitar cortes
    const ejemploProte = [
        "Proteína: 100g de pollo (1 porción) + 1 huevo XL (1 porción)",
        "+ 200g de claras (1 porción) + 100g de yogur proteico (1 porción)"
    ];
    ejemploProte.forEach(linea => {
        doc.text(linea, 20, y);
        y += 6;
    });

    const ejemploCarbo = [
        "Carbohidrato: 30g de arroz (1 porción) + 100g de patata (1 porción)",
        "+ 25g de avena (1 porción)"
    ];
    ejemploCarbo.forEach(linea => {
        doc.text(linea, 20, y);
        y += 6;
    });

    const ejemploGrasa = [
        "Grasa: 10g de aceite de oliva (1 porción) + 15g de almendras (1 porción)"
    ];
    ejemploGrasa.forEach(linea => {
        doc.text(linea, 20, y);
        y += 6;
    });

    y += 4;
    doc.setFont("helvetica", "italic");
    doc.text("Así, comes lo que necesitas sin estar pesando todo el día ni contando calorías una por una.", 15, y);
    doc.setFont("helvetica", "normal");
    y += 12;

    // ---------- RESUMEN NUTRICIONAL EN LA MISMA PÁGINA ----------
    if (y > 180) { // Si no hay espacio suficiente
    doc.addPage();
    y = 20;
    }
    doc.setFontSize(16);
    doc.setTextColor(40, 60, 100);
    doc.text("Resumen Nutricional Diario", 15, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Calorías Objetivo: ${cliente.caloriasObjetivo} kcal`, 15, y);

    y += 10;

    // ---------- INFORMACIÓN DE PORCIONES TOTALES Y VALOR DE PORCIÓN ----------
    const valorPorcion = 100; // kcal por porción
    const totalPorciones = Math.ceil(cliente.caloriasObjetivo / valorPorcion);

    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("Información de porciones diarias", 15, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`• Calorías objetivo: ${cliente.caloriasObjetivo} kcal`, 15, y);
    y += 6;
    doc.text(`• 1 porción equivale a ${valorPorcion} kcal`, 15, y);
    y += 6;
    doc.text(`• Porciones totales recomendadas al día: ${totalPorciones}`, 15, y);
    y += 10;
    

    // ---------- MACROS SEGÚN OBJETIVO ----------
    let macros;
    switch ((cliente.objetivo || '').toLowerCase()) {
        case 'deficit':
        case 'déficit':
            macros = [
                { nombre: 'Proteína', porcentaje: 41 },
                { nombre: 'Carbohidrato', porcentaje: 35 },
                { nombre: 'Grasa', porcentaje: 24 }
            ];
            break;
        case 'volumen':
            macros = [
                { nombre: 'Proteína', porcentaje: 29 },
                { nombre: 'Carbohidrato', porcentaje: 53 },
                { nombre: 'Grasa', porcentaje: 18 }
            ];
            break;
        case 'recomposicion':
        case 'recomposición':
            macros = [
                { nombre: 'Proteína', porcentaje: 35 },
                { nombre: 'Carbohidrato', porcentaje: 35 },
                { nombre: 'Grasa', porcentaje: 30 }
            ];
            break;
        default:
            macros = [
                { nombre: 'Proteína', porcentaje: 30 },
                { nombre: 'Carbohidrato', porcentaje: 50 },
                { nombre: 'Grasa', porcentaje: 20 }
            ];
    }

    const kcalPorGramo = { 'Proteína': 4, 'Carbohidrato': 4, 'Grasa': 9 };
    const rows = macros.map(macro => {
        const kcal = (cliente.caloriasObjetivo * macro.porcentaje) / 100;
        const gramos = kcal / kcalPorGramo[macro.nombre];
        const porciones = Math.ceil(kcal / valorPorcion); // Redondea hacia arriba
        return [
            macro.nombre,
            `${macro.porcentaje}%`,
            `~${Math.round(kcal)} kcal`,
            `${gramos.toFixed(0)} g`,
            `${porciones} porciones`
        ];
    });

    doc.autoTable({
        startY: y,
        head: [['Macronutriente', '% kcal aprox', 'Kcal', 'Gramos', 'Porciones']],
        body: rows,
        styles: {
            halign: 'center',
            fontSize: 11,
            cellPadding: 5
        },
        headStyles: {
            fillColor: [40, 60, 100],
            textColor: 255
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 15, right: 15 }
    });
    y = doc.lastAutoTable.finalY + 10;

    // ---------- EXPLICACIÓN DEL MÉTODO ----------
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Cómo funciona este método?", 15, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(0);
    const explicacion = [
        "Puedes elegir los alimentos que prefieras de cada grupo (proteínas, carbohidratos y grasas),",
        "siempre que no superes el número de porciones recomendadas para tu objetivo.",
        "Esto te da flexibilidad y variedad, permitiéndote adaptar tu dieta a tus gustos y necesidades.",
        "Recuerda: 1 porción equivale a 100 kcal. Suma las porciones de los alimentos elegidos y asegúrate",
        "de no sobrepasar el total diario recomendado para cada macronutriente."
    ];
    explicacion.forEach(linea => {
        doc.text(linea, 15, y);
        y += 6;
    });
    y += 8;

    // ---------- DATOS DE PRUEBA PARA ALIMENTOS ----------
    const alimentos = [
        // nombre, categoria, gramaje, esproteico, escarbohidrato, esgrasa
        { nombre: "Muslo de pollo", categoria: "carne", gramaje: 100, esproteico: 1, escarbohidrato: 0, esgrasa: 0 },
        { nombre: "Claras de huevo", categoria: "huevo", gramaje: 200, esproteico: 1, escarbohidrato: 0, esgrasa: 0 },
        { nombre: "Arroz crudo", categoria: "cereal", gramaje: 30, esproteico: 0, escarbohidrato: 1, esgrasa: 0 },
        { nombre: "Patata", categoria: "tubérculo", gramaje: 100, esproteico: 0, escarbohidrato: 1, esgrasa: 0 },
        { nombre: "Aceite de oliva", categoria: "aceite", gramaje: 10, esproteico: 0, escarbohidrato: 0, esgrasa: 1 },
        { nombre: "Nueces", categoria: "fruto seco", gramaje: 15, esproteico: 0, escarbohidrato: 0, esgrasa: 1 }
    ];

    // Filtrar por tipo
    const proteinas = alimentos.filter(a => a.esproteico);
    const carbohidratos = alimentos.filter(a => a.escarbohidrato);
    const grasas = alimentos.filter(a => a.esgrasa);

    // ---------- CABECERO DE SECCIÓN DE TABLAS DE ALIMENTOS ----------
    y += 15;
    doc.setFontSize(16);
    doc.setTextColor(40, 60, 100);
    doc.text("Tablas de Alimentos por Porción", 15, y);
    y += 15;

    // ---------- TABLA DE PROTEÍNAS (PÁGINA NUEVA) ----------
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text("Porciones de Proteína (1 porción = gramaje indicado)", 15, y);
    y += 10;
    doc.autoTable({
        startY: y,
        head: [['Alimento', 'Porción']],
        body: [
            ["Pollo, pavo (sin piel)", "100g"],
            ["Ternera (magro)", "100g"],
            ["Seitan", "90g"],
            ["Pechuga de pollo/Frango", "60g"],
            ["Jamón cocido/York light", "100g"],
            ["Hamburguesa pollo/pavo", "1 unidad"],
            ["Lomo de cerdo (magro)", "90g"],
            ["Hígado (cerdo/pollo/vaca)", "90g"],
            ["Embutido (mínimo 90% carne)", "90g"],
            ["Clara de huevo", "200g"],
            ["Huevo entero XL", "1 unidad"],
            ["Tofu", "100g"],
            ["Soja texturizada", "30g"],
            ["Gelatina proteica", "250g"],
            ["Yogurt proteico natural", "250g"],
            ["Queso fresco batido 0%", "250g"],
            ["Requesón desnatado", "150g"],
            ["Leche proteica Hacendado", "200ml"],
            ["Yogurt proteico (cualquier tipo)", "120g"],
            ["Bebida de soja proteica", "200ml"]
        ],
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 15, right: 15 }
    });
    y = doc.lastAutoTable.finalY + 15;

    // ---------- NUEVA PÁGINA PARA CARBOHIDRATOS ----------
    doc.addPage();
    y = 30;
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text("Porciones de Carbohidratos (1 porción = gramaje indicado)", 15, y);
    y += 10;
    doc.autoTable({
        startY: y,
        head: [['Alimento', 'Porción']],
        body: [
            ["Arroz crudo", "30g"],
            ["Patata", "100g"],
            ["Avena", "25g"],
            ["Pasta cruda", "30g"],
            ["Pan integral", "30g"],
            ["Tortilla de trigo/maíz", "1 unidad pequeña"],
            ["Quinoa cruda", "30g"],
            ["Batata", "80g"],
            ["Maíz dulce", "60g"],
            ["Galletas de arroz", "3 unidades"],
            ["Plátano", "80g"],
            ["Manzana", "120g"],
            ["Uvas", "80g"],
            ["Miel", "25g"],
            ["Dátiles", "30g"],
            ["Lentejas cocidas", "60g"],
            ["Garbanzos cocidos", "60g"],
            ["Judías cocidas", "60g"],
            ["Cuscús crudo", "30g"],
            ["Pan de centeno", "30g"]
        ],
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 15, right: 15 }
    });
    y = doc.lastAutoTable.finalY + 15;

    // ---------- NUEVA PÁGINA PARA GRASAS ----------
    doc.addPage();
    y = 30;
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text("Porciones de Grasas (1 porción = gramaje indicado)", 15, y);
    y += 10;
    doc.autoTable({
        startY: y,
        head: [['Alimento', 'Porción']],
        body: [
            ["Aceite de oliva", "10g"],
            ["Nueces", "15g"],
            ["Almendras", "15g"],
            ["Aguacate", "50g"],
            ["Mantequilla", "10g"],
            ["Cacahuetes", "15g"],
            ["Anacardos", "15g"],
            ["Pistachos", "15g"],
            ["Semillas de chía", "15g"],
            ["Semillas de lino", "15g"],
            ["Semillas de calabaza", "15g"],
            ["Queso curado", "20g"],
            ["Chocolate negro (+85%)", "15g"],
            ["Mayonesa", "15g"],
            ["Tahin (pasta de sésamo)", "15g"],
            ["Aceitunas", "30g"],
            ["Coco rallado", "10g"],
            ["Crema de cacahuete", "15g"],
            ["Margarina", "10g"],
            ["Pipas de girasol", "15g"]
        ],
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 15, right: 15 }
    });
    y = doc.lastAutoTable.finalY + 15;

    // ---------- GUARDAR ----------
    doc.save(`informe_${cliente.nombre}.pdf`);
}