window.addEventListener('DOMContentLoaded', async function () {
    // Solo cargar si no está ya en localStorage
    if (!localStorage.getItem('clasificadosCSV')) {
        try {
            const response = await fetch('Data/alimentos.csv');
            if (!response.ok) throw new Error('No se pudo cargar alimentos.csv');
            const text = await response.text();
            localStorage.setItem('clasificadosCSV', text);
        } catch (err) {
            alert('Error cargando alimentos.csv: ' + err.message);
        }
    }
});