// Matriz para almacenar los juguetes
let toys = [];

// Función para agregar un juguete
function addToy(toy) {
    toy.id = Date.now();
    toy.tags = toy.tags || [];
    toy.images = toy.images || [toy.image];
    toy.changeHistory = [{
        date: new Date().toISOString(),
        action: 'Creado',
        details: 'Juguete añadido al sistema'
    }];
    toys.push(toy);
    saveToys();
}

// Funcion para actualizar un juguete
function updateToy(id, updates) {
    const index = toys.findIndex(toy => toy.id === id);
    if (index !== -1) {
        const oldToy = { ...toys[index] };
        toys[index] = { ...oldToy, ...updates };
        
        // Ensure tags always exists after update
        toys[index].tags = toys[index].tags || [];
        
        const changes = Object.keys(updates).map(key => {
            return `${key}: ${oldToy[key]} -> ${updates[key]}`;
        }).join(', ');
        
        toys[index].changeHistory.push({
            date: new Date().toISOString(),
            action: 'Actualizado',
            details: changes
        });
        
        saveToys();
    }
}

// Función para obtener todos los juguetes
function getToys() {
    return toys.map(toy => ({
        ...toy,
        tags: toy.tags || []
    }));
}

// Función para eliminar un juguete
function removeToy(id) {
    toys = toys.filter(toy => toy.id !== id);
    saveToys();
}

// podemos quitar
// Función para actualizar el estado de un juguete
// function updateToyStatus(id, newStatus) {
//     const toyIndex = toys.findIndex(toy => toy[0] === id);
//     if (toyIndex !== -1) {
//         toys[toyIndex][7] = newStatus;
//         saveToys();
//     }
// }

// Función para guardar los juguetes en el almacenamiento local
function saveToys() {
    localStorage.setItem('toys', JSON.stringify(toys));
}

// Función para cargar los juguetes del almacenamiento local
function loadToys() {
    const storedToys = localStorage.getItem('toys');
    if (storedToys) {
        toys = JSON.parse(storedToys);
        // Ensure all loaded toys have a tags property
        toys = toys.map(toy => ({
            ...toy,
            tags: toy.tags || []
        }));
    }
}

// Cargar los juguetes al iniciar
loadToys();

// Función para obtener los juguetes de un usuario específico
function getToys(username) {
    const allToys = JSON.parse(localStorage.getItem('toys') || '{}');
    return allToys[username] || [];
}

// Función para agregar un juguete para un usuario específico
function addToy(username, toy) {
    const allToys = JSON.parse(localStorage.getItem('toys') || '{}');
    if (!allToys[username]) {
        allToys[username] = [];
    }
    allToys[username].push(toy);
    localStorage.setItem('toys', JSON.stringify(allToys));
}

// Función para actualizar un juguete de un usuario específico
function updateToy(username, id, updates) {
    const allToys = JSON.parse(localStorage.getItem('toys') || '{}');
    if (allToys[username]) {
        const index = allToys[username].findIndex(toy => toy[0] === id);
        if (index !== -1) {
            allToys[username][index] = { ...allToys[username][index], ...updates };
            localStorage.setItem('toys', JSON.stringify(allToys));
        }
    }
}

// Función para eliminar un juguete de un usuario específico
function removeToy(username, id) {
    const allToys = JSON.parse(localStorage.getItem('toys') || '{}');
    if (allToys[username]) {
        allToys[username] = allToys[username].filter(toy => toy[0] !== id);
        localStorage.setItem('toys', JSON.stringify(allToys));
    }
}