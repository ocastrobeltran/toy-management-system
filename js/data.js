// Matriz para almacenar los juguetes
let toys = [];

// Función para agregar un juguete
function addToy(toy) {
    toys.push(toy);
    saveToys();
}

// Función para obtener todos los juguetes
function getToys() {
    return toys;
}

// Función para eliminar un juguete
function removeToy(id) {
    toys = toys.filter(toy => toy[0] !== id);
    saveToys();
}

// Función para actualizar el estado de un juguete
function updateToyStatus(id, newStatus) {
    const toyIndex = toys.findIndex(toy => toy[0] === id);
    if (toyIndex !== -1) {
        toys[toyIndex][7] = newStatus;
        saveToys();
    }
}

// Función para guardar los juguetes en el almacenamiento local
function saveToys() {
    localStorage.setItem('toys', JSON.stringify(toys));
}

// Función para cargar los juguetes del almacenamiento local
function loadToys() {
    const storedToys = localStorage.getItem('toys');
    if (storedToys) {
        toys = JSON.parse(storedToys);
    }
}

// Cargar los juguetes al iniciar
loadToys();