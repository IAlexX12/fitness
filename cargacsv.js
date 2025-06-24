// cargaCSV.js
// Clase para gestionar la carga y validación del archivo CSV en la pantalla de inicio

class CargaCSV {
    constructor() {
        this.csvValido = false;
        this.alimentosValido = false;
        this.init();
    }

    // Inicializa los eventos de la página
    // Configura los manejadores de eventos para los inputs de CSV y el botón de continuar
    init() {
        const csvInput = document.getElementById('csvInicialInput');
        const continuarBtn = document.getElementById('continuarBtn');
        const csvError = document.getElementById('csvError');
        const alimentosInput = document.getElementById('alimentosInicialInput');
        const alimentosError = document.getElementById('alimentosError');
        this.alimentosValido = false;
        if (!csvInput || !continuarBtn || !csvError || !alimentosInput || !alimentosError) return;

        csvInput.addEventListener('change', (e) => this.handleFileChange(e, csvError, continuarBtn));
        alimentosInput.addEventListener('change', (e) => this.handleAlimentosChange(e, alimentosError, continuarBtn));
        continuarBtn.addEventListener('click', () => this.handleContinue());
    }

    // Maneja el cambio de archivo CSV
    // Valida el formato del archivo y muestra mensajes de error si es necesario
    handleFileChange(e, csvError, continuarBtn) {
        const file = e.target.files[0];
        csvError.textContent = '';
        continuarBtn.style.display = 'none';
        const csvStatusIcon = document.getElementById('csvStatusIcon');
        if (csvStatusIcon) csvStatusIcon.textContent = '';

        const expectedHeaders = ['Nombre','Altura','Peso','Edad','% Graso','M. Magra','M. Grasa','IMC','MB','Calorías Objetivo','Actividad','Objetivo','Alergias'];

        if (!file) return;
        if (!file.name.endsWith('.csv')) {
            csvError.textContent = 'Por favor, selecciona un archivo CSV válido.';
            if (csvStatusIcon) {
                csvStatusIcon.textContent = '✗';
                csvStatusIcon.style.color = 'red';
            }
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const lines = evt.target.result.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                if (lines.length < 2 || headers.length < 3) {
                    throw new Error();
                }
                // Validar encabezados
                if (headers.length !== expectedHeaders.length || !headers.every((h, i) => h === expectedHeaders[i])) {
                    csvError.textContent = 'El archivo CSV de clientes no tiene los encabezados esperados.';
                    if (csvStatusIcon) {
                        csvStatusIcon.textContent = '✗';
                        csvStatusIcon.style.color = 'red';
                    }
                    this.csvValido = false;
                    return;
                }
                this.csvValido = true;
                continuarBtn.style.display = '';
                localStorage.setItem('clientesCSV', evt.target.result);
                if (csvStatusIcon) {
                    csvStatusIcon.textContent = '✓';
                    csvStatusIcon.style.color = 'green';
                }
            } catch {
                csvError.textContent = 'El archivo CSV no tiene el formato esperado.';
                this.csvValido = false;
                if (csvStatusIcon) {
                    csvStatusIcon.textContent = '✗';
                    csvStatusIcon.style.color = 'red';
                }
            }
        };
        reader.readAsText(file);
    }

    // Maneja el cambio del archivo CSV de alimentos
    // Valida el formato del archivo y muestra mensajes de error si es necesario
    handleAlimentosChange(e, alimentosError, continuarBtn) {
        const file = e.target.files[0];
        alimentosError.textContent = '';
        continuarBtn.style.display = 'none';
        const alimentosStatusIcon = document.getElementById('alimentosStatusIcon');
        if (alimentosStatusIcon) alimentosStatusIcon.textContent = '';

        const expectedHeaders = ['nombre','categoria','calorias'];

        if (!file) return;
        if (!file.name.endsWith('.csv')) {
            alimentosError.textContent = 'Por favor, selecciona un archivo CSV válido de alimentos.';
            if (alimentosStatusIcon) {
                alimentosStatusIcon.textContent = '✗';
                alimentosStatusIcon.style.color = 'red';
            }
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const lines = evt.target.result.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                if (lines.length < 2 || headers.length < 3) {
                    throw new Error();
                }
                // Validar formato
                if (headers.length !== expectedHeaders.length || !headers.every((h, i) => h === expectedHeaders[i])) {
                    alimentosError.textContent = 'El archivo CSV de alimentos no tiene el formato esperados';
                    if (alimentosStatusIcon) {
                        alimentosStatusIcon.textContent = '✗';
                        alimentosStatusIcon.style.color = 'red';
                    }
                    this.alimentosValido = false;
                    return;
                }
                this.alimentosValido = true;
                localStorage.setItem('alimentosCSV', evt.target.result);
                if (this.csvValido) continuarBtn.style.display = '';
                if (alimentosStatusIcon) {
                    alimentosStatusIcon.textContent = '✓';
                    alimentosStatusIcon.style.color = 'green';
                }
            } catch {
                alimentosError.textContent = 'El archivo CSV de alimentos no tiene el formato esperado.';
                this.alimentosValido = false;
                if (alimentosStatusIcon) {
                    alimentosStatusIcon.textContent = '✗';
                    alimentosStatusIcon.style.color = 'red';
                }
            }
        };
        reader.readAsText(file);
    }

    // Maneja el botón de continuar
    // Verifica que ambos archivos CSV sean válidos antes de continuar
    handleContinue() {
        const csvError = document.getElementById('csvError');
        const alimentosError = document.getElementById('alimentosError');
        if (!this.csvValido && !this.alimentosValido) {
            csvError.textContent = 'Debes cargar el archivo CSV de clientes.';
            alimentosError.textContent = 'Debes cargar el archivo CSV de alimentos.';
            return;
        }
        if (!this.csvValido) {
            csvError.textContent = 'Debes cargar el archivo CSV de clientes.';
            return;
        }
        if (!this.alimentosValido) {
            alimentosError.textContent = 'Debes cargar el archivo CSV de alimentos.';
            return;
        }
        window.location.href = 'index.html';
    }
}

// Inicializar la clase al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    new CargaCSV();
});
