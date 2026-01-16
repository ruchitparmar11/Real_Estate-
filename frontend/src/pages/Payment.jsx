import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Lock, Calendar, CheckCircle } from 'lucide-react';

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Mock Form State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await api.get(`/properties/${id}`);
                setProperty(response.data);
            } catch (err) {
                console.error(err);
                alert("Property not found");
                navigate('/properties');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate network delay for "processing"
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                await api.post(`/properties/${id}/buy`);
                setPaymentSuccess(true);
            } catch (err) {
                alert(err.response?.data?.detail || 'Payment failed. Please try again.');
                setProcessing(false);
            }
        }, 2000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    if (paymentSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-lg w-full text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
                    <p className="text-text-muted mb-8">
                        Congratulations! You are now the proud owner of <strong className="text-white">{property.title}</strong>.
                    </p>
                    <button
                        onClick={() => navigate('/my-listings')}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-glow transition-all"
                    >
                        View My Properties
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-text-muted hover:text-white transition-colors text-sm"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Order Summary */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">Checkout</h1>

                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-text-muted uppercase tracking-wider text-xs font-bold mb-4">Order Summary</h3>
                        <div className="flex gap-4 mb-6">
                            {property.images && property.images.length > 0 && (
                                <img src={property.images[0].image_url} alt="" className="w-24 h-24 rounded-lg object-cover" />
                            )}
                            <div>
                                <h4 className="font-bold text-lg">{property.title}</h4>
                                <p className="text-text-muted text-sm">{property.location}</p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-text-muted">Property Price</span>
                                <span>₹{property.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">Processing Fee (1%)</span>
                                <span>₹{(property.price * 0.01).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4 mt-2">
                                <span>Total</span>
                                <span className="text-primary">₹{(property.price * 1.01).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-muted bg-white/5 p-4 rounded-xl border border-white/5">
                        <Lock size={16} />
                        Your transaction is secured with SSL encryption.
                    </div>
                </div>

                {/* Payment Form */}
                <div className="glass-panel p-8 rounded-3xl h-fit">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Payment Method</h2>
                        <div className="flex gap-2">
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold">MC</div>
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Cardholder Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-4 pr-4 text-white focus:border-primary/50 outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-muted">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={e => {
                                        const v = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                        setCardNumber(v);
                                    }}
                                    className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition font-mono"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">Expiry Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        value={expiry}
                                        onChange={e => {
                                            let v = e.target.value.replace(/\D/g, '');
                                            if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                                            setExpiry(v);
                                        }}
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary/50 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-muted">CVC</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="text"
                                        placeholder="123"
                                        maxLength={3}
                                        value={cvc}
                                        onChange={e => setCvc(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-dark/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary/50 outline-none transition font-mono"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-glow hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 mt-4"
                        >
                            {processing ? 'Processing Payment...' : `Pay ₹${(property.price * 1.01).toLocaleString()}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
