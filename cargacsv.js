// cargaCSV.js
// Clase para gestionar la carga y validación del archivo CSV en la pantalla de inicio

class CargaCSV {
    constructor() {
        this.csvValido = false;
        this.init();
    }

    init() {
        const csvInput = document.getElementById('csvInicialInput');
        const continuarBtn = document.getElementById('continuarBtn');
        const csvError = document.getElementById('csvError');
        if (!csvInput || !continuarBtn || !csvError) return;

        csvInput.addEventListener('change', (e) => this.handleFileChange(e, csvError, continuarBtn));
        continuarBtn.addEventListener('click', () => this.handleContinue());
    }

    handleFileChange(e, csvError, continuarBtn) {
        const file = e.target.files[0];
        csvError.textContent = '';
        continuarBtn.style.display = 'none';

        if (!file) return;
        if (!file.name.endsWith('.csv')) {
            csvError.textContent = 'Por favor, selecciona un archivo CSV válido.';
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const lines = evt.target.result.trim().split('\n');
                if (lines.length < 2 || lines[0].split(',').length < 3) {
                    throw new Error();
                }
                this.csvValido = true;
                continuarBtn.style.display = '';
                localStorage.setItem('clientesCSV', evt.target.result);
            } catch {
                csvError.textContent = 'El archivo CSV no tiene el formato esperado.';
                this.csvValido = false;
            }
        };
        reader.readAsText(file);
    }

    handleContinue() {
        if (this.csvValido) {
            window.location.href = 'index.html';
        }
    }
}

// Inicializar la clase al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    new CargaCSV();
});
