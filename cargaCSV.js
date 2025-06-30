// cargaCSV.js
// Clase para gestionar la carga y validación de los archivos CSV en la pantalla de inicio


// Inicializar la clase al cargar la página
window.addEventListener('DOMContentLoaded', async function () {
    // Ruta absoluta al archivo de alimentos
    const rutaAlimentos = "C:/Users/aleja/Downloads/alimentos.csv";
    try {
        // Usar fetch para cargar el archivo local (solo funcionará si el archivo está en el servidor o en entorno local con permisos)
        const response = await fetch(rutaAlimentos);
        if (!response.ok) throw new Error('No se pudo cargar el archivo de alimentos');
        const text = await response.text();
        // Guardar en localStorage
        localStorage.setItem('alimentosCSV', text);
    } catch (err) {
        alert('Error cargando el archivo de alimentos: ' + err.message);
    }
});