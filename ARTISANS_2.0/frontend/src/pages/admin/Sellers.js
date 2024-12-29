import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';

function Sellers() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [sellerFormData, setSellerFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        status: 'pending', // Default to 'pending' for new sellers
    });

    // Fetch all sellers
    const getAllSellers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/get-all-sellers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                setSellers(res.data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching sellers");
        } finally {
            setLoading(false);
        }
    };

    // Handle account status change (approve or reject)
    const handleAccountStatus = async (seller, status) => {
        setLoading(true);
        try {
            const res = await axios.post('/api/v1/admin/change-account-status', { sellerId: seller._id, status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                getAllSellers(); // Refresh the sellers list
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error updating account status");
        } finally {
            setLoading(false);
        }
    };

    // Handle delete seller action
    const handleDeleteSeller = async (sellerId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this seller?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const res = await axios.delete('/api/v1/admin/delete-seller', {
                data: { sellerId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                toast.success("Seller deleted successfully");
                getAllSellers(); // Refresh the sellers list
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error deleting seller");
        } finally {
            setLoading(false);
        }
    };

    // Handle seller form changes
    const handleFormChange = (e) => {
        setSellerFormData({
            ...sellerFormData,
            [e.target.name]: e.target.value
        });
    };

    // Create a new seller
    const handleCreateSeller = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/v1/admin/create-seller', sellerFormData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                toast.success("Seller created successfully");
                getAllSellers(); // Refresh the sellers list
                setShowCreateForm(false); // Close the create form
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error creating seller");
        } finally {
            setLoading(false);
        }
    };

    // Open edit form and populate with seller data
    const handleEditSeller = (seller) => {
        setSelectedSeller(seller);
        setSellerFormData({
            firstName: seller.firstName,
            lastName: seller.lastName,
            email: seller.email,
            address: seller.address,
            status: seller.status,
        });
        setShowEditForm(true);
    };

    // Handle seller update
    const handleUpdateSeller = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put('/api/v1/admin/update-seller', {
                sellerId: selectedSeller._id,
                sellerData: sellerFormData
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                toast.success("Seller updated successfully");
                getAllSellers(); // Refresh the sellers list
                setShowEditForm(false); // Close the edit form
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error updating seller");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllSellers();
    }, []);

    return (
        <Layout>
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Sellers</h1>

            {/* Create Seller Form */}
            {showCreateForm && (
                <div className="my-4 p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Create New Seller</h2>
                    <form onSubmit={handleCreateSeller}>
                        <input
                            type="text"
                            name="firstName"
                            value={sellerFormData.firstName}
                            onChange={handleFormChange}
                            placeholder="First Name"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={sellerFormData.lastName}
                            onChange={handleFormChange}
                            placeholder="Last Name"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="email"
                            name="email"
                            value={sellerFormData.email}
                            onChange={handleFormChange}
                            placeholder="Email"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="text"
                            name="address"
                            value={sellerFormData.address}
                            onChange={handleFormChange}
                            placeholder="Address"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded"
                        >
                            Create Seller
                        </button>
                    </form>
                </div>
            )}

            {/* Edit Seller Form */}
            {showEditForm && (
                <div className="my-4 p-4 bg-white rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Edit Seller</h2>
                    <form onSubmit={handleUpdateSeller}>
                        <input
                            type="text"
                            name="firstName"
                            value={sellerFormData.firstName}
                            onChange={handleFormChange}
                            placeholder="First Name"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={sellerFormData.lastName}
                            onChange={handleFormChange}
                            placeholder="Last Name"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="email"
                            name="email"
                            value={sellerFormData.email}
                            onChange={handleFormChange}
                            placeholder="Email"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <input
                            type="text"
                            name="address"
                            value={sellerFormData.address}
                            onChange={handleFormChange}
                            placeholder="Address"
                            className="mb-2 p-2 border border-gray-300 rounded w-full"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded"
                        >
                            Update Seller
                        </button>
                    </form>
                </div>
            )}

            <div className="relative overflow-x-auto">
                {loading ? (
                    <div className="container text-center">Loading...</div>
                ) : (
                    sellers.length === 0 ? (
                        <div className='container'>No sellers</div>
                    ) : (
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Seller Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Address</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.map((seller) => (
                                    <tr key={seller._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {`${seller.firstName} ${seller.lastName}`}
                                        </th>
                                        <td className="px-6 py-4">{seller.email}</td>
                                        <td className="px-6 py-4">{seller.address}</td>
                                        <td className="px-6 py-4">{seller.status}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleEditSeller(seller)}
                                                className="bg-yellow-600 text-white px-3 py-2 rounded"
                                            >
                                                Edit
                                            </button>
                                            {seller.status === 'approved' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAccountStatus(seller, 'rejected')}
                                                        className="bg-red-700 text-white px-3 py-2 rounded ml-2"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSeller(seller._id)}
                                                        className="bg-gray-700 text-white px-3 py-2 rounded ml-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleAccountStatus(seller, 'approved')}
                                                    className="bg-green-700 text-white px-3 py-2 rounded ml-2"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </Layout>
    );
}

export default Sellers;
