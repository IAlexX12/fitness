// TablaClientes.js
// Clase para renderizar la tabla de clientes de forma reutilizable y estática

class TablaClientes {
    /**
     * Renderiza la tabla de clientes en el DOM.
     * @param {Array} clientes - Array de objetos cliente
     */
    static renderTabla(clientes) {
        const tbody = document.querySelector('#clientesTable tbody');
        tbody.innerHTML = '';
        // Actualiza el contador clientes
        const contador = document.getElementById('contadorClientesBadge');
        if (contador) contador.textContent = clientes.length;
        // Mostrar mensaje de no hay clientes
        if (clientes.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="16" class="text-center">
                    <div class="alert alert-info m-0 py-2" style="font-size:1.1rem;">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        <strong>No hay clientes registrados</strong>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
            return;
        }
        clientes.forEach((cliente, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.altura}</td>
                <td>${cliente.peso}</td>
                <td>${cliente.edad}</td>
                <td>${cliente.grasa}</td>
                <td>${cliente.masaMagra}</td>
                <td>${cliente.masaGrasa}</td>
                <td>${cliente.imc}</td>
                <td>${cliente.mb}</td>
                <td>${cliente.caloriasObjetivo}</td>
                <td>${cliente.actividad}</td>
                <td>${cliente.objetivo}</td>
                <td>${cliente.porcentajeObjetivo}</td>
                <td>${(cliente.alergias || []).join(', ')}</td>
                <td>${(cliente.alimentos || []).join(', ')}</td>
                <td>${cliente.fechaAlta || '-'}</td>
                <td>
                <button class="btn btn-outline-info btn-sm me-1" title="Informe" onclick="generarInforme(${idx})">
                    <i class="bi bi-file-earmark-text"></i>
                    <span class="d-none d-md-inline">Informe</span>
                </button>
                <button class="btn btn-outline-warning btn-sm me-1" title="Editar" onclick="abrirEditarCliente(${idx})">
                    <i class="bi bi-pencil"></i>
                    <span class="d-none d-md-inline">Editar</span>
                </button>
                <button class="btn btn-outline-danger btn-sm" title="Borrar" onclick="borrarCliente(${idx})">
                    <i class="bi bi-trash"></i>
                    <span class="d-none d-md-inline">Borrar</span>
                </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Configura el orden de la tabla por columnas (ASC/DESC)
     * @param {Array} clientes - Array de clientes (referencia global)
     */
    static configurarOrdenTabla(clientes) {
        document.querySelectorAll('#clientesTable th[data-sort]').forEach(th => {
            th.style.cursor = 'pointer';
            th.addEventListener('click', function () {
                const columna = th.getAttribute('data-sort');
                if (window.ordenColumna === columna) {
                    window.ordenAscendente = !window.ordenAscendente;
                } else {
                    window.ordenColumna = columna;
                    window.ordenAscendente = true;
                }
                TablaClientes.ordenarClientes(clientes, columna, window.ordenAscendente);
                TablaClientes.renderTabla(clientes);
                TablaClientes.actualizarIconosOrden();
            });
        });
    }

    /**
     * Ordena el array de clientes por columna y orden
     */
    static ordenarClientes(clientes, columna, asc) {
        clientes.sort((a, b) => {
            let valA = a[columna];
            let valB = b[columna];
            if (columna === 'fechaAlta') {
                valA = new Date(valA);
                valB = new Date(valB);
            }
            if (!isNaN(valA) && !isNaN(valB) && valA !== '' && valB !== '') {
                valA = Number(valA);
                valB = Number(valB);
            }
            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
        });
    }

    /**
     * Actualiza los iconos de orden en los encabezados de la tabla
     */
    static actualizarIconosOrden() {
        document.querySelectorAll('#clientesTable th[data-sort]').forEach(th => {
            const icon = th.querySelector('.sort-icon');
            const columna = th.getAttribute('data-sort');
            th.classList.remove('table-active');
            if (columna === window.ordenColumna) {
                th.classList.add('table-active');
                if (window.ordenAscendente) {
                    icon.className = 'bi bi-arrow-up ms-1 sort-icon';
                } else {
                    icon.className = 'bi bi-arrow-down ms-1 sort-icon';
                }
            } else {
                icon.className = 'bi bi-arrow-down-up ms-1 sort-icon';
            }
        });
    }
}

// Hacer la clase accesible globalmente
window.TablaClientes = TablaClientes;
