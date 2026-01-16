import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, DollarSign, ArrowRight } from 'lucide-react';

const Wishlist = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            // In a real app, we'd fetch from API
            // For now, we fetch ALL properties and filter by IDs stored in localStorage 'wishlist'
            const savedIds = JSON.parse(localStorage.getItem('wishlist') || '[]');

            if (savedIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                // Fetching all isn't efficient but works for small scale
                const response = await api.get('/properties/');
                const allProps = response.data;
                const favProps = allProps.filter(p => savedIds.includes(p.id));
                setFavorites(favProps);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="gradient-text" style={{ fontSize: '1.5rem' }}>Loading wishlist...</div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Wishlist</h1>

            {favorites.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
                    <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '1rem' }}>No favorites yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start exploring properties and save them to your wishlist!</p>
                    <button onClick={() => navigate('/properties')} className="btn btn-primary">Browse Properties</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {favorites.map(property => (
                        <div key={property.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ height: '200px', background: '#334155', position: 'relative' }}>
                                <button className="btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', color: '#ef4444', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}>
                                    <Heart fill="#ef4444" size={18} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{property.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <MapPin size={16} /> {property.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                                    <DollarSign size={20} /> {property.price.toLocaleString()}
                                </div>
                                <button onClick={() => navigate(`/properties/${property.id}`)} className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    View Details <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
