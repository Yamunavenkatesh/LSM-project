import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';

function Users() {
    const [users, setUsers] = useState([]);
    const [userToEdit, setUserToEdit] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: '',
        isVerified: false,
    });

    // Fetch all users
    const getAllUsers = async () => {
        try {
            const res = await axios.get('/api/v1/admin/get-all-users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching users");
        }
    };

    // Handle create or update user
    const handleCreateOrUpdateUser = async () => {
        try {
            const endpoint = userToEdit
                ? `/api/v1/admin/update-user`
                : `/api/v1/admin/create-user`;

            const method = userToEdit ? 'put' : 'post';
            const res = await axios[method](endpoint, userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                getAllUsers(); // Refresh the users list
                setUserData({ name: '', email: '', role: '', isVerified: false });
                setUserToEdit(null); // Reset edit state
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error saving user data");
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId) => {
        try {
            const res = await axios.delete('/api/v1/admin/delete-user', {
                data: { userId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                toast.success("User deleted successfully");
                getAllUsers(); // Refresh the users list
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error deleting user");
        }
    };

    // Handle edit user (set data for editing)
    const handleEditUser = (user) => {
        setUserToEdit(user);
        setUserData({
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        });
    };

    // Fetch users when the component mounts
    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <Layout>
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Users
            </h1>

            {/* User Form */}
            <div className="mb-4">
                <h2 className="text-xl font-bold">{userToEdit ? 'Edit User' : 'Create New User'}</h2>
                <div className="mt-4">
                    <label>Name</label>
                    <input
                        type="text"
                        className="border rounded p-2 w-full"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                </div>
                <div className="mt-4">
                    <label>Email</label>
                    <input
                        type="email"
                        className="border rounded p-2 w-full"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                </div>
                <div className="mt-4">
                    <label>Role</label>
                    <select
                        className="border rounded p-2 w-full"
                        value={userData.role}
                        onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="seller">Seller</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div className="mt-4">
                    <label>Verified</label>
                    <input
                        type="checkbox"
                        className="ml-2"
                        checked={userData.isVerified}
                        onChange={(e) => setUserData({ ...userData, isVerified: e.target.checked })}
                    />
                </div>
                <div className="mt-4">
                    <button
                        onClick={handleCreateOrUpdateUser}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        {userToEdit ? 'Update User' : 'Create User'}
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Verified
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users &&
                            users.map((user) => (
                                <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        {user.isVerified ? "Verified" : "Not Verified"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="bg-yellow-500 text-white p-2 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="bg-red-500 text-white p-2 rounded ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Users;
