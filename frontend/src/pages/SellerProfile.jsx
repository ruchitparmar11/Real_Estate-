import { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Phone, Shield, ArrowLeft, MapPin, Bed, Bath, Square, Loader } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const SellerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user details
                const userRes = await api.get(`/auth/user/${id}`);
                setUser(userRes.data);

                // Fetch user's listings
                const listingsRes = await api.get(`/properties/?agent_id=${id}`);
                setListings(listingsRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error || !user) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <h2 className="text-2xl font-bold text-red-400">{error || 'User not found'}</h2>
            <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                Go Back
            </button>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Profile Header */}
                <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden animate-fade-in mb-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="shrink-0 relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-glow">
                                <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
                                    <User size={64} className="text-white/80" />
                                </div>
                            </div>
                            {user.isVerified && (
                                <div className="absolute bottom-1 right-1 bg-blue-500 w-8 h-8 rounded-full border-4 border-dark flex items-center justify-center text-white" title="Verified">
                                    <Shield size={14} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-6 capitalize">
                                <Shield size={14} />
                                {user.role}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Mail className="text-text-muted shrink-0" size={20} />
                                    <div className="text-left overflow-hidden">
                                        <p className="text-xs text-text-muted uppercase font-semibold">Email</p>
                                        <p className="truncate text-sm font-medium">{user.email}</p>
                                    </div>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Phone className="text-text-muted shrink-0" size={20} />
                                        <div className="text-left">
                                            <p className="text-xs text-text-muted uppercase font-semibold">Phone</p>
                                            <p className="truncate text-sm font-medium">{user.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Listings */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <User className="text-primary" /> Active Listings ({listings.length})
                    </h2>

                    {listings.length === 0 ? (
                        <div className="glass-panel p-12 text-center text-text-muted rounded-3xl">
                            This user has no active listings at the moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((property) => (
                                <Link to={`/properties/${property._id || property.id}`} key={property._id || property.id} className="group block">
                                    <div className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-glow transition-all duration-300 h-full flex flex-col">
                                        <div className="relative h-60 bg-dark/50 overflow-hidden">
                                            {property.images && property.images.length > 0 ? (
                                                <img
                                                    src={property.images[0].image_url}
                                                    alt={property.title}
                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1600596542815-2a440436f2e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"; }}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-text-muted">
                                                    No Image Available
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10">
                                                {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                                            </div>
                                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 flex items-center gap-1">
                                                <MapPin size={12} className="text-secondary" /> {property.location}
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                                                <span className="text-primary font-bold whitespace-nowrap">₹{property.price.toLocaleString()}</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-text-muted text-xs mt-auto">
                                                {(() => {
                                                    const features = property.features || '';
                                                    const bedsMatch = features.match(/(\d+)\s*Beds?/i);
                                                    const bathsMatch = features.match(/(\d+)\s*Baths?/i);
                                                    const sqftMatch = features.match(/(\d+(?:,\d+)?)\s*Sq\s*Ft/i);

                                                    return (
                                                        <>
                                                            <div className="flex items-center gap-1">
                                                                <Bed size={14} /> <span>{bedsMatch ? bedsMatch[1] : '--'} Beds</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Bath size={14} /> <span>{bathsMatch ? bathsMatch[1] : '--'} Baths</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Square size={14} /> <span>{sqftMatch ? sqftMatch[1] : '--'} sqft</span>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
