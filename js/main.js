// Elementos del DOM
const mainContent = document.getElementById('main-content');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementsByClassName('close')[0];

// Navegación
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('nav-form').addEventListener('click', showForm);
    document.getElementById('nav-table').addEventListener('click', showTable);
    document.getElementById('nav-reports').addEventListener('click', showReports);
});

// Cerrar modal
closeModal.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Función para mostrar el formulario
function showForm() {
    const currentUser = localStorage.getItem('currentUser');
    mainContent.innerHTML = `
        <h2>Ingresar Juguete para ${currentUser}</h2>
        <form id="toy-form">
            <div>
                <label for="name">Nombre:</label>
                <input type="text" id="name" required>
            </div>
            <div>
                <label for="description">Descripción:</label>
                <textarea id="description" required></textarea>
            </div>
            <div>
                <label for="images">Imágenes:</label>
                <input type="file" id="images" accept="image/*" multiple required>
            </div>
            <div>
                <label for="type">Tipo:</label>
                <select id="type" required>
                    <option value="">Seleccione un tipo</option>
                    <option value="Muñeco">Muñeco</option>
                    <option value="Didáctico">Didáctico</option>
                    <option value="Auto">Auto</option>
                    <option value="Peluche">Peluche</option>
                    <option value="Maquillaje">Maquillaje</option>
                    <option value="Electrónico">Electrónico</option>
                    <option value="Electrodoméstico">Electrodoméstico</option>
                    <option value="Deportivo">Deportivo</option>
                </select>
            </div>
            <div>
                <label for="origin">Origen:</label>
                <select id="origin" required>
                    <option value="">Seleccione un origen</option>
                    <option value="Padres">Padres</option>
                    <option value="Familiar">Familiar</option>
                    <option value="Amigos">Amigos</option>
                    <option value="Navidad">Navidad</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
            <div>
                <label for="arrivalDate">Fecha de llegada:</label>
                <input type="date" id="arrivalDate" required>
            </div>
            <div>
                <label for="status">Estado:</label>
                <select id="status" required>
                    <option value="">Seleccione un estado</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Buen estado">Buen estado</option>
                    <option value="Aun funciona">Aun funciona</option>
                    <option value="Dañado">Dañado</option>
                </select>
            </div>
            <div>
                <label for="tags">Etiquetas (separadas por comas):</label>
                <input type="text" id="tags">
            </div>
            <button type="submit">Guardar Juguete</button>
        </form>
    `;

    document.getElementById('toy-form').addEventListener('submit', handleFormSubmit);
}

// Función para manejar el envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    const currentUser = localStorage.getItem('currentUser');

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const images = Array.from(document.getElementById('images').files).map(file => URL.createObjectURL(file));
    const type = document.getElementById('type').value;
    const origin = document.getElementById('origin').value;
    const arrivalDate = document.getElementById('arrivalDate').value;
    const status = document.getElementById('status').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    // Validar fecha
    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
    const selectedDate = new Date(arrivalDate);
    const today = new Date();

    if (selectedDate < sixYearsAgo || selectedDate > today) {
        alert('La fecha de llegada debe ser entre hace 6 años y hoy.');
        return;
    }

    // Crear objeto juguete
    const toy = {
        name,
        description,
        images,
        type,
        origin,
        arrivalDate,
        status,
        tags
    };

    // Agregar juguete
    addToy(currentUser, toy);

    alert('Juguete guardado con éxito!');
    e.target.reset();
    showTable();
}

