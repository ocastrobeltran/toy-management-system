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