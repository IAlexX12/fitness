// =====================
// Cálculos (expuestos en window.Calculos)
// =====================
(function(global) {
    function calcularCampos({ altura, peso, edad, grasa, actividad, objetivo, porcentajeObjetivo }) {
        const masaGrasa = peso * (grasa / 100);
        const masaMagra = peso - masaGrasa;
        const imc = peso / Math.pow(altura / 100, 2);
        const mb = 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * edad);
        const caloriasMantenimiento = mb * actividad;
        let caloriasObjetivo = caloriasMantenimiento;
        const factor = porcentajeObjetivo / 100;

        switch (objetivo) {
            case 'deficit':
                caloriasObjetivo -= caloriasMantenimiento * factor;
                break;
            case 'volumen':
                caloriasObjetivo += caloriasMantenimiento * factor;
                break;
            case 'mantenimiento':
                caloriasObjetivo = caloriasMantenimiento;
                porcentajeObjetivo = 0;
                break;
            case 'recomposicion':
                caloriasObjetivo -= caloriasMantenimiento * (factor / 2);
                break;
            default:
                caloriasObjetivo = caloriasMantenimiento;
        }

        return {
            masaMagra: masaMagra.toFixed(1),
            masaGrasa: masaGrasa.toFixed(1),
            imc: imc.toFixed(1),
            mb: mb.toFixed(0),
            caloriasObjetivo: Math.round(caloriasObjetivo),
            porcentajeObjetivo: objetivo === 'mantenimiento' ? 0 : porcentajeObjetivo
        };
    }

    global.Calculos = {
        calcularCampos: calcularCampos
    };
})(window);
