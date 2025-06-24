// indice.js
// Clase para gestionar la carga del CSV de alimentos en la pantalla principal

class Indice {
    constructor() {
        this.init();
    }

    init() {
        const alimentosInput = document.getElementById('alimentosCSV');
        if (alimentosInput) {
            alimentosInput.addEventListener('change', (e) => this.handleAlimentosCSV(e));
        }
    }

    handleAlimentosCSV(e) {
        const file = e.target.files[0];
        const errorDiv = document.getElementById('alimentosCSVError');
        errorDiv.textContent = '';
        if (!file) return;
        if (!file.name.endsWith('.csv')) {
            errorDiv.textContent = 'Por favor, selecciona un archivo CSV válido.';
            errorDiv.classList.remove('text-success');
            errorDiv.classList.add('text-danger');
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                window.alimentosManager.cargarDesdeCSV(evt.target.result);
                errorDiv.textContent = 'Alimentos cargados correctamente.';
                errorDiv.classList.remove('text-danger');
                errorDiv.classList.add('text-success');
            } catch {
                errorDiv.textContent = 'El archivo CSV no tiene el formato esperado.';
                errorDiv.classList.remove('text-success');
                errorDiv.classList.add('text-danger');
            }
        };
        reader.readAsText(file);
    }
}

// Inicializar la clase al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    new Indice();
});
