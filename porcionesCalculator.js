// Clase para calcular porciones según objetivo
class PorcionesCalculator {
    constructor(cliente) {
        this.calorias = Number(cliente.caloriasObjetivo) || 0;
        this.objetivo = (cliente.objetivo || '').toLowerCase();
        this.porcionesTotales = Math.round(this.calorias / 100);
        this.porcentajes = this.getPorcentajes();
        // Calcular porciones asegurando que la suma sea igual al total
        this.porcionesProteina = Math.round(this.porcionesTotales * this.porcentajes.proteina);
        this.porcionesCarbohidrato = Math.round(this.porcionesTotales * this.porcentajes.carbohidrato);
        // La última porción es la diferencia para cuadrar el total
        this.porcionesGrasa = this.porcionesTotales - this.porcionesProteina - this.porcionesCarbohidrato;
    }
    getPorcentajes() {
        switch (this.objetivo) {
            case 'déficit':
            case 'deficit':
                return { proteina: 0.41, carbohidrato: 0.35, grasa: 0.24 };
            case 'volumen':
                return { proteina: 0.29, carbohidrato: 0.53, grasa: 0.18 };
            case 'recomposición':
            case 'recomposicion':
                return { proteina: 0.37, carbohidrato: 0.37, grasa: 0.31 };
            default:
                return { proteina: 0.33, carbohidrato: 0.33, grasa: 0.33 };
        }
    }
    getResumen() {
        return {
            total: this.porcionesTotales,
            proteina: this.porcionesProteina,
            carbohidrato: this.porcionesCarbohidrato,
            grasa: this.porcionesGrasa
        };
    }
}