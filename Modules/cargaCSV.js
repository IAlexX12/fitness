// cargaCSV.js
// Clase para gestionar la carga y validación de los archivos CSV en la pantalla de inicio

class CargaCSV {
    constructor() {
        this.csvClientesValido = false;
        this.csvClasificadosValido = false;
        this.init();
    }

    init() {
        // Elementos para clientes
        const csvInput = document.getElementById('csvInicialInput');
        const csvError = document.getElementById('csvError');
        const csvTick = document.getElementById('csvTick');
        const csvCross = document.getElementById('csvCross');
        // Elementos para clasificados
        const clasificadosInput = document.getElementById('clasificadosCSV');
        const clasificadosError = document.getElementById('clasificadosError');
        const clasificadosTick = document.getElementById('clasificadosTick');
        const clasificadosCross = document.getElementById('clasificadosCross');
        // Botón continuar
        const continuarBtn = document.getElementById('continuarBtn');
        if (!csvInput || !continuarBtn || !csvError || !clasificadosInput || !clasificadosError) return;

        csvInput.addEventListener('change', (e) => this.handleClientesCSV(e, csvError, csvTick, csvCross, continuarBtn));
        clasificadosInput.addEventListener('change', (e) => this.handleAlimentosCSV(e, clasificadosError, clasificadosTick, clasificadosCross, continuarBtn));
        continuarBtn.addEventListener('click', () => this.handleContinue());
        // Si ya hay archivos válidos en localStorage, mostrar ticks
        this.checkLocalStorage(csvTick, csvCross, clasificadosTick, clasificadosCross);
    }

    handleClientesCSV(e, csvError, csvTick, csvCross, continuarBtn) {
        const file = e.target.files[0];
        csvError.textContent = '';
        csvTick.style.display = 'none';
        csvCross.style.display = 'none';
        this.csvClientesValido = false;
        this.updateContinueBtn(continuarBtn);
        if (!file) return;
        if (!file.name.endsWith('.csv')) {
            csvError.textContent = 'Por favor, selecciona un archivo CSV válido.';
            csvCross.style.display = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const lines = evt.target.result.trim().split('\n');
                const expectedHeader = 'Nombre,Altura,Peso,Edad,% Graso,M. Magra,M. Grasa,IMC,MB,Calorías Objetivo,Actividad,Objetivo,Alergias,Fecha alta';
                const fileHeader = lines[0].trim();
                if (fileHeader !== expectedHeader) {
                    throw new Error('El archivo CSV no tiene el formato esperado.');
                }
                
                this.csvClientesValido = true;
                csvTick.style.display = '';
                csvCross.style.display = 'none';
                localStorage.setItem('clientesCSV', evt.target.result);
            } catch (err) {
                csvError.textContent = 'El archivo CSV no tiene el formato esperado.';
                csvCross.style.display = '';
                csvTick.style.display = 'none';
                this.csvClientesValido = false;
            }
            this.updateContinueBtn(continuarBtn);
        };
        reader.readAsText(file);
    }

    handleAlimentosCSV(e, clasificadosError, clasificadosTick, clasificadosCross, continuarBtn) {
        const file = e.target.files[0];
        clasificadosError.textContent = '';
        clasificadosTick.style.display = 'none';
        clasificadosCross.style.display = 'none';
        this.csvClasificadosValido = false;
        this.updateContinueBtn(continuarBtn);
        if (!file) return;
        if (!file.name.endsWith('.csv')) {
            clasificadosError.textContent = 'Por favor, selecciona un archivo CSV válido.';
            clasificadosCross.style.display = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const csv = evt.target.result.trim();
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const required = ['nombre','categoria','gramaje','esproteico','escarbohidrato','esgrasa'];
                if (!required.every(h => headers.includes(h))) throw new Error();
                // Validar que haya al menos una fila de datos
                if (lines.length < 2) throw new Error();
                this.csvClasificadosValido = true;
                clasificadosTick.style.display = '';
                clasificadosCross.style.display = 'none';
                localStorage.setItem('clasificadosCSV', csv);
            } catch {
                clasificadosError.textContent = 'El archivo CSV no tiene el formato esperado.';
                clasificadosCross.style.display = '';
                clasificadosTick.style.display = 'none';
                this.csvClasificadosValido = false;
            }
            this.updateContinueBtn(continuarBtn);
        };
        reader.readAsText(file);
    }

    updateContinueBtn(continuarBtn) {
        // Solo el CSV de alimentos es obligatorio
        continuarBtn.style.display = this.csvClasificadosValido ? '' : 'none';
    }

    handleContinue() {
        // Solo el CSV de alimentos es obligatorio
        if (this.csvClasificadosValido) {
            window.location.href = 'index.html';
        }
    }

    checkLocalStorage(csvTick, csvCross, clasificadosTick, clasificadosCross) {
        // Si ya hay archivos válidos en localStorage, mostrar ticks solo si son realmente válidos
        const clientesCSV = localStorage.getItem('clientesCSV');
        if (clientesCSV) {
            this.csvClientesValido = true;
            csvTick.style.display = '';
            csvCross.style.display = 'none';
        }
        const clasificadosCSV = localStorage.getItem('clasificadosCSV');
        if (clasificadosCSV) {
            // Validar headers y al menos una fila de datos
            try {
                const lines = clasificadosCSV.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const required = ['nombre','categoria','gramaje','esproteico','escarbohidrato','esgrasa'];
                if (!required.every(h => headers.includes(h))) throw new Error();
                if (lines.length < 2) throw new Error();
                this.csvClasificadosValido = true;
                clasificadosTick.style.display = '';
                clasificadosCross.style.display = 'none';
            } catch {
                this.csvClasificadosValido = false;
                clasificadosTick.style.display = 'none';
                clasificadosCross.style.display = '';
            }
        }
        this.updateContinueBtn(document.getElementById('continuarBtn'));
    }
}

// Inicializar la clase al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    new CargaCSV();
});