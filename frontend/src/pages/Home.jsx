import { useState, useEffect } from 'react';
import { ArrowRight, Search, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEO from '../components/SEO';

const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/properties/?limit=6');
                setFeaturedProperties(response.data);
            } catch (err) {
                console.error("Failed to fetch properties", err);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div className="min-h-screen bg-dark text-text-main">
            <SEO
                title="Home"
                description="Welcome to EstateAI. Find your dream home, sell properties faster, and grow your real estate business with our AI-powered platform."
            />
            {/* Hero Section */}
            <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
                {/* Background Gradients & Image */}
                <div className="absolute inset-0 bg-dark z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"></div>
                </div>

                <div className="absolute inset-0 opacity-30 z-0 bg-[url('https://images.unsplash.com/photo-1600596542815-2a440436f2e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-0"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    {localStorage.getItem('role') === 'seller' ? (
                        <>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 animate-fade-in">
                                <span className="text-secondary font-medium tracking-wide text-sm">FOR SELLERS</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
                                Sell Your Property <span className="gradient-text">Faster</span>
                            </h1>
                            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto animate-fade-in delay-100">
                                Reach millions of buyers with our AI-powered listing optimization tools.
                            </p>
                            <Link to="/add-property" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-glow hover:scale-105">
                                List Property Now
                            </Link>
                        </>
                    ) : localStorage.getItem('role') === 'agent' ? (
                        <>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 animate-fade-in">
                                <span className="text-accent font-medium tracking-wide text-sm">FOR AGENTS</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
                                Grow Your <span className="gradient-text">Real Estate Business</span>
                            </h1>
                            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto animate-fade-in delay-100">
                                Manage clients, track leads, and close deals faster with our professional suite.
                            </p>
                            <Link to="/profile" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-glow hover:scale-105">
                                Go to Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 animate-fade-in">
                                <span className="text-primary font-medium tracking-wide text-sm">#1 REAL ESTATE PLATFORM</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight animate-fade-in">
                                Find Your <span className="gradient-text">Dream Home</span>
                            </h1>
                            <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto animate-fade-in delay-100">
                                Discover luxury properties, exclusive estates, and modern homes with our AI-powered real estate platform.
                            </p>

                            <div className="max-w-4xl mx-auto glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-2 animate-fade-in delay-200 hover:shadow-glow transition-shadow duration-500">
                                <div className="flex-1 relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by location, property type..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full bg-transparent border border-transparent focus:border-white/10 rounded-xl outline-none text-white placeholder-text-muted pl-12 pr-4 py-4 transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                >
                                    Search Properties
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Featured Section */}
            <section className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured <span className="text-primary">Properties</span></h2>
                        <p className="text-text-muted text-lg">Handpicked selection of the finest properties.</p>
                    </div>
                    <Link to="/properties" className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all">
                        <span className="font-medium group-hover:text-primary transition-colors">View All</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform group-hover:text-primary" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProperties.map((property) => (
                        <Link to={`/properties/${property.id}`} key={property.id} className="group block h-full">
                            <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:shadow-glow transition-all duration-500">
                                <div className="h-64 overflow-hidden relative">
                                    {property.images && property.images.length > 0 ? (
                                        <img
                                            src={property.images[0].image_url}
                                            alt={property.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-dark/50 text-text-muted">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        {property.isFeatured && (
                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                                                ✨ Featured
                                            </div>
                                        )}
                                        <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/10 shadow-lg">
                                            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-card/90 backdrop-blur-md p-3 rounded-xl border border-white/5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <p className="text-sm text-text-muted line-clamp-1">{property.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col bg-card/30">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                                    <div className="flex items-center gap-2 text-text-muted text-sm mb-6">
                                        <MapPin size={16} className="text-secondary" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                            ₹{property.price.toLocaleString()}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                            <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;

