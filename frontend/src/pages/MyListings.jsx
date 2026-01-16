import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, MapPin, DollarSign, Plus } from 'lucide-react';

const MyListings = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                // 1. Get User ID
                const userResponse = await api.get('/auth/me');
                const userId = userResponse.data._id || userResponse.data.id;

                // 2. Fetch properties for this agent
                const response = await api.get(`/properties/?agent_id=${userId}`);
                setProperties(response.data);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to load listings');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyListings();
    }, [navigate]);

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="gradient-text" style={{ fontSize: '1.5rem' }}>Loading listings...</div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>My Listings</h1>
                <button onClick={() => navigate('/add-property')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            {properties.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't listed any properties yet.</p>
                    <button onClick={() => navigate('/add-property')} className="btn btn-primary">Create Your First Listing</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {properties.map(property => (
                        <div key={property.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{
                                height: '200px',
                                background: '#334155',
                                backgroundImage: property.images && property.images.length > 0 ? `url("${property.images[0].image_url}")` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '1rem',
                                    right: '1rem',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{property.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <MapPin size={16} /> {property.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                                    <DollarSign size={20} /> {property.price.toLocaleString()}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    <button
                                        onClick={() => navigate(`/edit-property/${property.id}`)}
                                        className="btn btn-outline"
                                        style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this listing?')) {
                                                try {
                                                    await api.delete(`/properties/${property.id}`);
                                                    setProperties(properties.filter(p => p.id !== property.id));
                                                } catch (err) {
                                                    console.error(err);
                                                    alert(err.response?.data?.detail || 'Failed to delete property');
                                                }
                                            }
                                        }}
                                        className="btn btn-outline"
                                        style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
