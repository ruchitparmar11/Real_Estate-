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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
