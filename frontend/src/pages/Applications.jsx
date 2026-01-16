import { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, CheckCircle, Clock, XCircle, Check, X } from 'lucide-react';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/bookings/');
            setApplications(response.data);
        } catch (err) {
            console.error("Failed to load applications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const updateStatus = async (bookingId, newStatus) => {
        try {
            await api.put(`/bookings/${bookingId}/status?status=${newStatus}`);
            // Optimistic update or refetch
            setApplications(apps => apps.map(app =>
                app.id === bookingId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#22c55e';
            case 'cancelled':
            case 'rejected': return '#ef4444';
            default: return '#eab308';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={18} />;
            case 'cancelled':
            case 'rejected': return <XCircle size={18} />;
            default: return <Clock size={18} />;
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="gradient-text" style={{ fontSize: '1.5rem' }}>Loading applications...</div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Rental/Booking Applications</h1>

            {applications.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No applications or bookings found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {applications.map(app => (
                        <div key={app.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Property ID: {app.property_id}</h3>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileText size={14} /> Application ID: #{app.id}
                                    <span>•</span>
                                    <span>User ID: {app.user_id}</span>
                                    <span>•</span>
                                    Slot: {new Date(app.slot_time).toLocaleString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '2rem',
                                    background: `${getStatusColor(app.status)}20`,
                                    color: getStatusColor(app.status),
                                    fontWeight: 'bold'
                                }}>
                                    {getStatusIcon(app.status)}
                                    <span style={{ textTransform: 'capitalize' }}>{app.status}</span>
                                </div>

                                {app.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => updateStatus(app.id, 'confirmed')}
                                            title="Approve"
                                            style={{
                                                background: '#22c55e', color: 'white', border: 'none',
                                                borderRadius: '50%', width: '36px', height: '36px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                            }}
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => updateStatus(app.id, 'rejected')}
                                            title="Reject"
                                            style={{
                                                background: '#ef4444', color: 'white', border: 'none',
                                                borderRadius: '50%', width: '36px', height: '36px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                            }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;
