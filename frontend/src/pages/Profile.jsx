import { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Phone, Shield, LogOut, LayoutDashboard, Heart, MessageSquare, BarChart2, PlusCircle, FileText, Home, ShoppingBag, DollarSign, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Failed to load profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const DashboardCard = ({ title, description, icon: Icon, onClick, primary = false }) => (
        <button
            onClick={onClick}
            className={`group text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${primary
                ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 hover:shadow-glow'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${primary ? 'bg-primary text-white shadow-lg' : 'bg-white/10 text-white'
                }`}>
                <Icon size={24} />
            </div>
            <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-sm text-text-muted">{description}</p>
            {primary && <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
        </button>
    );

    const renderRoleSpecificContent = () => {
        return (
            <div className="mt-12 animate-fade-in delay-200">
                <div className="flex items-center gap-3 mb-6">
                    <LayoutDashboard className="text-primary" />
                    <h3 className="text-2xl font-bold">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.role === 'buyer' && (
                        <>
                            <DashboardCard
                                title="My Purchases"
                                description="View properties you have purchased."
                                icon={ShoppingBag}
                                onClick={() => navigate('/my-purchases')}
                                primary
                            />
                            <DashboardCard
                                title="Saved Properties"
                                description="Access your shortlisted dream homes."
                                icon={Heart}
                                onClick={() => navigate('/wishlist')}
                            />
                            <DashboardCard
                                title="My Inquiries"
                                description="Track status of your property inquiries."
                                icon={MessageSquare}
                                onClick={() => navigate('/inquiries')}
                            />
                        </>
                    )}

                    {user.role === 'seller' && (
                        <>
                            <DashboardCard
                                title="My Listings"
                                description="Manage your active property listings."
                                icon={Home}
                                onClick={() => navigate('/my-listings')}
                                primary
                            />
                            <DashboardCard
                                title="List New Property"
                                description="Create a new listing to reach buyers."
                                icon={PlusCircle}
                                onClick={() => navigate('/add-property')}
                            />
                            <DashboardCard
                                title="Analytics"
                                description="See performance stats for your listings."
                                icon={BarChart2}
                                onClick={() => navigate('/analytics')}
                            />
                            <DashboardCard
                                title="My Sales"
                                description="View sold properties and earnings."
                                icon={DollarSign}
                                onClick={() => navigate('/my-sales')}
                            />
                            <DashboardCard
                                title="Buyer Messages"
                                description="Respond to buyers interested in your properties."
                                icon={MessageSquare}
                                onClick={() => navigate('/inquiries')}
                            />
                        </>
                    )}

                    {user.role === 'agent' && (
                        <>
                            <DashboardCard
                                title="Client Leads"
                                description="Manage and respond to potential buyers."
                                icon={MessageSquare}
                                onClick={() => navigate('/inquiries')}
                                primary
                            />
                            <DashboardCard
                                title="Portfolio"
                                description="Update and manage your property portfolio."
                                icon={Home}
                                onClick={() => navigate('/my-listings')}
                            />
                            <DashboardCard
                                title="Market Insights"
                                description="Track real-time market trends."
                                icon={BarChart2}
                                onClick={() => navigate('/analytics')}
                            />
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <DashboardCard
                                title="Platform Analytics"
                                description="View system-wide performance and revenue."
                                icon={BarChart2}
                                onClick={() => navigate('/analytics')}
                                primary
                            />
                            <DashboardCard
                                title="Manage Properties"
                                description="Review and approve listings."
                                icon={Home}
                                onClick={() => navigate('/properties')}
                            />
                            <DashboardCard
                                title="My Purchases"
                                description="Test purchase flow."
                                icon={ShoppingBag}
                                onClick={() => navigate('/my-purchases')}
                            />
                        </>
                    )}

                    {user.role === 'tenant' && (
                        <>
                            <DashboardCard
                                title="Applications"
                                description="Track your rental application status."
                                icon={FileText}
                                onClick={() => navigate('/applications')}
                                primary
                            />
                            <DashboardCard
                                title="Lease Documents"
                                description="Access your active lease agreements."
                                icon={Shield}
                                onClick={() => { }}
                            />
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-text-muted animate-pulse">Loading profile...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mb-2">
                <Shield size={32} />
            </div>
            <h2 className="text-2xl font-bold text-red-400">{error}</h2>
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition">
                Return to Login
            </button>
        </div>
    );

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Profile Header Card */}
                <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden animate-fade-in">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar */}
                        <div className="shrink-0 relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-glow">
                                <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
                                    <User size={64} className="text-white/80" />
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-dark" title="Active"></div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-6 capitalize">
                                <Shield size={14} />
                                {user.role} Account
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Mail className="text-text-muted shrink-0" size={20} />
                                    <div className="text-left overflow-hidden">
                                        <p className="text-xs text-text-muted uppercase font-semibold">Email</p>
                                        <p className="truncate text-sm font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Phone className="text-text-muted shrink-0" size={20} />
                                    <div className="text-left">
                                        <p className="text-xs text-text-muted uppercase font-semibold">Phone</p>
                                        <p className="truncate text-sm font-medium">{user.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-medium h-fit"
                            >
                                <LogOut size={18} /> Logout
                            </button>

                            {user.isVerified ? (
                                <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-medium h-fit cursor-default">
                                    <BadgeCheck size={18} /> Verified
                                </div>
                            ) : user.verificationStatus === 'pending' ? (
                                <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-medium h-fit cursor-default">
                                    <Shield size={18} /> Pending
                                </div>
                            ) : (
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            await api.post('/auth/request-verification');
                                            setUser(prev => ({ ...prev, verificationStatus: 'pending' }));
                                            alert('Verification requested successfully!');
                                        } catch (e) {
                                            alert('Failed to request verification');
                                        }
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors font-medium h-fit"
                                >
                                    <Shield size={18} /> Request Verification
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                {renderRoleSpecificContent()}

            </div>
        </div>
    );
};

export default Profile;
