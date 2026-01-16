import { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, DollarSign, Home, Check, User, Calendar, MessageSquare, Heart, ArrowLeft, Share2, Printer, Edit, Trash2, Plus, BadgeCheck, Upload } from 'lucide-react';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [userId, setUserId] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [addingImage, setAddingImage] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await api.get(`/properties/${id}`);
                setProperty(response.data);

                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const meResponse = await api.get('/auth/me');
                        setUserId(meResponse.data._id || meResponse.data.id);
                    } catch (e) {
                        // Token invalid or expired
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Property not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleInquiry = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await api.post('/inquiries/', {
                property_id: id,
                message: message
            });
            alert('Message sent successfully!');
            setMessage('');
        } catch (err) {
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const propId = parseInt(id);
        if (wishlist.includes(propId)) {
            const newWishlist = wishlist.filter(pid => pid !== propId);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            alert('Removed from wishlist');
        } else {
            wishlist.push(propId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert('Added to wishlist');
        }
    };

    const handleFileUpload = async (file) => {
        setAddingImage(true);
        try {
            const uploadData = new FormData();
            uploadData.append('image', file);

            const uploadRes = await api.post('/properties/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const uploadedUrl = uploadRes.data.url;

            // Immediately add to property
            await api.post(`/properties/${id}/images`, {
                image_url: uploadedUrl
            });

            const res = await api.get(`/properties/${id}`);
            setProperty(res.data);
            alert('Image uploaded successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        } finally {
            setAddingImage(false);
            setNewImageUrl('');
        }
    };

    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImageUrl) return;
        setAddingImage(true);
        try {
            const token = localStorage.getItem('token');
            await api.post(`/properties/${id}/images`, {
                image_url: newImageUrl
            });

            const res = await api.get(`/properties/${id}`);
            setProperty(res.data);
            setNewImageUrl('');
            alert('Image added successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to add image');
        } finally {
            setAddingImage(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error || !property) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <h2 className="text-2xl font-bold text-red-400">{error || 'Property not found'}</h2>
            <button onClick={() => navigate('/properties')} className="px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                Browse Properties
            </button>
        </div>
    );

    const isOwner = userId === (property.agent_id?._id || property.agent_id);
    const canInquire = (userRole === 'buyer' || userRole === 'tenant') || !userRole;

    // Images array
    const images = property.images && property.images.length > 0
        ? property.images.map(img => img.image_url)
        : ["https://images.unsplash.com/photo-1600596542815-2a440436f2e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"];

    return (
        <div className="min-h-screen pb-20">
            {/* Header / Nav Back */}
            <div className="bg-dark/50 backdrop-blur-sm border-b border-white/5 sticky top-[80px] z-30 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-muted hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white" title="Share">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white" title="Print">
                            <Printer size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-video w-full bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group">
                                <img
                                    src={images[activeImageIndex]}
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {isOwner && property.images && property.images.length > 0 && (
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Delete this image?')) {
                                                try {
                                                    const imgId = property.images[activeImageIndex]._id;
                                                    await api.delete(`/properties/${id}/images/${imgId}`);
                                                    // Refresh
                                                    const res = await api.get(`/properties/${id}`);
                                                    setProperty(res.data);
                                                    setActiveImageIndex(0);
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Failed to delete image');
                                                }
                                            }
                                        }}
                                        className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-all z-20"
                                        title="Delete Image"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-medium border border-white/10">
                                    {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative min-w-[100px] h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-primary shadow-glow' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Stats */}
                        <div className="glass-panel p-8 rounded-3xl animate-fade-in">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
                                    <div className="flex items-center gap-2 text-text-muted text-lg">
                                        <MapPin size={20} className="text-secondary" />
                                        {property.location}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-primary">
                                        ₹{property.price.toLocaleString()}
                                    </div>
                                    <div className="text-text-muted text-sm mt-1">
                                        {property.type === 'rent' ? '/ month' : 'Asking Price'}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/5 my-6" />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                    <Home size={24} className="mx-auto mb-2 text-accent" />
                                    <span className="block text-sm text-text-muted">Type</span>
                                    <span className="font-semibold capitalize">{property.type}</span>
                                </div>

                                {(() => {
                                    // Parse stats from features string
                                    const features = property.features || '';
                                    const sqftMatch = features.match(/(\d+(?:,\d+)?)\s*Sq\s*Ft/i);
                                    const bedsMatch = features.match(/(\d+)\s*Beds?/i);
                                    const bathsMatch = features.match(/(\d+)\s*Baths?/i);

                                    const area = property.area || (sqftMatch ? sqftMatch[1] : '--');
                                    const beds = property.bedrooms || (bedsMatch ? bedsMatch[1] : '--');
                                    const baths = property.bathrooms || (bathsMatch ? bathsMatch[1] : '--');

                                    return (
                                        <>
                                            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                                <div className="text-2xl font-bold text-white mb-0.5">{area}</div>
                                                <span className="block text-sm text-text-muted">Sq Ft</span>
                                            </div>
                                            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                                <div className="text-2xl font-bold text-white mb-0.5">{beds}</div>
                                                <span className="block text-sm text-text-muted">Beds</span>
                                            </div>
                                            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                                <div className="text-2xl font-bold text-white mb-0.5">{baths}</div>
                                                <span className="block text-sm text-text-muted">Baths</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="glass-panel p-8 rounded-3xl animate-fade-in delay-100">
                            <h3 className="text-xl font-bold mb-4">About this Property</h3>
                            <p className="text-text-muted leading-relaxed whitespace-pre-line text-lg">
                                {property.description}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="glass-panel p-8 rounded-3xl animate-fade-in delay-200">
                            <h3 className="text-xl font-bold mb-6">Features & Amenities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                                {property.features ? property.features.split(',').map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 text-text-main group">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        {feature.trim()}
                                    </div>
                                )) : <span className="text-text-muted">No specific features listed.</span>}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Contact or Manage) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">

                            {isOwner ? (
                                <div className="glass-panel p-6 rounded-3xl border border-primary/20 shadow-glow">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <User size={20} className="text-primary" /> Manage Listing
                                    </h3>
                                    <p className="text-text-muted mb-6 text-sm">
                                        You are the owner. Update details or manage images below.
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <button
                                            onClick={() => navigate(`/edit-property/${id}`)}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium"
                                        >
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Are you sure?')) {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        await api.delete(`/properties/${id}`);
                                                        navigate('/my-listings');
                                                    } catch (err) { }
                                                }
                                            }}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors font-medium"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>

                                    <div className="border-t border-white/10 pt-6">
                                        <h4 className="font-medium mb-3 flex items-center gap-2"><Plus size={16} /> Add Photo</h4>
                                        <form onSubmit={handleAddImage} className="space-y-3">
                                            {/* File Upload Option */}
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="sidebar-upload"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            // Handle immediate upload or set state?
                                                            // We'll set a temp state to show name, then upload on submit
                                                            // Or better, upload immediately? No, let's stick to submit.
                                                            // Actually, let's keep it simple: URL input OR File Select
                                                            // We'll put the file object in state if selected.
                                                            const preview = URL.createObjectURL(file);
                                                            setNewImageUrl(preview); // Preview
                                                            // We need a way to store the file to upload
                                                            // Let's add a hidden prop or use a ref, or just add logic to handleAddImage
                                                            // Since we don't have a 'file' state variable in the main component effectively (we have addingImage state)
                                                            // We will need to add a state for 'file' to PropertyDetails component
                                                            // BUT: modifying component state structure requires 'replace_file' of the exact state line.
                                                            // To avoid complex edits, let's just do:
                                                            // "Click to upload" -> Uploads immediately -> gets URL -> calls addImage
                                                            handleFileUpload(file);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="sidebar-upload"
                                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-white/20 hover:border-primary/50 hover:bg-white/5 cursor-pointer transition-all text-text-muted hover:text-white text-sm"
                                                >
                                                    <Upload size={16} /> Upload from Device
                                                </label>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-white/10"></div>
                                                </div>
                                                <div className="relative flex justify-center text-xs uppercase">
                                                    <span className="bg-card px-2 text-text-muted">Or via URL</span>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    placeholder="Paste Image URL..."
                                                    value={newImageUrl.startsWith('blob:') ? '' : newImageUrl} // Don't show blob
                                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                                    className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:border-primary/50 outline-none transition"
                                                    required={!newImageUrl.startsWith('blob:')}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={addingImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-lg text-white hover:bg-primary-hover disabled:opacity-50"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-panel p-8 rounded-3xl">
                                    <Link to={`/seller/${property.agent_id?._id}`} className="flex items-center gap-4 mb-6 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors -mx-2">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg flex items-center gap-1 group-hover:text-primary transition-colors">
                                                {property.agent_id?.name || 'Listing Agent'}
                                                {property.agent_id?.isVerified && <BadgeCheck size={18} className="text-blue-500 fill-blue-500/10" />}
                                            </div>
                                            <div className="text-primary text-sm font-medium bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-1">Official Partner</div>
                                            {property.agent_id?.phone && (
                                                <div className="text-text-muted text-sm flex items-center gap-1">
                                                    📞 {property.agent_id.phone}
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {canInquire ? (
                                        <form onSubmit={handleInquiry} className="space-y-4">
                                            <div className="relative">
                                                <textarea
                                                    placeholder="Hello, I am interested in [Property Title]"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    rows="4"
                                                    className="w-full bg-dark/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-primary/50 outline-none resize-none transition-all placeholder:text-text-muted"
                                                    required
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={sending}
                                                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-glow hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                                            >
                                                {sending ? 'Sending...' : 'Send Message'}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="p-4 bg-white/5 rounded-xl text-center text-text-muted text-sm border border-white/5">
                                            Please <button onClick={() => navigate('/login')} className="text-primary hover:underline">log in</button> to inquire or specific actions.
                                        </div>
                                    )}

                                    {/* BUY BUTTON */}
                                    {property.status === 'sold' ? (
                                        <div className="mt-4 w-full py-4 rounded-xl bg-red-500/20 border border-red-500/20 text-red-400 text-center font-bold uppercase tracking-wider">
                                            Sold Out
                                        </div>
                                    ) : (
                                        userRole === 'buyer' && (
                                            <button
                                                onClick={() => navigate(`/payment/${id}`)}
                                                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-glow hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <DollarSign size={20} /> Buy This Property
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={toggleWishlist}
                                        className="w-full mt-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-text-muted hover:text-white transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        <Heart size={18} className="group-hover:text-red-400 transition-colors" /> Add to Wishlist
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default PropertyDetails;
