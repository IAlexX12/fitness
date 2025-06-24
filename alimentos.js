// Clase para gestionar la carga y acceso a los alimentos desde un CSV

class AlimentosManager {
    constructor() {
        this.alimentos = [];
    }

    cargarDesdeCSV(text) {
        // Vargar csv comidas
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');
        this.alimentos = lines.slice(1).map(line => {
            const values = line.split(',');
            const alimento = {};
            headers.forEach((header, idx) => {
                alimento[header.trim().toLowerCase()] = values[idx].trim();
            });
            alimento.calorias = Number(alimento.calorias);
            return alimento;
        });
    }

    // Pendiente de testear
    getAlimentosFiltrados({alergias = [], categoria = null} = {}) {
        // Devuelve alimentos que no estén en alergias y opcionalmente por categoría
        return this.alimentos.filter(alimento => {
            const nombreLower = alimento.nombre.toLowerCase();
            const tieneAlergia = alergias.some(al => nombreLower.includes(al.toLowerCase()));
            if (tieneAlergia) return false;
            if (categoria && alimento.categoria !== categoria) return false;
            return true;
        });
    }

    getRecomendacion(caloriasObjetivo, alergias = [], maxAlimentos = 5) {
        // Selecciona aleatoriamente alimentos hasta sumar caloriasObjetivo
        const disponibles = this.getAlimentosFiltrados({alergias});
        const seleccionados = [];
        let suma = 0;
        const copia = [...disponibles];
        while (copia.length > 0 && seleccionados.length < maxAlimentos && suma < caloriasObjetivo) {
            const idx = Math.floor(Math.random() * copia.length);
            const alimento = copia.splice(idx, 1)[0];
            if (suma + alimento.calorias <= caloriasObjetivo * 1.1) { // margen 10%?
                seleccionados.push(alimento);
                suma += alimento.calorias;
            }
        }
        return seleccionados;
    }
}

// Instancia global para otras clases
window.alimentosManager = new AlimentosManager();
