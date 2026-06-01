// Page admin — gestion des comptes utilisateurs
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {getAllUsers, deleteUser, updateUserRole} from '../service/customerServiceFront';
import '../styles/AdminUsers.css';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [feedback, setFeedback] = useState('');
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') {
            history.push('/');
            return;
        }
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch {
            setFeedback('Impossible de charger les utilisateurs.');
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch {
            setFeedback('Erreur lors de la suppression.');
        }
    }

    async function handleToggleRole(user) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            await updateUserRole(user.id, newRole);
            setUsers(users.map(u => u.id === user.id ? {...u, role: newRole} : u));
        } catch {
            setFeedback('Erreur lors de la mise à jour du rôle.');
        }
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <div className="admin-users">
                    <h1 className="admin-users__title">Gestion des utilisateurs</h1>
                    {feedback && <p className="admin-users__feedback">{feedback}</p>}
                    <table className="admin-users__table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.nom || '—'}</td>
                                <td>{user.prenom || '—'}</td>
                                <td>
                                    <button
                                        className={`admin-users__role-btn ${user.role === 'admin' ? 'active' : ''}`}
                                        onClick={() => handleToggleRole(user)}
                                    >
                                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="admin-users__delete-btn"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default AdminUsers;
