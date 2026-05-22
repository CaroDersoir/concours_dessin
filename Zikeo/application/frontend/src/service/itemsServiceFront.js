const BASE_URL = `${process.env.REACT_APP_API_URL}/api/items`;

export const getAllItems = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
    return response.json();
};

export const getItemById = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
    return response.json();
};

export const createItem = async (payload) => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création.');
    }
    return response.json();
};

export const updateItem = async (id, payload) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour.');
    }
    return response.json();
};

export const deleteItem = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {method: 'DELETE'});
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression.');
    }
};
