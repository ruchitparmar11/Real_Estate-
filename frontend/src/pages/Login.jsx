
import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
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
            const response = await api.post('/auth/google', {
                token: credentialResponse.credential
            });
            localStorage.setItem('token', response.data.access_token);
            const userRole = response.data.user.role;
            localStorage.setItem('role', userRole);
            window.dispatchEvent(new Event('storage'));

            if (userRole === 'visitor' || !response.data.user.phone) {
                navigate('/role-selection');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Google Login Failed. Please try again.');
            console.error('Google Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', {
                username: formData.username,
                password: formData.password
            });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.user.role);
            window.dispatchEvent(new Event('storage'));
            navigate('/');
        } catch (err) {
            setError(err.response?.status === 401 ? 'Invalid email or password' : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div
                    className="w-full max-w-md space-y-8 relative z-10 glass-panel p-8 md:p-12 rounded-3xl animate-fade-in"
                >
                    <div className="text-center">
                        <div
                            className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-glow"
                        >
                            <User className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-text-muted">Enter your details to access your account.</p>
                    </div>

                    {error && (
                        <div
                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-muted mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
                            <Mail className="absolute left-4 top-[2.4rem] text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-medium text-text-muted mb-2 group-focus-within:text-primary transition-colors">Password</label>
                            <Lock className="absolute left-4 top-[2.4rem] text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-text-muted"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-primary transition-colors cursor-pointer" />
                                <span className="text-text-muted group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-primary hover:text-secondary transition-colors font-medium">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
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
                                text="signin_with"
                                width="300"
                            />
                        </div>
                    </div>

                    <p className="text-center text-text-muted text-sm">
                        Don't have an account?
                        <Link to="/register" className="text-primary hover:text-secondary font-bold ml-1 transition-colors">Create Account</Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image/Decoration */}
            <div className="hidden lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 mix-blend-multiply z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80"
                    alt="Luxury Home"
                    className="w-full h-full object-cover"
                />
                <div
                    className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-dark to-transparent"
                >
                    <h2 className="text-4xl font-bold mb-4">Find Your Dream Home</h2>
                    <p className="text-lg text-white/80 max-w-md">Access exclusive listings and connect with top agents in your area.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;