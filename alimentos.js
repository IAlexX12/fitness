// Clase para gestionar la carga y acceso a los alimentos desde un CSV

class AlimentosManager {
    constructor() {
        this.alimentos = [];
    }

    cargarDesdeCSV(text) {
        // Cargar csv comidas con nueva estructura
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        this.alimentos = lines.slice(1).map(line => {
            const values = line.split(',');
            const alimento = {};
            headers.forEach((header, idx) => {
                alimento[header] = values[idx] ? values[idx].trim() : '';
            });
            // Convertir a número los campos relevantes
            alimento.proteina = Number(alimento.proteina);
            alimento.carbohidratos = Number(alimento.carbohidratos);
            alimento.grasas = Number(alimento.grasas);
            alimento.calorias = Number(alimento.calorias);
            alimento.porcion = Number(alimento.porcion);
            return alimento;
        });
    }

    getAlimentosFiltrados({alergias = [], categoria = null} = {}) {
        // Devuelve alimentos que no estén en alergias y opcionalmente por categoría
        return this.alimentos.filter(alimento => {
            const nombreLower = (alimento.nombre || '').toLowerCase();
            const tieneAlergia = alergias.some(al => nombreLower.includes(al.toLowerCase()));
            if (tieneAlergia) return false;
            if (categoria && alimento.categoria !== categoria) return false;
            return true;
        });
    }

    /**
     * Recomienda alimentos y porciones para cubrir calorías y macros
     * @param {number} caloriasObjetivo
     * @param {Array} alergias
     * @param {number} maxAlimentos
     * @returns {Array} [{alimento, porciones, totalCal, totalProt, totalCarb, totalGrasas}]
     */
    getRecomendacion(caloriasObjetivo, alergias = [], maxAlimentos = 5) {
        // Filtrar alimentos disponibles
        const disponibles = this.getAlimentosFiltrados({alergias});
        // Ordenar por densidad proteica descendente
        const ordenados = disponibles.sort((a, b) => b.proteina - a.proteina);
        // Seleccionar hasta maxAlimentos diferentes
        const seleccionados = ordenados.slice(0, maxAlimentos);
        // Calcular necesidades aproximadas de macros 
        // (ejemplo: 25% prot, 50% carb, 25% grasas)
        const pctProt = 0.25, pctCarb = 0.5, pctGrasas = 0.25;
        const kcalProt = caloriasObjetivo * pctProt;
        const kcalCarb = caloriasObjetivo * pctCarb;
        const kcalGrasas = caloriasObjetivo * pctGrasas;
        const grProt = kcalProt / 4;
        const grCarb = kcalCarb / 4;
        const grGrasas = kcalGrasas / 9;
        // Inicializar resultado
        let totalCal = 0, totalProt = 0, totalCarb = 0, totalGrasas = 0;
        const resultado = [];
        // Algoritmo simple: repartir porciones proporcionalmente según macros
        seleccionados.forEach(alimento => {
            // Calcular porciones sugeridas para cada macro
            const porcionesProt = grProt / (alimento.proteina || 1);
            const porcionesCarb = grCarb / (alimento.carbohidratos || 1);
            const porcionesGrasas = grGrasas / (alimento.grasas || 1);
            // Promedio de porciones sugeridas (solo si el macro es relevante)
            let porciones = 0;
            let n = 0;
            if (alimento.proteina > 0) { porciones += porcionesProt; n++; }
            if (alimento.carbohidratos > 0) { porciones += porcionesCarb; n++; }
            if (alimento.grasas > 0) { porciones += porcionesGrasas; n++; }
            porciones = n > 0 ? porciones / n : 1;
            porciones = Math.max(1, Math.round(porciones));
            // Totales
            const tCal = alimento.calorias * porciones;
            const tProt = alimento.proteina * porciones;
            const tCarb = alimento.carbohidratos * porciones;
            const tGrasas = alimento.grasas * porciones;
            totalCal += tCal;
            totalProt += tProt;
            totalCarb += tCarb;
            totalGrasas += tGrasas;
            resultado.push({
                alimento,
                porciones,
                totalCal: tCal,
                totalProt: tProt,
                totalCarb: tCarb,
                totalGrasas: tGrasas
            });
        });
        // Ajustar si se pasa mucho de calorías
        let exceso = totalCal - caloriasObjetivo;
        if (exceso > caloriasObjetivo * 0.15) {
            // Reducir porciones proporcionalmente
            const factor = caloriasObjetivo / totalCal;
            resultado.forEach(r => {
                r.porciones = Math.max(1, Math.round(r.porciones * factor));
                r.totalCal = r.alimento.calorias * r.porciones;
                r.totalProt = r.alimento.proteina * r.porciones;
                r.totalCarb = r.alimento.carbohidratos * r.porciones;
                r.totalGrasas = r.alimento.grasas * r.porciones;
            });
        }
        return resultado;
    }


