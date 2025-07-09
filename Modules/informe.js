window.generarInforme = async function(idx) {
    if (!window.clientes || !window.clientes[idx]) {
        alert('No se encontró el cliente.');
        return;
    }

    const cliente = window.clientes[idx];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 15;
    let y = 20;

    // ---------- TÍTULO PRINCIPAL ----------
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 100);
    doc.text("Informe Personalizado de Cliente", marginX, y);
    y += 8;
    doc.setLineWidth(0.5);
    doc.setDrawColor(180);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 10;

    // ---------- DATOS PERSONALES CENTRADOS ----------
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    const tituloDatos = "Datos personales";
    let textWidth = doc.getTextWidth(tituloDatos);
    doc.text(tituloDatos, (pageWidth - textWidth) / 2, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(0);
    const datos = [
        [`Fecha de alta:`, cliente.fechaAlta],
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
        y += 6;
    });
    y += 6;

    // ---------- ¿QUÉ ES UNA PORCIÓN? ----------
    doc.setFontSize(15);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Qué es una porción?", marginX, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Una porción es una unidad de medida que se utiliza para organizar y equilibrar tu alimentación.", marginX, y);
    y += 6;
    doc.text("En este sistema, una porción equivale a 100 kilocalorías (kcal). Así, puedes saber cuánto estás", marginX, y);
    y += 6;
    doc.text("comiendo sin necesidad de contar calorías constantemente.", marginX, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("Por ejemplo:", marginX, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("100 gramos de pollo = 1 porción de proteína", marginX + 5, y);
    y += 6;
    doc.text("30 gramos de arroz crudo = 1 porción de carbohidratos", marginX + 5, y);
    y += 6;
    doc.text("10 gramos de aceite de oliva = 1 porción de grasa", marginX + 5, y);
    y += 10;

    // ---------- ¿PARA QUÉ SIRVEN LAS PORCIONES? ----------
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Para qué sirven las porciones?", marginX, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Usar porciones es una forma práctica y visual de:", marginX, y);
    y += 6;
    doc.text("• Controlar la cantidad de comida que consumes", marginX + 5, y);
    y += 6;
    doc.text("• Equilibrar los nutrientes que tu cuerpo necesita", marginX + 5, y);
    y += 6;
    doc.text("• Adaptar tu alimentación a tus objetivos (bajar de peso, ganar masa muscular, mantenerte saludable)", marginX + 5, y);
    y += 8;

    // ---------- ¿CÓMO SE DIVIDEN LOS ALIMENTOS EN PORCIONES? ----------
    if (y > 180) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    
    doc.text("¿Cómo se dividen los alimentos en porciones?", marginX, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Los alimentos se agrupan según el macronutriente principal que aportan:", marginX, y);
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
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginX, right: marginX }
    });
    y = doc.lastAutoTable.finalY + 8;
    

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Cada porción aporta unas 100 kcal.", marginX, y);
    y += 10;

    // ---------- ¿CÓMO SE USAN? (EJEMPLO PRÁCTICO) ----------
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Cómo se usan? (Ejemplo práctico)", marginX, y);
    y += 7;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Supongamos que tu plan diario es consumir:", marginX, y);
    y += 6;
    doc.text("4 porciones de proteína", marginX + 5, y);
    y += 6;
    doc.text("3 porciones de carbohidratos", marginX + 5, y);
    y += 6;
    doc.text("2 porciones de grasas", marginX + 5, y);
    y += 8;

    doc.text("Esto podría verse así en un plato:", marginX, y);
    y += 6;

    [
        "Proteína: 100g de pollo (1 porción) + 1 huevo XL (1 porción)",
        "+ 200g de claras (1 porción) + 100g de yogur proteico (1 porción)",
        "Carbohidrato: 30g de arroz (1 porción) + 100g de patata (1 porción)",
        "+ 25g de avena (1 porción)",
        "Grasa: 10g de aceite de oliva (1 porción) + 15g de almendras (1 porción)"
    ].forEach(linea => {
        doc.text(linea, marginX + 5, y);
        y += 6;
    });

    y += 4;
    doc.setFont("helvetica", "italic");
    doc.text("Así, comes lo que necesitas sin estar pesando todo el día ni contando calorías una por una.", marginX, y);
    doc.setFont("helvetica", "normal");
    y += 12;

    // ---------- RESUMEN NUTRICIONAL EN LA MISMA PÁGINA ----------
    if (y > 180) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(16);
    doc.setTextColor(40, 60, 100);
    doc.text("Resumen Nutricional Diario", marginX, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Calorías Objetivo: ${cliente.caloriasObjetivo} kcal`, marginX, y);
    y += 10;

    // ---------- INFORMACIÓN DE PORCIONES TOTALES Y VALOR DE PORCIÓN ----------
    const valorPorcion = 100; // kcal por porción
    const totalPorciones = Math.ceil(cliente.caloriasObjetivo / valorPorcion);

    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("Información de porciones diarias", marginX, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`• Calorías objetivo: ${cliente.caloriasObjetivo} kcal`, marginX, y);
    y += 6;
    doc.text(`• 1 porción equivale a ${valorPorcion} kcal`, marginX, y);
    y += 6;
    doc.text(`• Porciones totales recomendadas al día: ${totalPorciones}`, marginX, y);
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
    function redondearPorciones(valor) {
        const entero = Math.floor(valor);
        const decimal = valor - entero;
        if (decimal < 0.35) {
            return entero;
        } else if (decimal > 0.85) {
            return entero + 1;
        } else {
            return entero + 0.5;
        }
    }

    const rows = macros.map(macro => {
        const kcal = (cliente.caloriasObjetivo * macro.porcentaje) / 100;
        const gramos = kcal / kcalPorGramo[macro.nombre];
        const porcionesRaw = kcal / valorPorcion;
        const porciones = redondearPorciones(porcionesRaw);
        return [
            macro.nombre,
            `${macro.porcentaje}%`,
            `~${Math.round(kcal)} kcal`,
            `${porciones} porciones`
        ];
    });

    doc.autoTable({
        startY: y,
        head: [['Macronutriente', '% kcal aprox', 'Kcal', 'Porciones (100 kcal c/u)']],
        body: rows,
        styles: { halign: 'center', fontSize: 11, cellPadding: 5 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginX, right: marginX }
    });
    y = doc.lastAutoTable.finalY + 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Nota: Los gramos indicados son la suma total de alimentos del grupo correspondiente.', marginX, y);
    y += 5;
    doc.text('Consulta la tabla de porciones para ver equivalencias.', marginX, y);
    y += 10;

    // ---------- EXPLICACIÓN DEL MÉTODO ----------
    if (y > 180) {
        doc.addPage();
        y = 20;
    }
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text("¿Cómo funciona este método?", marginX, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(0);
    [
        "Puedes elegir los alimentos que prefieras de cada grupo (proteínas, carbohidratos y grasas),",
        "siempre que no superes el número de porciones recomendadas para tu objetivo.",
        "Esto te da flexibilidad y variedad, permitiéndote adaptar tu dieta a tus gustos y necesidades.",
        "Recuerda: 1 porción equivale a 100 kcal. Suma las porciones de los alimentos elegidos y asegúrate",
        "de no sobrepasar el total diario recomendado para cada macronutriente."
    ].forEach(linea => {
        doc.text(linea, marginX, y);
        y += 6;
    });
    y += 8;

    // ---------- TABLAS DE ALIMENTOS POR PORCIÓN ----------
    doc.addPage();
    y = 30;
    doc.setFontSize(16);
    doc.setTextColor(40, 60, 100);
    doc.text("Tablas de Alimentos por Porción", marginX, y);

    // Cargar alimentos
    async function cargarAlimentosCSV() {
        // 1. Intenta cargar desde localStorage
        const local = localStorage.getItem('clasificadosCSV');
        if (local) return local;
        // 2. Si no existe, intenta cargar desde el servidor (modo legacy)
        const ruta = 'Data/alimentos.csv';
        try {
            const resp = await fetch(ruta);
            if (!resp.ok) throw new Error('No se pudo cargar el archivo de alimentos.');
            return await resp.text();
        } catch (e) {
            alert('No se pudo cargar el archivo de alimentos.');
            return '';
        }
    }

    function parseCSV(csv) {
        const lines = csv.trim().split('\n');
        const headers = lines[0].replace('\r', '').split(',');
        return lines.slice(1).map(line => {
            const values = line.replace('\r', '').split(',');
            const obj = {};
            headers.forEach((h, i) => {
                obj[h.trim()] = values[i] ? values[i].trim() : '';
            });
            obj.gramaje = Number(obj.gramaje);
            obj.esproteico = obj.esproteico === '1';
            obj.escarbohidrato = obj.escarbohidrato === '1';
            obj.esgrasa = obj.esgrasa === '1';
            obj.alergenos = obj.alergenos ? obj.alergenos.split(';').map(a => a.trim().toLowerCase()) : [];
            obj.categoria = obj.categoria ? obj.categoria.trim().toLowerCase() : '';
            return obj;
        });
    }

    const alimentosCSV = await cargarAlimentosCSV();
    if (!alimentosCSV) return;
    const alimentos = parseCSV(alimentosCSV);

    // Filtrar por alergias
    const alergiasCliente = (cliente.alergias || []).map(a => a.toLowerCase());
    const alimentosFiltrados = alimentos.filter(alim => {
        if (!alim.alergenos || alim.alergenos.length === 0) return true;
        return !alim.alergenos.some(al => alergiasCliente.includes(al));
    });

    // 1. Construir el array de categorías a mostrar
    let categoriasSeleccionadas = (cliente.alimentos || []).map(c => c.toLowerCase()).filter(Boolean);
    const categoriasFijas = ['proteina', 'carbohidratos', 'grasa'];
    categoriasSeleccionadas = Array.from(new Set([...categoriasFijas, ...categoriasSeleccionadas]));

    // 2. Filtrar alimentos finales por esas categorías y sin duplicados
    const alimentosFinal = alimentosFiltrados.filter(alim => categoriasSeleccionadas.includes(alim.categoria));

    // 3. Función para filtrar por tipo y categoría exacta (por si quieres mantener flags)
    function filtrarPorTipoYCategoria(alimentos, tipo, categoriaExacta) {
        // Alimentos que cumplen el flag (esproteico, escarbohidrato, esgrasa)
        const porFlag = alimentos.filter(a => a[tipo]);
        // Alimentos que tienen la categoría exacta
        const porCategoria = alimentos.filter(a => a.categoria === categoriaExacta);
        // Unir y quitar duplicados por nombre
        const todos = [...porFlag, ...porCategoria];
        const vistos = new Set();
        return todos.filter(a => {
            if (vistos.has(a.nombre)) return false;
            vistos.add(a.nombre);
            return true;
        });
    }

    // 4. Usa alimentosFinal para las tablas:
    const proteinas = filtrarPorTipoYCategoria(alimentosFinal, 'esproteico', 'proteina');
    const carbohidratos = filtrarPorTipoYCategoria(alimentosFinal, 'escarbohidrato', 'carbohidratos');
    const grasas = filtrarPorTipoYCategoria(alimentosFinal, 'esgrasa', 'grasa');

    // ---------- TABLA DE PROTEÍNAS ----------
    y += 15;
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text("Porciones de Proteína (1 porción = gramaje indicado)", marginX, y);
    y += 10;
    let proteinasBody = proteinas.map(a => {
        if (!a.gramaje) return [a.nombre, ''];
        let unidad = '';
        if (a.categoria === 'lácteos') {
            unidad = 'ml';
        } else if (a.gramaje < 10) {
            unidad = 'unidades';
        } else {
            unidad = 'g';
        }
        return [a.nombre, `${a.gramaje}${unidad}`];
    });
    if (proteinasBody.length === 0) {
        proteinasBody = [['(Sin alimentos disponibles)', '']];
    }
    doc.autoTable({
        startY: y,
        head: [['Alimento', 'Porción']],
        body: proteinasBody,
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginX, right: marginX }
    });
    y = doc.lastAutoTable.finalY + 15;

    // ---------- TABLA DE CARBOHIDRATOS ----------
    doc.addPage();
    y = 30;
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text("Porciones de Carbohidratos (1 porción = gramaje indicado)", marginX, y);
    y += 10;
    let carbohidratosBody = carbohidratos.map(a => {
        if (!a.gramaje) return [a.nombre, ''];
        let unidad = '';
        if (a.categoria === 'lácteos') {
            unidad = 'ml';
        } else if (a.gramaje < 10) {
            unidad = 'unidades';
        } else {
            unidad = 'g';
        }
        return [a.nombre, `${a.gramaje}${unidad}`];
    });
    if (carbohidratosBody.length === 0) {
        carbohidratosBody = [['(Sin alimentos disponibles)', '']];
    }
    doc.autoTable({
        startY: y,
        head: [['Alimento', 'Porción']],
        body: carbohidratosBody,
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginX, right: marginX }
    });
    y = doc.lastAutoTable.finalY + 15;

    // ---------- TABLA DE GRASAS ----------
    doc.addPage();
    y = 30;
    doc.setFontSize(14);
    doc.setTextColor(40, 60, 100);
    doc.text("Porciones de Grasas (1 porción = gramaje indicado)", marginX, y);
    y += 10;
    let grasasBody = grasas.map(a => {
        if (!a.gramaje) return [a.nombre, ''];
        let unidad = '';
        if (a.categoria === 'lácteos') {
            unidad = 'ml';
        } else if (a.gramaje < 10) {
            unidad = 'unidades';
        } else {
            unidad = 'g';
        }
        return [a.nombre, `${a.gramaje}${unidad}`];
    });
    if (grasasBody.length === 0) {
        grasasBody = [['(Sin alimentos disponibles)', '']];
    }
    doc.autoTable({
        startY: y,
        head: [['Alimento', 'Porción']],
        body: grasasBody,
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [40, 60, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginX, right: marginX }
    });

    // ---------- GUARDAR ----------
    doc.save(`informe_${cliente.nombre}.pdf`);
}