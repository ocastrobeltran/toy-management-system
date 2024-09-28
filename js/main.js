import { getToys, addToy, updateToy, removeToy } from './data.js';

// Elementos del DOM
const mainContent = document.getElementById('main-content');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementsByClassName('close')[0];

// Navegación
document.getElementById('nav-form').addEventListener('click', showForm);
document.getElementById('nav-table').addEventListener('click', showTable);
document.getElementById('nav-reports').addEventListener('click', showReports);

// Cerrar modal
closeModal.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Función para obtener el valor de un elemento de forma segura
function getElementValueSafely(id, defaultValue = '') {
    const element = document.getElementById(id);
    return element ? element.value : defaultValue;
}

// Función para mostrar el formulario de ingreso de juguetes
function showForm() {
    const currentUser = localStorage.getItem('currentUser');
    mainContent.innerHTML = `
        <h2>Ingresar Juguete</h2>
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
                <label for="image">Imagen:</label>
                <input type="file" id="image" name="image" accept="image/*">
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
    
    // Manejo seguro del elemento de imagen
    let image = '';
    const imageElement = document.getElementById('image');
    if (imageElement && imageElement.files && imageElement.files[0]) {
        image = URL.createObjectURL(imageElement.files[0]);
    }
    
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
    const toy = [
        Date.now(), // ID único
        name,
        description,
        image,
        type,
        origin,
        arrivalDate,
        status,
        tags
    ];

    // Agregar juguete
    addToy(currentUser, toy);

    alert('Juguete guardado con éxito!');
    e.target.reset();
    showTable(); // Actualizar la tabla 
    
    console.log(toy)
}

// Función para mostrar la tabla de juguetes
function showTable() {
    const currentUser = localStorage.getItem('currentUser');
    const toys = getToys(currentUser);
    const itemsPerPage = 10;
    let currentPage = 1;

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
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedToys = filteredToys.slice(start, end);
    
        let tableHTML = `
            <h2>Lista de Juguetes</h2>
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
            const toyDate = new Date(toy[6]);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const canGift = ['Nuevo', 'Buen estado', 'Aun funciona'].includes(toy[7]) && toyDate <= oneYearAgo;
            const canDiscard = toy[7] === 'Dañado';
    
            tableHTML += `
                <tr>
                    <td>${toy[1]}</td>
                    <td>${toy[4]}</td>
                    <td>
                        <select class="status-select" data-id="${toy[0]}">
                            <option value="Nuevo" ${toy[7] === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
                            <option value="Buen estado" ${toy[7] === 'Buen estado' ? 'selected' : ''}>Buen estado</option>
                            <option value="Aun funciona" ${toy[7] === 'Aun funciona' ? 'selected' : ''}>Aun funciona</option>
                            <option value="Dañado" ${toy[7] === 'Dañado' ? 'selected' : ''}>Dañado</option>
                        </select>
                    </td>
                    <td>${toy[6]}</td>
                    <td>${toy[8].join(', ')}</td>
                    <td>
                        <button class="details-button" data-id="${toy[0]}">Ver Detalles</button>
                        <button class="action-button" data-id="${toy[0]}" data-can-gift="${canGift}" data-can-discard="${canDiscard}" ${!canGift && !canDiscard ? 'disabled' : ''}>
                            ${canGift ? 'Regalar' : (canDiscard ? 'Botar' : 'No disponible')}
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
            paginationHTML += `<button onclick="changePage(${i})" ${i === page ? 'disabled' : ''}>${i}</button>`;
        }
        paginationHTML += '</div>';
    
        mainContent.innerHTML = tableHTML + paginationHTML;
    
        // Agregar event listeners después de renderizar la tabla
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', function() {
                changeStatus(this.getAttribute('data-id'), this.value);
            });
        });
    
        document.querySelectorAll('.details-button').forEach(button => {
            button.addEventListener('click', function() {
                showDetails(this.getAttribute('data-id'));
            });
        });
    
        document.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const canGift = this.getAttribute('data-can-gift') === 'true';
                const canDiscard = this.getAttribute('data-can-discard') === 'true';
                performAction(id, canGift, canDiscard);
            });
        });
    }

    function filterToys() {
        const currentUser = localStorage.getItem('currentUser');
        const toys = getToys(currentUser);
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('filter-type')?.value || '';
        const statusFilter = document.getElementById('filter-status')?.value || '';
    
        return toys.filter(toy => {
            const matchesSearch = toy[1].toLowerCase().includes(searchTerm) ||
                                  toy[2].toLowerCase().includes(searchTerm) ||
                                  toy[8].some(tag => tag.toLowerCase().includes(searchTerm));
            const matchesType = typeFilter === '' || toy[4] === typeFilter;
            const matchesStatus = statusFilter === '' || toy[7] === statusFilter;
    
            return matchesSearch && matchesType && matchesStatus;
        });
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

    console.log(toys)
    console.log(currentUser)
}

// Función para realizar una acción en un juguete (regalar o botar)
function performAction(id, canGift, canDiscard) {
    const currentUser = localStorage.getItem('currentUser');
    const toy = getToys(currentUser).find(toy => toy[0] === parseInt(id));
    if (toy) {
        if (canDiscard) {
            if (confirm('¿Estás seguro de que quieres botar este juguete?\n\nCondición cumplida: El juguete está dañado.')) {
                removeToy(currentUser, parseInt(id));
                showTable();
            }
        } else if (canGift) {
            if (confirm(`¿Estás seguro de que quieres regalar este juguete?\n\nCondiciones cumplidas:\n- El juguete está en estado: ${toy[7]}\n- El juguete tiene más de un año de antigüedad (Fecha de llegada: ${toy[6]})`)) {
                removeToy(currentUser, parseInt(id));
                showTable();
            }
        } else {
            alert('No se puede realizar ninguna acción con este juguete en este momento.\n\nCondiciones para regalar:\n- El juguete debe estar en estado Nuevo, Buen estado o Aun funciona\n- El juguete debe tener más de un año de antigüedad\n\nCondición para botar:\n- El juguete debe estar en estado Dañado');
        }
    }
}

// Función para cambiar el estado de un juguete
function changeStatus(id, newStatus) {
    const currentUser = localStorage.getItem('currentUser');
    const toys = getToys(currentUser);
    const toyIndex = toys.findIndex(toy => toy[0] === parseInt(id));
    
    if (toyIndex !== -1) {
        toys[toyIndex][7] = newStatus;
        updateToy(currentUser, parseInt(id), { status: newStatus });
        
        // Actualizar la vista
        const filteredToys = filterToys();
        renderTable(1, filteredToys);
    }
}

// Función para mostrar detalles de un juguete
function showDetails(id) {
    const currentUser = localStorage.getItem('currentUser');
    const toy = getToys(currentUser).find(toy => toy[0] === parseInt(id));
    if (toy) {
        modalBody.innerHTML = `
            <h3>${toy[1]}</h3>
            <img src="${toy[3]}" alt="${toy[1]}" style="max-width: 200px;">
            <p><strong>Estado:</strong> ${toy[7]}</p>
            <p><strong>Tipo:</strong> ${toy[4]}</p>
            <p><strong>Descripción:</strong> ${toy[2]}</p>
            <p><strong>Origen:</strong> ${toy[5]}</p>
            <p><strong>Fecha de llegada:</strong> ${toy[6]}</p>
            <p><strong>Etiquetas:</strong> ${toy[8].join(', ')}</p>
        `;
        modal.style.display = "block";
    }
}

// Función para mostrar reportes
function showReports() {
    const currentUser = localStorage.getItem('currentUser');
    const toys = getToys(currentUser);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Obtener años únicos de los juguetes
    const years = [...new Set(toys.map(toy => new Date(toy[6]).getFullYear()))].sort((a, b) => b - a);

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

        <div class="analysis-graphs">
            <canvas id="toyTypesChart"></canvas>
            <canvas id="toyStatusChart"></canvas>
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
            const date = new Date(toy[6]);
            const toyYear = date.getFullYear();
            const toyMonth = date.getMonth() + 1;

            // Juguetes por Mes y Año
            if (toyYear === selectedYear && toyMonth === selectedMonth) {
                const key = `${toyMonth}-${toyYear}`;
                toysByMonthYear[key] = (toysByMonthYear[key] || 0) + 1;
            }

            // Otros reportes
            toysByStatus[toy[7]] = (toysByStatus[toy[7]] || 0) + 1;
            toysByOrigin[toy[5]] = (toysByOrigin[toy[5]] || 0) + 1;
            toysByType[toy[4]] = (toysByType[toy[4]] || 0) + 1;

            if (toy[7] === 'Dañado') damagedToys++;
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

    yearSelect.addEventListener('change', generateReports);
    monthSelect.addEventListener('change', generateReports);

    generateReports();
}

// Función para generar gráficos
function generateCharts(toysByType, toysByStatus) {
    // Destruir gráficos existentes si los hay
    if (window.toyTypesChart instanceof Chart) {
        window.toyTypesChart.destroy();
    }
    if (window.toyStatusChart instanceof Chart) {
        window.toyStatusChart.destroy();
    }

    const ctx1 = document.getElementById('toyTypesChart').getContext('2d');
    const ctx2 = document.getElementById('toyStatusChart').getContext('2d');

    // Gráfico de tipos de juguetes
    window.toyTypesChart = new Chart(ctx1, {
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
    window.toyStatusChart = new Chart(ctx2, {
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

// Agregar event listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    document.getElementById('logout-button').addEventListener('click', handleLogout);
});

// // Manejador de errores global
// window.addEventListener('error', function(event) {
//     console.error('Caught error:', event.error);
//     // Puedes agregar aquí lógica adicional para manejar errores específicos
// });

showForm(); // Mostrar formulario por defecto