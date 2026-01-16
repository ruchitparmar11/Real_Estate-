import { useState, useEffect } from 'react';
import api from '../services/api';
import { MapPin, Bed, Bath, Square, Search, Filter, X, Map } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import PropertyMap from '../components/PropertyMap';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter States
    const [filters, setFilters] = useState({
        location: '',
        type: '',
        minPrice: '',
        maxPrice: ''
    });

    // Mobile filter visibility
    const [showFilters, setShowFilters] = useState(false);

    // View mode: list or map
    const [viewMode, setViewMode] = useState('list');

    const initialSearch = searchParams.get('search') || '';

    useEffect(() => {
        // Initialize filters from URL if needed, or just keep simple for now
        if (initialSearch) {
            // If search param exists, we might want to pre-fill location or just let the search param handle it
            // For now, keeping search param separate from explicit filters
        }
    }, [initialSearch]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            let url = '/properties/';
            const params = new URLSearchParams();

            if (initialSearch) params.append('search', initialSearch);
            if (filters.location) params.append('location', filters.location);
            if (filters.type && filters.type !== 'all') params.append('type', filters.type);
            if (filters.minPrice) params.append('min_price', filters.minPrice);
            if (filters.maxPrice) params.append('max_price', filters.maxPrice);

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await api.get(url);
            setProperties(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch properties:", err);
            setError("Could not load properties. Ensure backend is running.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [initialSearch]); // Re-fetch only on URL search change initially, apply filters manually

    const handleApplyFilters = (e) => {
        e.preventDefault();
        fetchProperties();
        setShowFilters(false); // Close mobile menu on apply
    };

    const handleClearFilters = () => {
        setFilters({
            location: '',
            type: '',
            minPrice: '',
            maxPrice: ''
        });
        // We can create a new promise or just set state and let the effect/function handle it 
        // But since fetchProperties uses the state directly, we need to wait for state update or pass defaults
        // Easiest is to just reload page or manually call fetch with defaults

        // Better:
        // We need to trigger a fetch with cleared values.
        // Since state updates are async, we can't just call fetchProperties() immediately after setFilters
        // We'll rely on a small trick or just pass empty object to a helper

        // For simplicity:
        window.location.href = '/properties';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <SEO
                title="Browse Properties"
                description="Explore our wide range of properties for sale and rent. Filter by location, price, and type to find your perfect match."
            />
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2"><span className="gradient-text">Find Your Home</span></h1>
                    <p className="text-text-muted">Browse our premium real estate inventory</p>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center gap-2 px-4 py-2 bg-card border border-white/10 rounded-lg text-white"
                >
                    <Filter size={18} /> Filters
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                    <div className="glass-panel p-6 rounded-2xl sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Filter size={20} className="text-primary" /> Filters
                            </h3>
                            {showFilters && (
                                <button onClick={() => setShowFilters(false)} className="lg:hidden">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleApplyFilters} className="space-y-6">
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Location</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="City, Zip, etc."
                                        value={filters.location}
                                        onChange={handleInputChange}
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Property Type</label>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleInputChange}
                                    className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="">All Types</option>
                                    <option value="sale">For Sale</option>
                                    <option value="rent">For Rent</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Price Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={handleInputChange}
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={handleInputChange}
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-glow transition-all active:scale-95"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="w-full py-3 bg-white/5 border border-white/10 text-text-muted font-medium rounded-xl hover:bg-white/10 transition-all active:scale-95"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full py-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
                        >
                            <Filter size={18} /> {showFilters ? 'Hide Filters' : 'Show Advanced Filters'}
                        </button>
                    </div>

                    {/* View Toggles */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-text-muted">
                            Showing <span className="text-white font-bold">{properties.length}</span> properties
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                            >
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
                            >
                                <Map size={16} /> Map
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="glass-panel p-8 text-center text-red-400 border border-red-500/20 rounded-3xl">
                            {error}
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="glass-panel p-16 text-center rounded-3xl border border-white/5">
                            <Search size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-white mb-2">No properties found</h3>
                            <p className="text-text-muted mb-6">Try adjusting your filters or search criteria.</p>
                            <button onClick={handleClearFilters} className="text-primary hover:underline">Clear all filters</button>
                        </div>
                    ) : viewMode === 'map' ? (
                        <div className="h-[600px] animate-fade-in">
                            <PropertyMap properties={properties} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 animate-fade-in">
                            {properties.map((property) => (
                                <Link to={`/properties/${property.id}`} key={property.id} className="group block">
                                    <div className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-glow transition-all duration-300 h-full flex flex-col">
                                        <div className="relative h-60 bg-dark/50 overflow-hidden">
                                            {property.images && property.images.length > 0 ? (
                                                <img
                                                    src={property.images[0].image_url}
                                                    alt={property.title}
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

                                            <p className="text-text-muted text-sm line-clamp-2 mb-4 flex-1">{property.description}</p>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-text-muted text-xs">
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
            </div >
        </div >
    );
};

export default Properties;
