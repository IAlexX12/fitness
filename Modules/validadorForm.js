// =====================
// Clase para Validación de Formularios (expuesta en window.ValidadorForm)
// =====================
(function(global) {
    const configValidacion = {
        nombre: {
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            mensaje: 'Solo se permiten letras y espacios (sin números ni símbolos)'
        },
        altura: { min: 100, max: 250, mensaje: 'Debe ser entre 100 y 250 cm' },
        peso: { min: 30, max: 300, mensaje: 'Debe ser entre 30 y 300 kg' },
        edad: { min: 15, max: 120, mensaje: 'Debe ser entre 15 y 120 años' },
        grasa: { min: 1, max: 60, mensaje: 'Debe ser entre 1% y 60%' },
        porcentajeObjetivo: { min: 0, max: 30, mensaje: 'El porcentaje debe estar entre 0% y 30%' }
    };

    function validarCampo(input) {
        const id = input.id;
        const valor = input.value.trim();
        const feedback = document.querySelector(`.${id}-feedback`);

        feedback.textContent = '';
        input.classList.remove('is-invalid');

        if (valor === '') {
            feedback.textContent = 'Este campo es obligatorio';
            input.classList.add('is-invalid');
            return false;
        }

        if (id === 'nombre') {
            if (!configValidacion.nombre.regex.test(valor)) {
                feedback.textContent = configValidacion.nombre.mensaje;
                input.classList.add('is-invalid');
                return false;
            }
            return true;
        }

        const numero = parseInt(valor);
        const config = configValidacion[id];
        if (numero < config.min || numero > config.max) {
            feedback.textContent = config.mensaje;
            input.classList.add('is-invalid');
            return false;
        }
        return true;
    }

    function validarCampoEdicion(input) {
        const idOriginal = input.id.replace('edit', '').toLowerCase();
        const valor = input.value.trim();
        const feedback = document.querySelector(`.${input.id}-feedback`);
        if (!feedback) return true;
        feedback.textContent = '';
        input.classList.remove('is-invalid');
        if (input.required && valor === '') {
            feedback.textContent = 'Este campo es obligatorio';
            input.classList.add('is-invalid');
            return false;
        }
        if (idOriginal === 'nombre') {
            if (!configValidacion.nombre.regex.test(valor)) {
                feedback.textContent = configValidacion.nombre.mensaje;
                input.classList.add('is-invalid');
                return false;
            }
            return true;
        }
        const numero = parseInt(valor);
        const config = configValidacion[idOriginal];
        if (config) {
            if (numero < config.min || numero > config.max) {
                feedback.textContent = config.mensaje;
                input.classList.add('is-invalid');
                return false;
            }
        } else if (idOriginal === 'porcentajeobjetivo') {
            if (numero < 0 || numero > 30) {
                feedback.textContent = 'El porcentaje debe estar entre 0% y 30%';
                input.classList.add('is-invalid');
                return false;
            }
        }
        return true;
    }

    function validarFormularioCompleto() {
        let valido = true;
        const campos = ['nombre', 'altura', 'peso', 'edad', 'grasa', 'porcentajeObjetivo'];
        campos.forEach(id => {
            const input = document.getElementById(id);
            if (!validarCampo(input)) {
                valido = false;
            }
        });
        // Validar alergias y alimentos solo si existen en el formulario principal
        const alergias = document.getElementById('alergias');
        if (alergias) {
            if (!alergias.selectedOptions.length) {
                alergias.classList.add('is-invalid');
                valido = false;
            } else {
                alergias.classList.remove('is-invalid');
            }
        }
        const alimentos = document.getElementById('alimentos');
        if (alimentos) {
            if (!alimentos.selectedOptions.length) {
                alimentos.classList.add('is-invalid');
                valido = false;
            } else {
                alimentos.classList.remove('is-invalid');
            }
        }
        return valido;
    }

    function validarFormularioEdicionCompleto() {
        let valido = true;
        const campos = ['editNombre', 'editAltura', 'editPeso', 'editEdad', 'editGrasa', 'editPorcentajeObjetivo'];
        campos.forEach(id => {
            const input = document.getElementById(id);
            if (!validarCampoEdicion(input)) {
                valido = false;
            }
        });
        const objetivo = document.getElementById('editObjetivo').value;
        if (objetivo !== 'mantenimiento') {
            const porcentajeInput = document.getElementById('editPorcentajeObjetivo');
            if (!validarCampoEdicion(porcentajeInput)) {
                valido = false;
            }
        }
        return valido;
    }

    global.ValidadorForm = {
        validarCampo,
        validarCampoEdicion,
        validarFormularioCompleto,
        validarFormularioEdicionCompleto,
        configValidacion
    };
})(window);
