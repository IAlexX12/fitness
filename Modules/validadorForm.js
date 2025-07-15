// =====================
// Clase para Validación de Formularios (expuesta en window.ValidadorForm)
// =====================
(function (global) {
    const configValidacion = {
        nombre: {
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            mensaje: 'Solo se permiten letras y espacios (sin números ni símbolos)'
        },
        altura: { min: 100, max: 250, mensaje: 'Debe ser entre 100 y 250 cm' },
        peso: { min: 30, max: 300, mensaje: 'Debe ser entre 30 y 300 kg', decimal: true },
        edad: { min: 15, max: 120, mensaje: 'Debe ser entre 15 y 120 años' },
        grasa: { min: 1, max: 60, mensaje: 'Debe ser entre 1% y 60%', decimal: true },
        porcentajeObjetivo: { min: 0, max: 30, mensaje: 'El porcentaje debe estar entre 0% y 30%' },
        // Validaciones para campos de la calculadora de grasa YMCA
        alturaYMCA: { min: 100, max: 250, mensaje: 'Debe ser entre 100 y 250 cm' },
        pesoYMCA: { min: 30, max: 300, mensaje: 'Debe ser entre 30 y 300 kg', decimal: true },
        cinturaYMCA: { min: 30, max: 200, mensaje: 'Debe ser entre 30 y 200 cm' },
        cuelloYMCA: { min: 20, max: 80, mensaje: 'Debe ser entre 20 y 80 cm' },
        caderaYMCA: { min: 50, max: 300, mensaje: 'Debe ser entre 50 y 300 cm' }
    };



    function validarCampo(input) {
        const id = input.id;
        const valor = input.value.trim();
        const feedback = document.querySelector(`.${id}-feedback`) || input.nextElementSibling;

        // Limpia estados anteriores
        if (feedback) {
            feedback.textContent = '';
            feedback.style.display = 'none';
        }
        input.classList.remove('is-invalid');

        if (valor === '') {
            if (feedback) {
                feedback.textContent = 'Este campo es obligatorio';
                feedback.style.display = 'block';
            }
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

        // Validación para campos numéricos
        const config = configValidacion[id];
        if (config) {
            let numero;
            if (config.decimal) {
                if (!/^\d*\.?\d+$/.test(valor)) {
                    if (feedback) {
                        feedback.textContent = 'Debe ser un número decimal válido';
                        feedback.style.display = 'block';
                    }
                    input.classList.add('is-invalid');
                    return false;
                }
                numero = parseFloat(valor);
            } else {
                if (!/^\d+$/.test(valor)) {
                    if (feedback) {
                        feedback.textContent = 'Debe ser un número entero';
                        feedback.style.display = 'block';
                    }
                    input.classList.add('is-invalid');
                    return false;
                }
                numero = parseInt(valor);
            }

            if (isNaN(numero)) {
                if (feedback) {
                    feedback.textContent = 'Debe ser un número válido';
                    feedback.style.display = 'block';
                }
                input.classList.add('is-invalid');
                return false;
            }

            if (numero < config.min || numero > config.max) {
                if (feedback) {
                    feedback.textContent = config.mensaje; // Muestra el mensaje configurado
                    feedback.style.display = 'block';
                }
                input.classList.add('is-invalid');
                return false;
            }
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

        // Obtener configuración del campo
        const config = configValidacion[idOriginal];
        if (!config) {
            if (idOriginal === 'porcentajeobjetivo') {
                // Validación especial para porcentaje objetivo
                const numero = parseInt(valor);
                if (isNaN(numero)) {
                    feedback.textContent = 'Debe ser un número entero';
                    input.classList.add('is-invalid');
                    return false;
                }
                if (numero < 0 || numero > 30) {
                    feedback.textContent = 'El porcentaje debe estar entre 0% y 30%';
                    input.classList.add('is-invalid');
                    return false;
                }
            }
            return true;
        }

        // Validar formato numérico
        let numero;
        if (config.decimal) {
            if (!/^\d*\.?\d+$/.test(valor)) {
                feedback.textContent = 'Debe ser un número válido (ej: 175.5)';
                input.classList.add('is-invalid');
                return false;
            }
            numero = parseFloat(valor);
        } else {
            if (!/^\d+$/.test(valor)) {
                feedback.textContent = 'Debe ser un número entero';
                input.classList.add('is-invalid');
                return false;
            }
            numero = parseInt(valor);
        }

        // Validar rango
        if (numero < config.min || numero > config.max) {
            feedback.textContent = config.mensaje;
            input.classList.add('is-invalid');
            return false;
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

    // Validacion de campos de la calculadora de grasa YMCA
    function validarCalculadoraYMCA() {
        let valido = true;
        const campos = ['alturaYMCA', 'pesoYMCA', 'cinturaYMCA', 'cuelloYMCA'];

        // Validar campos comunes
        campos.forEach(id => {
            const input = document.getElementById(id);
            if (!validarCampo(input)) {
                valido = false;
            }
        });

        // Validar cadera solo si es mujer
        const sexo = document.getElementById('sexoYMCA').value;
        if (sexo === 'mujer') {
            const caderaInput = document.getElementById('caderaYMCA');
            if (!validarCampo(caderaInput)) {
                valido = false;
            }
        }

        return valido;
    }

    function configurarValidacionesCalculadora() {
        document.querySelectorAll('#alturaYMCA, #pesoYMCA, #cinturaYMCA, #cuelloYMCA, #caderaYMCA').forEach(input => {
            input.addEventListener('input', function () {
                // Guarda la posición del cursor
                const cursorPosition = this.selectionStart;

                // Permite números y un solo punto decimal
                let newValue = this.value.replace(/[^0-9.]/g, '');

                // Maneja múltiples puntos decimales
                const pointCount = (newValue.match(/\./g) || []).length;
                if (pointCount > 1) {
                    const parts = newValue.split('.');
                    newValue = parts[0] + '.' + parts.slice(1).join('');
                }

                // Si el valor cambió, actualiza el campo
                if (this.value !== newValue) {
                    this.value = newValue;
                    // Restaura la posición del cursor
                    this.setSelectionRange(cursorPosition, cursorPosition);
                }

                ValidadorForm.validarCampo(this);
            });

            // Validar al perder el foco
            input.addEventListener('blur', function () {
                ValidadorForm.validarCampo(this);
            });
        });
    }

    global.ValidadorForm = {
        validarCampo,
        validarCampoEdicion,
        validarFormularioCompleto,
        validarFormularioEdicionCompleto,
        validarCalculadoraYMCA,
        configurarValidacionesCalculadora,
        configValidacion
    };
})(window);
