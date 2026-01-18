import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, TrendingUp, Users, Eye, DollarSign } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState({
        views: 0,
        inquiries: 0,
        applications: 0,
        conversion_rate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics/');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    const handleViewUser = async (userId) => {
        setLoadingDetails(true);
        setDetailsError(null);
        setSelectedUser(userId);
        try {
            const response = await api.get(`/analytics/users/${userId}/details`);
            setUserDetails(response.data);
        } catch (err) {
            console.error("Failed to fetch user details", err);
            let msg = err.response?.data?.detail;
            if (!msg) {
                msg = `Error: ${err.message}`;
                if (err.response?.status) {
                    msg += ` (Status: ${err.response.status})`;
                    if (err.response.status === 404) msg += " - Route not found. Please restart backend.";
                }
            }
            setDetailsError(msg);
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setUserDetails(null);
        setDetailsError(null);
    };

    // ... existing loading check ...

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="gradient-text" style={{ fontSize: '1.5rem' }}>Loading analytics...</div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Performance Analytics</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Views</span>
                        <Eye style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.views}</div>
                    <div style={{ color: '#22c55e', fontSize: '0.875rem' }}>Lifetime views</div>
                </div>

                {stats.total_fees !== undefined && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Platform Fees</span>
                            <DollarSign style={{ color: '#fbbf24' }} />
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{stats.total_fees.toLocaleString()}</div>
                        <div style={{ color: '#fbbf24', fontSize: '0.875rem' }}>Total Fees Collection</div>
                    </div>
                )}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Inquiries</span>
                        <Users style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.inquiries}</div>
                    <div style={{ color: '#22c55e', fontSize: '0.875rem' }}>Total messages</div>
                </div>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Applications</span>
                        <TrendingUp style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.applications}</div>
                    <div style={{ color: '#22c55e', fontSize: '0.875rem' }}>Total bookings</div>
                </div>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Conversion Rate</span>
                        <TrendingUp style={{ color: 'var(--primary)' }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.conversion_rate}%</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Bookings / Views</div>
                </div>
            </div>

            <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <BarChart size={64} style={{ opacity: 0.2, marginRight: '1rem' }} />
                <span>Detailed charts coming soon...</span>
            </div>

            {/* Users List for Admin */}
            {stats.users && stats.users.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Platform Users</h2>
                    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-text-muted text-sm uppercase">
                                        <th className="p-4 font-semibold">Name</th>
                                        <th className="p-4 font-semibold">Email</th>
                                        <th className="p-4 font-semibold">Role</th>
                                        <th className="p-4 font-semibold">Verified</th>
                                        <th className="p-4 font-semibold">Phone</th>
                                        <th className="p-4 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {stats.users.map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-white">{user.name}</td>
                                            <td className="p-4 text-text-muted">{user.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                                    user.role === 'seller' ? 'bg-blue-500/20 text-blue-400' :
                                                        user.role === 'agent' ? 'bg-purple-500/20 text-purple-400' :
                                                            'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {user.isVerified ? (
                                                    <span className="text-green-400 text-xs font-bold">Verified</span>
                                                ) : (
                                                    <span className="text-text-muted text-xs">Unverified</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-text-muted text-sm">{user.phone || '-'}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleViewUser(user._id)}
                                                    className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Selected User Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl relative animate-scale-in">
                        <button
                            onClick={closeUserModal}
                            className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {loadingDetails ? (
                            <div className="p-12 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-text-muted">Loading user profile...</p>
                            </div>
                        ) : detailsError ? (
                            <div className="p-12 flex flex-col items-center justify-center text-red-400">
                                <p className="text-lg font-bold mb-2">Error</p>
                                <p>{detailsError}</p>
                            </div>
                        ) : !userDetails ? (
                            <div className="p-12 flex flex-col items-center justify-center text-text-muted">
                                <p>User details not found.</p>
                            </div>
                        ) : (
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row gap-8 mb-8">
                                    {/* User Bio */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white uppercase">
                                                {userDetails.user.name[0]}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">{userDetails.user.name}</h2>
                                                <p className="text-text-muted">{userDetails.user.email}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border border-white/10 ${userDetails.user.role === 'admin' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                                        {userDetails.user.role}
                                                    </span>
                                                    {userDetails.user.isVerified && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase text-green-400 bg-green-400/10 border border-green-400/20">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className="text-text-muted text-xs uppercase font-bold mb-1">Listed Properties</div>
                                                <div className="text-xl font-bold text-white">{userDetails.property_count || 0}</div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className="text-text-muted text-xs uppercase font-bold mb-1">Total Purchases</div>
                                                <div className="text-xl font-bold text-white">{userDetails.purchases.length}</div>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className="text-text-muted text-xs uppercase font-bold mb-1">Total Sales</div>
                                                <div className="text-xl font-bold text-white">{userDetails.sales.length}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-text-muted uppercase font-bold">Phone</label>
                                                <div className="text-white">{userDetails.user.phone || 'Not provided'}</div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted uppercase font-bold">User ID</label>
                                                <div className="text-white font-mono text-sm opacity-70">{userDetails.user._id}</div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted uppercase font-bold">Joined On</label>
                                                <div className="text-white">{new Date(userDetails.user.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transactions Tabs */}
                                <div>
                                    {/* Current Listings */}
                                    {userDetails.listings && userDetails.listings.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-white mb-4">Current Listings ({userDetails.listings.length})</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {userDetails.listings.map(property => (
                                                    <div key={property._id} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                                        <div className="w-20 h-20 bg-dark rounded-lg overflow-hidden flex-shrink-0 relative">
                                                            {property.images && property.images.length > 0 ? (
                                                                <img src={property.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/20">
                                                                    <DollarSign size={20} />
                                                                </div>
                                                            )}
                                                            <div className={`absolute top-0 right-0 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white ${property.status === 'sold' ? 'bg-green-500' :
                                                                property.status === 'pending' ? 'bg-yellow-500' : 'bg-primary'
                                                                }`}>
                                                                {property.status}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-center">
                                                            <div className="font-bold text-white line-clamp-1">{property.title}</div>
                                                            <div className="text-xs text-text-muted mb-1 line-clamp-1">{property.location}</div>
                                                            <div className="font-bold text-primary">₹{property.price.toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Transactions Tabs */}
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-4">Transaction History</h3>

                                        {userDetails.purchases.length === 0 && userDetails.sales.length === 0 ? (
                                            <div className="text-center py-8 text-text-muted bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                                No transactions found for this user.
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                {/* Purchases */}
                                                {userDetails.purchases.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-bold text-green-400 uppercase mb-3 flex items-center gap-2">
                                                            <TrendingUp size={16} /> Purchases ({userDetails.purchases.length})
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {userDetails.purchases.map(txn => (
                                                                <div key={txn._id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                                                    <div className="w-16 h-16 bg-dark rounded-lg overflow-hidden flex-shrink-0">
                                                                        {txn.property_id && txn.property_id.images && txn.property_id.images.length > 0 ? (
                                                                            <img src={txn.property_id.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/20">
                                                                                <DollarSign size={20} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-bold text-white">{txn.property_id ? txn.property_id.title : 'Unknown Property'}</div>
                                                                        <div className="text-sm text-text-muted">{new Date(txn.transaction_date).toLocaleDateString()}</div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="font-bold text-white">₹{txn.amount.toLocaleString()}</div>
                                                                        <div className="text-xs text-green-400 font-bold uppercase">Completed</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Sales */}
                                                {userDetails.sales.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
                                                            <DollarSign size={16} /> Sales ({userDetails.sales.length})
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {userDetails.sales.map(txn => (
                                                                <div key={txn._id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                                                    <div className="w-16 h-16 bg-dark rounded-lg overflow-hidden flex-shrink-0">
                                                                        {txn.property_id && txn.property_id.images && txn.property_id.images.length > 0 ? (
                                                                            <img src={txn.property_id.images[0].image_url} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center bg-white/10 text-white/20">
                                                                                <DollarSign size={20} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-bold text-white">{txn.property_id ? txn.property_id.title : 'Unknown Property'}</div>
                                                                        <div className="text-sm text-text-muted">{new Date(txn.transaction_date).toLocaleDateString()}</div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="font-bold text-white">₹{txn.amount.toLocaleString()}</div>
                                                                        <div className="text-xs text-text-muted">+ ₹{txn.platform_fee.toLocaleString()} Fee</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
