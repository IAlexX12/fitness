// =====================
// Clase para gestionar el modal de edición de cliente
// =====================
(function(global) {
    function abrir(idx, clientes) {
        const cliente = clientes[idx];
        document.getElementById('editIndex').value = idx;
        document.getElementById('editNombre').value = cliente.nombre;
        document.getElementById('editAltura').value = cliente.altura;
        document.getElementById('editPeso').value = cliente.peso;
        document.getElementById('editEdad').value = cliente.edad;
        document.getElementById('editGrasa').value = cliente.grasa;

        // --- Autorellenar actividad ---
        const editActividad = document.getElementById('editActividad');
        let actividadValue = cliente.actividad;
        let foundActividad = false;
        for (let opt of editActividad.options) {
            if (opt.value === actividadValue) {
                editActividad.value = actividadValue;
                foundActividad = true;
                break;
            }
        }
        if (!foundActividad) {
            for (let opt of editActividad.options) {
                if (opt.text.trim().toLowerCase() === String(actividadValue).trim().toLowerCase()) {
                    editActividad.value = opt.value;
                    foundActividad = true;
                    break;
                }
            }
        }
        if (!foundActividad) {
            editActividad.selectedIndex = 0;
        }

        // --- Autorellenar objetivo ---
        const editObjetivo = document.getElementById('editObjetivo');
        let objetivoValue = cliente.objetivo;
        let foundObjetivo = false;
        for (let opt of editObjetivo.options) {
            if (opt.value === objetivoValue) {
                editObjetivo.value = objetivoValue;
                foundObjetivo = true;
                break;
            }
        }
        if (!foundObjetivo) {
            for (let opt of editObjetivo.options) {
                if (opt.text.trim().toLowerCase() === String(objetivoValue).trim().toLowerCase()) {
                    editObjetivo.value = opt.value;
                    foundObjetivo = true;
                    break;
                }
            }
        }
        if (!foundObjetivo) {
            editObjetivo.selectedIndex = 0;
        }

        document.getElementById('editPorcentajeObjetivo').value = cliente.porcentajeObjetivo;

        // Seleccionar alergias
        const editAlergias = document.getElementById('editAlergias');
        Array.from(editAlergias.options).forEach(opt => {
            opt.selected = (cliente.alergias || []).includes(opt.text);
        });

        // Seleccionar alimentos
        const editAlimentos = document.getElementById('editAlimentos');
        Array.from(editAlimentos.options).forEach(opt => {
            opt.selected = (cliente.alimentos || []).includes(opt.text);
        });

        // Si usas Choices.js, actualiza:
        if (editAlergias.choices) editAlergias.choices.setChoiceByValue(cliente.alergias || []);
        if (editAlimentos.choices) editAlimentos.choices.setChoiceByValue(cliente.alimentos || []);

        // Limpiar estados de validación al abrir el modal
        document.querySelectorAll('#editNombre, #editAltura, #editPeso, #editEdad, #editGrasa, #editPorcentajeObjetivo').forEach(input => {
            input.classList.remove('is-invalid');
            const feedback = document.querySelector(`.${input.id}-feedback`);
            if (feedback) feedback.textContent = '';
        });

        if (typeof toggleEditPorcentajeObjetivo === 'function') {
            toggleEditPorcentajeObjetivo();
        }

        const modal = new bootstrap.Modal(document.getElementById('editarClienteModal'));
        modal.show();
    }

    global.ModalEditarCliente = {
        abrir: abrir
    };
})(window);
