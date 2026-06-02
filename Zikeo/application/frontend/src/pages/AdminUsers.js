// Page admin — gestion des comptes utilisateurs
import {useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {getAllUsers, deleteUser, updateUserRole, updateUserPartitionAccess, updateUserTeacher} from '../service/customerServiceFront';
import {LanguageContext} from '../context/languageContext';
import '../styles/AdminUsers.css';

function AdminUsers() {
    const {t} = useContext(LanguageContext);
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
            setFeedback(t('admin_users_error_load'));
        }
    }

    async function handleDelete(id) {
        if (!window.confirm(t('admin_users_confirm_delete'))) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch {
            setFeedback(t('admin_users_error_delete'));
        }
    }

    async function handleToggleRole(user) {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            await updateUserRole(user.id, newRole);
            setUsers(users.map(u => u.id === user.id ? {...u, role: newRole} : u));
        } catch {
            setFeedback(t('admin_users_error_role'));
        }
    }

    async function handleTogglePartition(user) {
        const newValue = !user.can_upload_partition;
        try {
            await updateUserPartitionAccess(user.id, newValue);
            setUsers(users.map(u => u.id === user.id ? {...u, can_upload_partition: newValue} : u));
        } catch {
            setFeedback(t('admin_users_error_partition'));
        }
    }

    async function handleToggleTeacher(user) {
        const newValue = !user.est_professeur;
        try {
            await updateUserTeacher(user.id, newValue);
            setUsers(users.map(u => u.id === user.id ? {...u, est_professeur: newValue} : u));
        } catch {
            setFeedback(t('admin_users_error_teacher'));
        }
    }

    return (
        <div className="page">
            <Header/>
            <main className="page__content">
                <div className="admin-users">
                    <h1 className="admin-users__title">{t('admin_users_title')}</h1>
                    {feedback && <p className="admin-users__feedback">{feedback}</p>}
                    <table className="admin-users__table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>{t('admin_users_col_nom')}</th>
                            <th>{t('admin_users_col_prenom')}</th>
                            <th>{t('admin_users_col_role')}</th>
                            <th>{t('admin_users_col_partitions')}</th>
                            <th>{t('admin_users_col_teacher')}</th>
                            <th>{t('admin_users_col_actions')}</th>
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
                                        {user.role === 'admin' ? t('admin_users_role_admin') : t('admin_users_role_user')}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={`admin-users__role-btn ${user.can_upload_partition ? 'active' : ''}`}
                                        onClick={() => handleTogglePartition(user)}
                                    >
                                        {user.can_upload_partition ? t('admin_users_partition_allowed') : t('admin_users_partition_blocked')}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className={`admin-users__role-btn ${user.est_professeur ? 'active' : ''}`}
                                        onClick={() => handleToggleTeacher(user)}
                                    >
                                        {user.est_professeur ? t('admin_users_teacher_yes') : t('admin_users_teacher_no')}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="admin-users__delete-btn"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        {t('promo_btn_delete')}
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