// Función para mostrar la tabla de juguetes
// Función para mostrar la tabla de juguetes
function showTable() {
    const currentUser = localStorage.getItem('currentUser');
    const toys = getToys(currentUser);
    const itemsPerPage = 10;
    let currentPage = 1;

    // Create search and filter elements dynamically
    const searchFilterHTML = `
        <div id="search-filter" class="search-filter">
            <input type="text" id="search-input" placeholder="Buscar juguetes...">
            <select id="filter-type">
                <option value="">Todos los tipos</option>
                <option value="Muñeco">Muñeco</option>
                <option value="Didáctico">Didáctico</option>
                <option value="Auto">Auto</option>
                <option value="Peluche">Peluche</option>
                <option value="Maquillaje">Maquillaje</option>
                <option value="Electrónico">Electrónico</option>
                <option value="Electrodoméstico">Electrodoméstico</option>
                <option value="Deportivo">Deportivo</option>
            </select>
            <select id="filter-status">
                <option value="">Todos los estados</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Buen estado">Buen estado</option>
                <option value="Aun funciona">Aun funciona</option>
                <option value="Dañado">Dañado</option>
            </select>
            <button id="reset-filters">Limpiar Filtros</button>
        </div>
    `;

    function renderTable(page, filteredToys) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedToys = filteredToys.slice(start, end);

        let tableHTML = `
            <h2>Lista de Juguetes</h2>
            ${searchFilterHTML}
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Fecha de Llegada</th>
                        <th>Etiquetas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        paginatedToys.forEach(toy => {
            const toyDate = new Date(toy.arrivalDate);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const canGift = ['Nuevo', 'Buen estado', 'Aun funciona'].includes(toy.status) && toyDate <= oneYearAgo;
            const canDiscard = toy.status === 'Dañado';

            tableHTML += `
                <tr>
                    <td>${toy.name}</td>
                    <td>${toy.type}</td>
                    <td>
                        <select onchange="changeStatus(${toy.id}, this.value)">
                            <option value="Nuevo" ${toy.status === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
                            <option value="Buen estado" ${toy.status === 'Buen estado' ? 'selected' : ''}>Buen estado</option>
                            <option value="Aun funciona" ${toy.status === 'Aun funciona' ? 'selected' : ''}>Aun funciona</option>
                            <option value="Dañado" ${toy.status === 'Dañado' ? 'selected' : ''}>Dañado</option>
                        </select>
                    </td>
                    <td>${toy.arrivalDate}</td>
                    <td>${(toy.tags || []).join(', ')}</td>
                    <td>
                        <button onclick="showDetails(${toy.id})">Ver Detalles</button>
                        <button onclick="performAction(${toy.id})" ${!canGift && !canDiscard ? 'disabled' : ''} class="action-button">
                            ${canGift ? 'Regalar' : (canDiscard ? 'Botar' : 'No disponible')}
                            <span class="tooltip">
                                Condiciones para regalar:
                                 - Estado: Nuevo, Buen estado o Aun funciona
                                 - Más de un año de antigüedad
                                Condición para botar:
                                - Estado: Dañado
                            </span>
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        // Agregar paginación
        const totalPages = Math.ceil(filteredToys.length / itemsPerPage);
        let paginationHTML = '<div class="pagination">';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button onclick="changePage(${i})" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
        }
        paginationHTML += '</div>';

        mainContent.innerHTML = tableHTML + paginationHTML;

        // Add event listeners after rendering the table
        document.getElementById('search-input').addEventListener('input', filterToys);
        document.getElementById('filter-type').addEventListener('change', filterToys);
        document.getElementById('filter-status').addEventListener('change', filterToys);
        document.getElementById('reset-filters').addEventListener('click', resetFilters);
    }

    function filterToys() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const typeFilter = document.getElementById('filter-type').value;
        const statusFilter = document.getElementById('filter-status').value;

        const filteredToys = toys.filter(toy => {
            const matchesSearch = toy.name.toLowerCase().includes(searchTerm) ||
                                  toy.description.toLowerCase().includes(searchTerm) ||
                                  (toy.tags || []).some(tag => tag.toLowerCase().includes(searchTerm));
            const matchesType = typeFilter === '' || toy.type === typeFilter;
            const matchesStatus = statusFilter === '' || toy.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });

        renderTable(1, filteredToys);
    }

    function resetFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-status').value = '';
        renderTable(1, toys);
    }

    // Initial render
    renderTable(1, toys);

    // Función para cambiar de página
    window.changePage = function (page) {
        currentPage = page;
        filterToys();
    }
}

