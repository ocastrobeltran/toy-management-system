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

// Función para mostrar el formulario
function showForm() {
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
                <input type="file" id="image" accept="image/*" required>
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
            <button type="submit">Guardar Juguete</button>
        </form>
    `;

    document.getElementById('toy-form').addEventListener('submit', handleFormSubmit);
}

// Función para manejar el envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];
    const type = document.getElementById('type').value;
    const origin = document.getElementById('origin').value;
    const arrivalDate = document.getElementById('arrivalDate').value;
    const status = document.getElementById('status').value;

    // Validar fecha
    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
    const selectedDate = new Date(arrivalDate);
    const today = new Date();

    if (selectedDate < sixYearsAgo || selectedDate > today) {
        alert('La fecha de llegada debe ser entre hace 6 años y hoy.');
        return;
    }

    // Crear arreglo de juguete
    const toy = [
        Date.now(),
        name,
        description,
        URL.createObjectURL(image),
        type,
        origin,
        arrivalDate,
        status
    ];

    // Agregar juguete
    addToy(toy);

    alert('Juguete guardado con éxito!');
    e.target.reset();
}

// Función para mostrar la tabla de juguetes
// Función para mostrar la tabla de juguetes
// Función para mostrar la tabla de juguetes
function showTable() {
    const toys = getToys();
    const itemsPerPage = 10;
    let currentPage = 1;

    function renderTable(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedToys = toys.slice(start, end);

        let tableHTML = `
            <h2>Lista de Juguetes</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Fecha de Llegada</th>
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
                    <td>${toy[0]}</td>
                    <td>${toy[1]}</td>
                    <td>${toy[4]}</td>
                    <td>
                        <select onchange="changeStatus(${toy[0]}, this.value)">
                            <option value="Nuevo" ${toy[7] === 'Nuevo' ? 'selected' : ''}>Nuevo</option>
                            <option value="Buen estado" ${toy[7] === 'Buen estado' ? 'selected' : ''}>Buen estado</option>
                            <option value="Aun funciona" ${toy[7] === 'Aun funciona' ? 'selected' : ''}>Aun funciona</option>
                            <option value="Dañado" ${toy[7] === 'Dañado' ? 'selected' : ''}>Dañado</option>
                        </select>
                    </td>
                    <td>${toy[6]}</td>
                    <td>
                        <button onclick="showDetails(${toy[0]})">Ver Detalles</button>
                        <button onclick="performAction(${toy[0]})" ${!canGift && !canDiscard ? 'disabled' : ''} class="action-button">
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
        const totalPages = Math.ceil(toys.length / itemsPerPage);
        let paginationHTML = '<div class="pagination">';
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button onclick="changePage(${i})" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
        }
        paginationHTML += '</div>';

        mainContent.innerHTML = tableHTML + paginationHTML;
    }

    renderTable(currentPage);

    // Función para cambiar de página
    window.changePage = function (page) {
        currentPage = page;
        renderTable(currentPage);
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
    const toy = getToys().find(toy => toy[0] === id);
    if (toy) {
        modalBody.innerHTML = `
            <h3>${toy[1]}</h3>
            <img src="${toy[3]}" alt="${toy[1]}" style="max-width: 200px;">
            <p><strong>Estado:</strong> ${toy[7]}</p>
            <p><strong>Tipo:</strong> ${toy[4]}</p>
            <p><strong>Descripción:</strong> ${toy[2]}</p>
            <p><strong>Origen:</strong> ${toy[5]}</p>
            <p><strong>Fecha de llegada:</strong> ${toy[6]}</p>
        `;
        modal.style.display = "block";
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
            if (confirm('¿Estás seguro de que quieres botar este juguete?')) {
                removeToy(id);
                showTable();
            }
        } else if (['Nuevo', 'Buen estado', 'Aun funciona'].includes(toy[7]) && arrivalDate <= oneYearAgo) {
            if (confirm('¿Estás seguro de que quieres regalar este juguete?')) {
                removeToy(id);
                showTable();
            }
        } else {
            alert('No se puede realizar ninguna acción con este juguete en este momento.');
        }
    }
}

// Función para mostrar reportes
function showReports() {
    const toys = getToys();
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
            Object.entries(toysByMonthYear).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');

        document.querySelector('#toysByStatus .report-content').innerHTML =
            Object.entries(toysByStatus).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');

        document.querySelector('#damagedToys .report-content').innerHTML = `<p>Total: ${damagedToys}</p>`;

        document.querySelector('#toysByOrigin .report-content').innerHTML =
            Object.entries(toysByOrigin).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');

        document.querySelector('#toysByType .report-content').innerHTML =
            Object.entries(toysByType).map(([key, value]) => `<p>${key}: ${value}</p>`).join('');
    }

    yearSelect.addEventListener('change', generateReports);
    monthSelect.addEventListener('change', generateReports);

    generateReports();
}

// Iniciar mostrando el formulario
showForm();