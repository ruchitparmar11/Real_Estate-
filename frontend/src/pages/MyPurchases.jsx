import { useState, useEffect } from 'react';
import api from '../services/api';
import { MapPin, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MyPurchases = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPurchases = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await api.get('/properties/purchased');
                setProperties(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch purchases:", err);
                setError("Could not load your purchases.");
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="container min-h-screen pt-24 pb-12 px-4">
            <h1 className="text-3xl font-bold mb-2">My Purchases</h1>
            <p className="text-text-muted mb-8">Properties you have successfully acquired.</p>

            {error && <div className="text-red-400 mb-4">{error}</div>}

            {properties.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl text-center">
                    <h3 className="text-xl font-bold mb-4">No Purchases Yet</h3>
                    <p className="text-text-muted mb-8">Start your real estate journey today.</p>
                    <button
                        onClick={() => navigate('/properties')}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-glow transition-all"
                    >
                        Browse Properties
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <div key={property.id} className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative glass-panel rounded-3xl overflow-hidden h-full flex flex-col hover:translate-y-[-5px] transition-transform duration-300">
                                {/* Image Overlay for SOLD status */}
                                <div className="relative h-48">
                                    <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
                                        <div className="bg-green-500/90 backdrop-blur text-white px-4 py-1.5 rounded-full font-bold flex items-center gap-2">
                                            <CheckCircle size={16} /> OWNED
                                        </div>
                                    </div>
                                    <img
                                        src={property.images && property.images.length > 0 ? property.images[0].image_url : "https://images.unsplash.com/photo-1600596542815-2a440436f2e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{property.title}</h3>
                                    <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
                                        <MapPin size={16} />
                                        <span className="truncate">{property.location}</span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                        <div className="text-primary font-bold text-lg">
                                            ₹{property.price.toLocaleString()}
                                        </div>
                                        <Link
                                            to={`/properties/${property.id}`}
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPurchases;
