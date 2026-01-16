import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'buyer'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:8000/auth/google', {
                token: credentialResponse.credential,
                role: formData.role
            });
            localStorage.setItem('token', response.data.access_token);
            const userRole = response.data.user.role;
            localStorage.setItem('role', userRole);

            if (userRole === 'visitor') {
                navigate('/role-selection');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setError('Unable to connect to server.');
            } else {
                setError('Google Signup Failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Signup Failed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:8000/auth/register', formData);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.user.role);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setError('Unable to connect to server. Please ensure the backend is running.');
            } else {
                setError(err.response?.data?.detail || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10 glass-panel p-8 md:p-12 rounded-3xl animate-fade-in">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-tr from-secondary to-primary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-glow">
                            <Shield className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-text-muted">Join our community of real estate enthusiasts.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-muted mb-2 group-focus-within:text-secondary transition-colors">Full Name</label>
                            <User className="absolute left-4 top-[2.4rem] text-text-muted group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-muted mb-2 group-focus-within:text-secondary transition-colors">Email Address</label>
                            <Mail className="absolute left-4 top-[2.4rem] text-text-muted group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-muted mb-2 group-focus-within:text-secondary transition-colors">Phone Number</label>
                            <svg className="absolute left-4 top-[2.4rem] text-text-muted group-focus-within:text-secondary transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
                                placeholder="+1 (555) 000-0000"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-muted mb-2 group-focus-within:text-secondary transition-colors">Password</label>
                            <Lock className="absolute left-4 top-[2.4rem] text-text-muted group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
                                placeholder="Create a strong password"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-muted mb-2 group-focus-within:text-secondary transition-colors">I am a...</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="buyer" className="bg-slate-800">Buyer</option>
                                    <option value="seller" className="bg-slate-800">Seller</option>
                                    <option value="agent" className="bg-slate-800">Agent</option>
                                    <option value="tenant" className="bg-slate-800">Tenant</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#0F172A] text-text-muted">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="filled_black"
                                shape="pill"
                                text="signup_with"
                                width="300"
                            />
                        </div>
                    </div>

                    <p className="text-center text-text-muted text-sm pt-4">
                        Already have an account?
                        <Link to="/login" className="text-secondary hover:text-primary font-bold ml-1 transition-colors">Sign In</Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Decoration */}
            <div className="hidden lg:block relative overflow-hidden order-first">
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary/80 to-primary/80 mix-blend-multiply z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                    alt="Modern Real Estate"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-dark to-transparent">
                    <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
                    <p className="text-lg text-white/80 max-w-md">Join thousands of users finding their perfect space with ease.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