// Función para realizar una acción en un juguete
function performAction(id) {
    const toy = getToys().find(toy => toy[0] === id);
    if (toy) {
        const arrivalDate = new Date(toy[6]);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        if (toy[7] === 'Dañado') {
            if (confirm('¿Estás seguro de que quieres botar este juguete?\n\nCondición cumplida: El juguete está dañado.')) {
                removeToy(id);
                showTable();
            }
        } else if (['Nuevo', 'Buen estado', 'Aun funciona'].includes(toy[7]) && arrivalDate <= oneYearAgo) {
            if (confirm(`¿Estás seguro de que quieres regalar este juguete?\n\nCondiciones cumplidas:\n- El juguete está en estado: ${toy[7]}\n- El juguete tiene más de un año de antigüedad (Fecha de llegada: ${toy[6]})`)) {
                removeToy(id);
                showTable();
            }
        } else {
            alert('No se puede realizar ninguna acción con este juguete en este momento.\n\nCondiciones para regalar:\n- El juguete debe estar en estado Nuevo, Buen estado o Aun funciona\n- El juguete debe tener más de un año de antigüedad\n\nCondición para botar:\n- El juguete debe estar en estado Dañado');
        }
    }
}

// Función para cambiar el estado de un juguete
function changeStatus(id, newStatus) {
    updateToyStatus(id, newStatus);
    showTable();
}

// Función para mostrar detalles de un juguete
function showDetails(id) {
    const toy = getToys().find(toy => toy.id === id);
    if (toy) {
        modalBody.innerHTML = `
            <h3>${toy.name}</h3>
            <div class="gallery">
                ${toy.images.map(img => `<img src="${img}" alt="${toy.name}">`).join('')}
            </div>
            <p><strong>Estado:</strong> ${toy.status}</p>
            <p><strong>Tipo:</strong> ${toy.type}</p>
            <p><strong>Descripción:</strong> ${toy.description}</p>
            <p><strong>Origen:</strong> ${toy.origin}</p>
            <p><strong>Fecha de llegada:</strong> ${toy.arrivalDate}</p>
            <div class="tags">
                ${(toy.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="change-history">
                <h4>Historial de cambios:</h4>
                <ul>
                    ${toy.changeHistory.map(change => `
                        <li>
                            <strong>${new Date(change.date).toLocaleString()}:</strong>
                            ${change.action} - ${change.details}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        modal.style.display = "block";
    }
}

// Función para realizar una acción en un juguete
function performAction(id) {
    const toy = getToys().find(toy => toy.id === id);
    if (toy) {
        const arrivalDate = new Date(toy.arrivalDate);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        if (toy.status === 'Dañado') {
            if (confirm('¿Estás seguro de que quieres botar este juguete?\n\nCondición cumplida: El juguete está dañado.')) {
                removeToy(id);
                showTable();
            }
        } else if (['Nuevo', 'Buen estado', 'Aun funciona'].includes(toy.status) && arrivalDate <= oneYearAgo) {
            if (confirm(`¿Estás seguro de que quieres regalar este juguete?\n\nCondiciones cumplidas:\n- El juguete está en estado: ${toy.status}\n- El juguete tiene más de un año de antigüedad (Fecha de llegada: ${toy.arrivalDate})`)) {
                removeToy(id);
                showTable();
            }
        } else {
            alert('No se puede realizar ninguna acción con este juguete en este momento.\n\nCondiciones para regalar:\n- El juguete debe estar en estado Nuevo, Buen estado o Aun funciona\n- El juguete debe tener más de un año de antigüedad\n\nCondición para botar:\n- El juguete debe estar en estado Dañado');
        }
    }
}

