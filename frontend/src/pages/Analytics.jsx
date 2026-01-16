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
                            <span style={{ color: 'var(--text-muted)' }}>Platform Revenue</span>
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
        </div>
    );
};

export default Analytics;
