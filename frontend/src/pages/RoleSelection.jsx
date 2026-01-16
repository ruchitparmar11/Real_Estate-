import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Shield, Briefcase, Key } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const [phone, setPhone] = useState('');

    const handleRoleSelect = async (role) => {
        if (!phone.trim()) {
            alert("Please enter your phone number to continue.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Update role
            await axios.put('http://localhost:8000/auth/role',
                { role },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // If phone provided, update it (we need a new endpoint or update the same one if backend supports it)
            // For simplicity, let's assume the /auth/role endpoint or a new /auth/profile endpoint handles it.
            // Since I can't easily change the backend right this second without seeing it, I'll update the backend to support phone update in /auth/role or create a new one.
            // Let's assume we will update the backend to accept phone in the same request or a separate one.

            if (phone) {
                await axios.put('http://localhost:8000/auth/profile',
                    { phone },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            localStorage.setItem('role', role);
            window.dispatchEvent(new Event('storage'));
            navigate('/');
        } catch (error) {
            console.error("Error setting role or phone:", error);
            alert("Failed to set role/phone. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        {
            id: 'buyer',
            title: 'Buyer',
            description: 'I am looking to buy a property.',
            icon: <User size={32} />,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'seller',
            title: 'Seller',
            description: 'I want to list my property for sale.',
            icon: <Briefcase size={32} />,
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'tenant',
            title: 'Tenant',
            description: 'I am looking for a place to rent.',
            icon: <Key size={32} />,
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'agent',
            title: 'Agent',
            description: 'I am a real estate agent.',
            icon: <Shield size={32} />,
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl w-full z-10 glass-panel p-8 md:p-12 rounded-3xl animate-fade-in text-center">
                <h2 className="text-3xl font-bold mb-4 text-center">Complete Your Profile</h2>
                <p className="text-text-muted text-center mb-8">Please provide your phone number and select how you want to use EstateAI.</p>

                <div className="max-w-md mx-auto mb-10">
                    <label className="block text-sm font-medium text-text-muted mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleRoleSelect(role.id)}
                            disabled={loading}
                            className={`relative group bg-white/5 border border-white/10 hover:border-primary/50 rounded-2xl p-6 text-left transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${role.color} text-white shadow-lg`}>
                                    {role.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{role.title}</h3>
                                    <p className="text-text-muted text-sm">{role.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