// Función para mostrar reportes
function showReports() {
    const toys = getToys();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Obtener años únicos de los juguetes
    const years = [...new Set(toys.map(toy => new Date(toy.arrivalDate).getFullYear()))].sort((a, b) => b - a);

    let reportsHTML = `
        <h2>Reportes de Juguetes</h2>
        
        <div class="filters">
            <select id="yearSelect">
                ${years.map(year => `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`).join('')}
            </select>
            <select id="monthSelect">
                ${Array.from({ length: 12 }, (_, i) => i + 1).map(month =>
        `<option value="${month}" ${month === currentMonth ? 'selected' : ''}>
                        ${new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                    </option>`
    ).join('')}
            </select>
        </div>

        <div class="reports-grid">
            <div class="report-card" id="toysByMonthYear">
                <h3>Juguetes por Mes y Año</h3>
                <div class="report-content"></div>
            </div>
            <div class="report-card" id="toysByStatus">
                <h3>Juguetes por Estado</h3>
                <div class="report-content"></div>
            </div>
            <div class="report-card" id="damagedToys">
                <h3>Juguetes Dañados</h3>
                <div class="report-content"></div>
            </div>
            <div class="report-card" id="toysByOrigin">
                <h3>Juguetes por Origen</h3>
                <div class="report-content"></div>
            </div>
            <div class="report-card" id="toysByType">
                <h3>Juguetes por Tipo</h3>
                <div class="report-content"></div>
            </div>
        </div>

        <h3>Gráficas de Análisis</h3>
        <div class="analysis-graphs">
            <canvas id="toyTypesChart"></canvas>
            <canvas id="toyStatusChart"></canvas>
        </div>
    `;

    mainContent.innerHTML = reportsHTML;

    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');

    function generateReports() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedMonth = parseInt(monthSelect.value);

        const toysByMonthYear = {};
        const toysByStatus = {};
        const toysByOrigin = {};
        const toysByType = {};
        let damagedToys = 0;

        toys.forEach(toy => {
            const date = new Date(toy.arrivalDate);
            const toyYear = date.getFullYear();
            const toyMonth = date.getMonth() + 1;

            // Juguetes por Mes y Año
            if (toyYear === selectedYear && toyMonth === selectedMonth) {
                const key = `${toyMonth}-${toyYear}`;
                toysByMonthYear[key] = (toysByMonthYear[key] || 0) + 1;
            }

            // Otros reportes
            toysByStatus[toy.status] = (toysByStatus[toy.status] || 0) + 1;
            toysByOrigin[toy.origin] = (toysByOrigin[toy.origin] || 0) + 1;
            toysByType[toy.type] = (toysByType[toy.type] || 0) + 1;

            if (toy.status === 'Dañado') damagedToys++;
        });

        // Actualizar contenido de los reportes
        document.querySelector('#toysByMonthYear .report-content').innerHTML =
            Object.entries(toysByMonthYear).map(([key, value]) => `<p>${key}: ${value}</p>`).join('') || '<p>No hay juguetes para este mes y año</p>';

        document.querySelector('#toysByStatus .report-content').innerHTML =
            Object.entries(toysByStatus).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');

        document.querySelector('#damagedToys .report-content').innerHTML = `<p>Total: ${damagedToys}</p>`;

        document.querySelector('#toysByOrigin .report-content').innerHTML =
            Object.entries(toysByOrigin).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');

        document.querySelector('#toysByType .report-content').innerHTML =
            Object.entries(toysByType).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');

        // Generar gráficos
        generateCharts(toysByType, toysByStatus);
    }

    function generateCharts(toysByType, toysByStatus) {
        // Gráfico de tipos de juguetes
        new Chart(document.getElementById('toyTypesChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(toysByType),
                datasets: [{
                    label: 'Cantidad de Juguetes',
                    data: Object.values(toysByType),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Tipos de Juguetes'
                    }
                }
            }
        });

        // Gráfico de estados de juguetes
        new Chart(document.getElementById('toyStatusChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(toysByStatus),
                datasets: [{
                    data: Object.values(toysByStatus),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Estados de Juguetes'
                    }
                }
            }
        });
    }

    yearSelect.addEventListener('change', generateReports);
    monthSelect.addEventListener('change', generateReports);

    generateReports();
}

// Iniciar mostrando el formulario
showForm();

// Verificar autenticación
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'auth.html';
    } else {
        document.getElementById('username-display').textContent = `Bienvenido, ${currentUser}`;
        document.getElementById('logout-button').style.display = 'inline-block';
    }
}

// Manejar cierre de sesión
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}