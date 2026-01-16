import { Link } from 'react-router-dom';
import { Home, Search, User, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinkClass = "relative px-2 py-1 flex items-center gap-2 text-text-muted hover:text-white transition-colors font-medium group";
    const navLinkActive = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-100";
    // Hover underline effect
    const hoverEffect = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform group-hover:after:scale-x-100";

    const mobileNavLinkClass = "block py-3 px-4 text-lg hover:bg-white/5 rounded-lg transition-colors text-text-muted hover:text-white";

    return (
        <nav className="sticky top-0 z-50 glass-panel border-b-0 border-b-white/5 mb-[-1px]">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-glow group-hover:animate-float">
                        <Home size={18} strokeWidth={3} />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:text-white transition-all">EstateAI</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className={`${navLinkClass} ${hoverEffect}`}>
                        Home
                    </Link>
                    <Link to="/properties" className={`${navLinkClass} ${hoverEffect}`}>
                        Properties
                    </Link>

                    <div className="h-6 w-px bg-white/10 mx-2"></div>

                    {localStorage.getItem('token') ? (
                        <>
                            {(localStorage.getItem('role') === 'seller' || localStorage.getItem('role') === 'agent') && (
                                <Link to="/add-property" className={`${navLinkClass} ${hoverEffect}`}>
                                    Add Property
                                </Link>
                            )}
                            <Link to="/profile" className={`${navLinkClass} ${hoverEffect}`}>
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.reload();
                                }}
                                className="ml-4 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 text-text-muted font-medium transition-all duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium transition-all duration-300">
                                Login
                            </Link>
                            <Link to="/register" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-white/10 animate-fade-in p-4 shadow-2xl">
                        <div className="flex flex-col gap-2">
                            <Link to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Home</Link>
                            <Link to="/properties" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Properties</Link>
                            <div className="h-px bg-white/5 my-2"></div>
                            {localStorage.getItem('token') ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Profile</Link>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            setIsOpen(false);
                                            window.location.reload();
                                        }}
                                        className="text-left bg-red-500/10 text-red-400 py-3 px-4 rounded-lg font-medium hover:bg-red-500/20 transition-colors mt-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>Login</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-center rounded-lg bg-primary text-white font-bold mt-2">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
