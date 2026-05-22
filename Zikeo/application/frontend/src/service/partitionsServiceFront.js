const BASE_URL = `${process.env.REACT_APP_API_URL}/api/partitions`;

export const getAllPartitions = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
    return response.json();
};

export const deletePartition = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {method: 'DELETE'});
    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
};