    /**
     * Búsqueda aleatoria de conjuntos completos y greedy
     * Genera muchas combinaciones aleatorias y se queda con una que cumpla el umbral de calidad.
     */
    getRecomendacionAvanzada2(
        caloriasObjetivo, alergias = [], maxAlimentos = 5, maxPorcionesPorAlimento = 8, solucionesIntentos = 100, umbralOptimo = 0.25
    ) {
        const disponibles = this.getAlimentosFiltrados({alergias});
        if (disponibles.length === 0) return [];
        // Objetivos de macros
        const pctProt = 0.25, pctCarb = 0.5, pctGrasas = 0.25;
        const kcalProt = caloriasObjetivo * pctProt;
        const kcalCarb = caloriasObjetivo * pctCarb;
        const kcalGrasas = caloriasObjetivo * pctGrasas;
        const grProt = kcalProt / 4;
        const grCarb = kcalCarb / 4;
        const grGrasas = kcalGrasas / 9;
        let mejores = [];
        let mejoresErrores = [];
        for (let intento = 0; intento < solucionesIntentos; intento++) {
            // Elegir aleatoriamente maxAlimentos distintos
            const seleccionados = this._sampleArray(disponibles, maxAlimentos);
            // Asignar porciones aleatorias a cada uno (al menos 1)
            const porciones = seleccionados.map(() => 1 + Math.floor(Math.random() * maxPorcionesPorAlimento));
            // Calcular totales
            let totalCal = 0, totalProt = 0, totalCarb = 0, totalGrasas = 0;
            seleccionados.forEach((a, i) => {
                totalCal += a.calorias * porciones[i];
                totalProt += a.proteina * porciones[i];
                totalCarb += a.carbohidratos * porciones[i];
                totalGrasas += a.grasas * porciones[i];
            });
            // Calcular error
            const error = this._errorMacros(
                totalCal, totalProt, totalCarb, totalGrasas,
                caloriasObjetivo, grProt, grCarb, grGrasas
            );
            // Guardar si es mejor que el umbral óptimo
            if (error < umbralOptimo) {
                mejores.push({
                    resultado: seleccionados.map((a, i) => ({
                        alimento: a,
                        porciones: porciones[i],
                        totalCal: a.calorias * porciones[i],
                        totalProt: a.proteina * porciones[i],
                        totalCarb: a.carbohidratos * porciones[i],
                        totalGrasas: a.grasas * porciones[i]
                    })),
                    error
                });
                mejoresErrores.push(error);
            }
        }
        // Si hay varias soluciones buenaselegir una aleatoria
        if (mejores.length > 0) {
            const idx = Math.floor(Math.random() * mejores.length);
            return mejores[idx].resultado;
        }
        // Si no hay ninguna suficientemente buena devolver la mejor encontrada
        let mejor = null;
        let mejorError = null;
        for (let intento = 0; intento < solucionesIntentos; intento++) {
            const seleccionados = this._sampleArray(disponibles, maxAlimentos);
            const porciones = seleccionados.map(() => 1 + Math.floor(Math.random() * maxPorcionesPorAlimento));
            let totalCal = 0, totalProt = 0, totalCarb = 0, totalGrasas = 0;
            seleccionados.forEach((a, i) => {
                totalCal += a.calorias * porciones[i];
                totalProt += a.proteina * porciones[i];
                totalCarb += a.carbohidratos * porciones[i];
                totalGrasas += a.grasas * porciones[i];
            });
            const error = this._errorMacros(
                totalCal, totalProt, totalCarb, totalGrasas,
                caloriasObjetivo, grProt, grCarb, grGrasas
            );
            if (mejorError === null || error < mejorError) {
                mejorError = error;
                mejor = seleccionados.map((a, i) => ({
                    alimento: a,
                    porciones: porciones[i],
                    totalCal: a.calorias * porciones[i],
                    totalProt: a.proteina * porciones[i],
                    totalCarb: a.carbohidratos * porciones[i],
                    totalGrasas: a.grasas * porciones[i]
                }));
            }
        }
        return mejor || [];
    }

    // Muestra aleatoria de n elementos de un array
    _sampleArray(arr, n) {
        const copia = arr.slice();
        const res = [];
        for (let i = 0; i < n && copia.length > 0; i++) {
            const idx = Math.floor(Math.random() * copia.length);
            res.push(copia.splice(idx, 1)[0]);
        }
        return res;
    }

    // Calcula el error cuadrático de las macros respecto a los objetivos
    _errorMacros(totalCal, totalProt, totalCarb, totalGrasas, caloriasObjetivo, grProt, grCarb, grGrasas) {
        return (
            Math.pow((totalCal - caloriasObjetivo) / caloriasObjetivo, 2) +
            Math.pow((totalProt - grProt) / grProt, 2) +
            Math.pow((totalCarb - grCarb) / grCarb, 2) +
            Math.pow((totalGrasas - grGrasas) / grGrasas, 2)
        );
    }
}

// Instancia global para otras clases
window.alimentosManager = new AlimentosManager();
