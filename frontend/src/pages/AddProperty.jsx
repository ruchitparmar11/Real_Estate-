import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, DollarSign, MapPin, Layout, FileText, Home, ArrowLeft } from 'lucide-react';

const AddProperty = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'sale',
        features: '',
        imageUrl: '',
        file: null // Store the file object
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchProperty = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/properties/${id}`);
                    const prop = response.data;
                    setFormData({
                        title: prop.title,
                        description: prop.description,
                        price: prop.price,
                        location: prop.location,
                        type: prop.type,
                        features: prop.features || '',
                        imageUrl: prop.images && prop.images.length > 0 ? prop.images[0].image_url : '',
                        file: null
                    });
                } catch (err) {
                    console.error("Failed to fetch property", err);
                    setError("Failed to load property details");
                }
            };
            fetchProperty();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a temporary URL for preview
            const previewUrl = URL.createObjectURL(file);
            setFormData({ ...formData, file, imageUrl: previewUrl });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            let finalImageUrl = formData.imageUrl;

            // 1. Upload File if selected
            if (formData.file) {
                const uploadData = new FormData();
                uploadData.append('image', formData.file);

                const uploadRes = await axios.post('http://localhost:8000/properties/upload', uploadData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                finalImageUrl = uploadRes.data.url;
            }

            // 2. Prepare Property Payload
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                // We're expecting backend to handle 'imageUrl' specifically or separate images endpoint?
                // The current backend (seed/schema) has 'images' array.
                // But let's check how we handle it. 
                // Currently properties.js Create endpoint takes ...req.body.
                // So we should probably pass 'images' array in body if we want it saved directly?
                // Or sticking to the previous logic of separate call.
                // Let's stick to separate call or simple one-step if we modify backend.
                // The previous code sent 'imageUrl' separately. Let's keep consistency.
            };

            // Clean up payload
            const { imageUrl, file, ...propertyData } = payload;

            let propertyId = id;

            if (isEditMode) {
                // Update
                await axios.put(`http://localhost:8000/properties/${id}`, propertyData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create
                const response = await axios.post('http://localhost:8000/properties/', propertyData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                propertyId = response.data.id;
            }

            // 3. Link Image to Property
            // If we have a new image (either uploaded or typed URL)
            if (finalImageUrl) {
                // If it was a file upload, finalImageUrl is the server path.
                // If it was a URL input, finalImageUrl is the input value.
                // Note: If user merely viewed an existing property and didn't change image, 
                // formData.imageUrl might still be the old one. We might re-upload it?
                // To avoid duplicate, maybe we check if it changed? 
                // For MVP simplicity: just send it. properties/:id/images appends it.

                // Only send if it's not the initial placeholder
                await axios.post(`http://localhost:8000/properties/${propertyId}/images`, {
                    image_url: finalImageUrl
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            navigate('/my-listings');
            alert(`Property ${isEditMode ? 'updated' : 'listed'} successfully!`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} listing`);
        } finally {
            setLoading(false);
        }
    };

    const inputWrapperClass = "relative group";
    const labelClass = "block text-sm font-medium text-text-muted mb-2 group-focus-within:text-primary transition-colors";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors";
    const inputClass = "w-full bg-dark/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:border-primary/50 focus:bg-dark/80 transition-all duration-300";

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-dark">
            <div className="w-full max-w-3xl animate-fade-in relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors group px-4"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-3">
                        {isEditMode ? 'Update Your Listing' : 'Create a New Listing'}
                    </h1>
                    <p className="text-text-muted max-w-xl mx-auto text-lg">
                        Share the details of your property to reach thousands of potential buyers on <span className="text-primary font-semibold">EstateAI</span>.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center animate-pulse mx-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* SECTION 1: THE BASICS */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Home size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">The Basics</h2>
                                <p className="text-sm text-text-muted">Key information about your property.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Property Title <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Modern Sunset Villa with Ocean View"
                                    className={inputClass}
                                    required
                                />
                                <p className="text-xs text-text-muted mt-1 ml-1">Make it catchy! This is the first thing buyers see.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Price <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <DollarSign size={18} className={iconClass} />
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="500000"
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Listing Type</label>
                                    <div className="relative">
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className={`${inputClass} appearance-none cursor-pointer bg-dark/50`}
                                        >
                                            <option value="sale">For Sale (Selling)</option>
                                            <option value="rent">For Rent (Leasing)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: LOCATION & DETAILS */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Location & Details</h2>
                                <p className="text-sm text-text-muted">Where is it and what makes it special?</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Full Address <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <MapPin size={18} className={iconClass} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. 123 Palm Street, Beverly Hills, CA 90210"
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Description <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <FileText size={18} className="absolute left-4 top-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Tell a story about the property. precise details about rooms, lighting, and neighborhood..."
                                        rows="6"
                                        className={`${inputClass} pl-12 resize-none leading-relaxed`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Key Features <span className="text-text-muted font-normal">(Optional)</span></label>
                                <div className="relative">
                                    <Layout size={18} className={iconClass} />
                                    <input
                                        type="text"
                                        name="features"
                                        value={formData.features}
                                        onChange={handleChange}
                                        placeholder="e.g. Swimming Pool, 2 Car Garage, Hardwood Floors"
                                        className={inputClass}
                                    />
                                </div>
                                <p className="text-xs text-text-muted mt-1 ml-1">Separate each feature with a comma.</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: VISUALS */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <Upload size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Photos</h2>
                                <p className="text-sm text-text-muted">Showcase the property to attract more views.</p>
                            </div>
                        </div>

                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Property Photos</label>

                            {formData.imageUrl && (
                                <div className="mb-4 relative group/image w-full h-64 rounded-xl overflow-hidden border border-white/10">
                                    <img src={formData.imageUrl} alt="Property Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* URL Input */}
                                <div className="relative">
                                    <Upload size={18} className={iconClass} />
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        placeholder="Paste Image URL"
                                        className={inputClass}
                                    />
                                </div>

                                {/* File Upload / Camera */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="cameraInput"
                                        accept="image/*"
                                        capture="environment" // This triggers the rear camera on mobile
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="cameraInput"
                                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-dashed border-white/20 hover:border-primary/50 hover:bg-white/5 cursor-pointer transition-all text-text-muted hover:text-white"
                                    >
                                        <div className="bg-primary/20 p-1.5 rounded-md text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                                        </div>
                                        <span>Take Photo / Upload</span>
                                    </label>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-text-muted">You can paste a URL or take a photo using your device camera.</p>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 rounded-xl border border-white/10 text-text-muted hover:bg-white/5 hover:text-white transition-all font-medium order-2 md:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed order-1 md:order-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </span>
                            ) : (isEditMode ? 'Update Listing' : 'Publish Property')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;