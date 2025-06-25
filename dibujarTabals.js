class AlimentosTableDrawer {
    constructor(cliente, doc) {
        this.cliente = cliente;
        this.doc = doc;
        this.y = 200; // Aumentado para evitar solapamiento con el bloque de porciones
    }

    filtrarAlimentosPorAlergias(alimentos, alergias) {
        if (!Array.isArray(alergias)) return alimentos;
        const alergiasLower = alergias.map(a => a.trim().toLowerCase());
        return alimentos.filter(a => !alergiasLower.includes((a.categoria || '').trim().toLowerCase()));
    }

    drawTable(title, data, color) {
        if (data.length === 0) return;
        const doc = this.doc;
        let y = this.y;
        const colX = [15, 60, 110, 150];
        const colW = [45, 50, 40];
        const rowH = 8;
        doc.setFontSize(13);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(title, 15, y);
        y += 6;
        doc.setFillColor(230,230,230);
        doc.rect(colX[0], y, colW[0]+colW[1]+colW[2], rowH, 'F');
        doc.setFontSize(11);
        doc.setTextColor(60,60,60);
        doc.text('Nombre', colX[0]+2, y+6);
        doc.text('Categoría', colX[1]+2, y+6);
        doc.text('Gramaje', colX[2]+2, y+6);
        doc.setDrawColor(120,120,120);
        doc.rect(colX[0], y, colW[0], rowH);
        doc.rect(colX[1], y, colW[1], rowH);
        doc.rect(colX[2], y, colW[2], rowH);
        y += rowH;
        data.forEach(a => {
            doc.setTextColor(30,30,30);
            doc.text(a.nombre, colX[0]+2, y+6);
            doc.text(a.categoria, colX[1]+2, y+6);
            doc.text(a.gramaje + 'g', colX[2]+2, y+6);
            doc.setDrawColor(180,180,180);
            doc.rect(colX[0], y, colW[0], rowH);
            doc.rect(colX[1], y, colW[1], rowH);
            doc.rect(colX[2], y, colW[2], rowH);
            y += rowH;
        });
        y += 12;
        this.y = y;
    }

    dibujarTablas() {
        const clasificadosCSV = localStorage.getItem('clasificadosCSV');
        if (!clasificadosCSV) return;
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
        proteicos = this.filtrarAlimentosPorAlergias(proteicos, this.cliente.alergias);
        carbohidratos = this.filtrarAlimentosPorAlergias(carbohidratos, this.cliente.alergias);
        grasas = this.filtrarAlimentosPorAlergias(grasas, this.cliente.alergias);
        this.drawTable('Proteínas', proteicos, [44, 62, 200]);
        this.drawTable('Carbohidratos', carbohidratos, [34, 197, 94]);
        this.drawTable('Grasas', grasas, [245, 158, 11]);
    }
}