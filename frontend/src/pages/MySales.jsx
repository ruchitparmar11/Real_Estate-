import { useState, useEffect } from 'react';
import api from '../services/api'; // Use centralized api
import { DollarSign, Calendar, MapPin, User, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MySales = () => {
    const [salesData, setSalesData] = useState({ transactions: [], total_earnings: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await api.get('/analytics/sales');
                setSalesData(response.data);
            } catch (err) {
                console.error("Failed to fetch sales data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen py-12 px-4 container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Sales Dashboard</h1>
            <p className="text-text-muted mb-8">Track your property sales and earnings.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-text-muted mb-1">Total Earnings</p>
                        <h2 className="text-4xl font-bold text-green-400">
                            ₹{salesData.total_earnings.toLocaleString()}
                        </h2>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-text-muted mb-1">Properties Sold</p>
                        <h2 className="text-4xl font-bold text-white">
                            {salesData.count}
                        </h2>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-primary" /> Transaction History
            </h2>

            {salesData.transactions.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl text-center border border-white/5">
                    <p className="text-text-muted text-lg">No sales recorded yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {salesData.transactions.map((sale) => (
                        <div key={sale._id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                {/* Property Image */}
                                <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden bg-dark shrink-0">
                                    {sale.property_id?.images?.[0]?.image_url ? (
                                        <img
                                            src={sale.property_id.images[0].image_url}
                                            alt="Property"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No Image</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 w-full text-center md:text-left">
                                    <h3 className="font-bold text-lg text-white mb-1">{sale.property_id?.title || 'Unknown Property'}</h3>
                                    <div className="text-text-muted text-sm flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center md:justify-start">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {sale.property_id?.location}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(sale.transaction_date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Buyer Info */}
                                <div className="text-center md:text-right min-w-[200px] bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Sold To</div>
                                    <div className="font-bold text-white flex items-center justify-center md:justify-end gap-2">
                                        <User size={16} className="text-primary" /> {sale.buyer_id?.name || 'Unknown Buyer'}
                                    </div>
                                    <div className="text-xs text-text-muted mt-1">{sale.buyer_id?.email}</div>
                                </div>

                                {/* Amount */}
                                <div className="text-center md:text-right items-center">
                                    <div className="text-2xl font-bold text-green-400">
                                        +₹{sale.amount.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-text-muted uppercase bg-green-500/10 text-green-400 px-2 py-0.5 rounded inline-block mt-1">
                                        Completed
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySales;
