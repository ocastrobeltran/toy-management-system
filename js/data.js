
export {getToys, addToy, updateToy, removeToy, getUsers, addUser, verifyUser};

// Función para obtener los juguetes de un usuario específico
function getToys(currentUser) {
    const allToys = JSON.parse(localStorage.getItem('toys'));
    return allToys[currentUser];
}

// Función para agregar un juguete para un usuario específico
function addToy(currentUser, toy) {
    const allToys = JSON.parse(localStorage.getItem('toys'));
    if (!allToys[currentUser]) {
        allToys[currentUser] = [];
    }
    allToys[currentUser].push(toy);
    localStorage.setItem('toys', JSON.stringify(allToys));
}

// Función para actualizar un juguete de un usuario específico
function updateToy(username, id, updates) {
    const allToys = JSON.parse(localStorage.getItem('toys') || '{}');
    if (allToys[username]) {
        const index = allToys[username].findIndex(toy => toy[0] === id);
        if (index !== -1) {
            // Actualizar solo los campos proporcionados en 'updates'
            Object.keys(updates).forEach(key => {
                switch (key) {
                    case 'name': allToys[username][index][1] = updates[key]; break;
                    case 'description': allToys[username][index][2] = updates[key]; break;
                    case 'image': allToys[username][index][3] = updates[key]; break;
                    case 'type': allToys[username][index][4] = updates[key]; break;
                    case 'origin': allToys[username][index][5] = updates[key]; break;
                    case 'arrivalDate': allToys[username][index][6] = updates[key]; break;
                    case 'status': allToys[username][index][7] = updates[key]; break;
                    case 'tags': allToys[username][index][8] = updates[key]; break;
                }
            });
            localStorage.setItem('toys', JSON.stringify(allToys));
        }
    }
}

// Función para eliminar un juguete de un usuario específico
function removeToy(currentUser, id) {
    const allToys = JSON.parse(localStorage.getItem('toys') || '{}');
    if (allToys[currentUser]) {
        allToys[currentUser] = allToys[currentUser].filter(toy => toy[0] !== id);
        localStorage.setItem('toys', JSON.stringify(allToys));
    }
}

// Función para obtener todos los usuarios
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Función para agregar un nuevo usuario
function addUser(currentUser, password) {
    const users = getUsers();
    users.push({ currentUser, password });
    localStorage.setItem('users', JSON.stringify(users));
}

function verifyUser(currentUser, password) {
    const users = getUsers();
    return users.some(user => user.currentUser === username && user.password === password);
}