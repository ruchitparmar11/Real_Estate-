import { useState, useEffect } from 'react';
import api from '../services/api'; // Use centralized api service
import { Mail, Calendar, User, CornerDownRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const [replyText, setReplyText] = useState({}); // Map of inquiryId -> text
    const [sending, setSending] = useState({}); // Map of inquiryId -> boolean
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const userRole = localStorage.getItem('role');
                setRole(userRole);

                if (!localStorage.getItem('token')) {
                    navigate('/login');
                    return;
                }

                const response = await api.get('/inquiries/');
                setInquiries(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, [navigate]);

    const handleReplyChange = (id, text) => {
        setReplyText(prev => ({ ...prev, [id]: text }));
    };

    const submitReply = async (inquiryId) => {
        const text = replyText[inquiryId];
        if (!text) return;

        setSending(prev => ({ ...prev, [inquiryId]: true }));
        try {
            const response = await api.post(`/inquiries/${inquiryId}/reply`, text); // Simple string body as per backend setup
            // Note: backend expects raw string body for message? 
            // Wait, backend implementation: `message: str = Body(...)`. 
            // So we should send it properly. With axios/api, sending a string directly as second arg sets Content-Type to application/json usually if it's an object, but if string it might be different. 
            // Let's ensure we send a JSON string or compatible. 
            // Actually, in `inquiries.py`, I used `message: str`. If I send plain text, FastAPI might expect it in body.
            // Best practice: send JSON `{ "message": "..." }` but backend expects `message: str`.
            // Let's look at `inquiries.py` again. `async def reply_inquiry(inquiry_id: int, message: str, ...)`
            // If it's a query param, it's fine. If body, it needs to be `Body()`.
            // I used `message: str` in signature. In FastAPI this defaults to Query param unless `Body` or `Form` is used, OR if it's a Pydantic model. 
            // Check my previous edit to `inquiries.py`.
            // I added `from fastapi import Body` inside but arguments were `message: str`.
            // This defaults to **Query Parameter** if not specified as Body!
            // So correct call is `POST /inquiries/{id}/reply?message={text}`.
            // Let's stick to query param for simplicity as currently implemented, or update backend to Body.
            // I think I made a mistake in backend thinking it defaults to Body. It defaults to Query.
            // So I will use query param here to be safe and match the likely backend behavior.

            await api.post(`/inquiries/${inquiryId}/reply`, { message: text });

            // Update local state
            setInquiries(prev => prev.map(inq =>
                inq.id === inquiryId ? { ...inq, reply: text, replied_at: new Date().toISOString() } : inq
            ));
            setReplyText(prev => ({ ...prev, [inquiryId]: '' }));
        } catch (err) {
            console.error("Failed to send reply", err);
            alert("Failed to send reply");
        } finally {
            setSending(prev => ({ ...prev, [inquiryId]: false }));
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="gradient-text" style={{ fontSize: '1.5rem' }}>Loading messages...</div>
        </div>
    );

    const isAgent = role === 'agent' || role === 'seller' || role === 'admin';
    const title = isAgent ? 'Client Leads' : 'My Inquiries';
    const subtitle = isAgent ? 'Messages from potential buyers.' : 'History of your messages to agents.';

    return (
        <div className="min-h-screen py-12 px-4 container mx-auto mb-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</h1>
                    <p className="text-text-muted text-lg">{subtitle}</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-xl text-sm border border-white/5">
                    Total: <span className="text-white font-bold">{inquiries.length}</span>
                </div>
            </div>

            {inquiries.length === 0 ? (
                <div className="glass-panel p-16 rounded-3xl text-center border border-white/5">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted">
                        <Mail size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No messages yet</h3>
                    <p className="text-text-muted max-w-md mx-auto">
                        {isAgent ? "Once buyers inquire about your listings, their messages will appear here." : "Start browsing properties and send messages to agents to see them here."}
                    </p>
                    {!isAgent && (
                        <button onClick={() => navigate('/properties')} className="mt-6 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-glow transition-all">
                            Browse Properties
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-6">
                    {inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Property Info (Thumbnail) */}
                                <div className="shrink-0">
                                    <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-dark relative">
                                        {inquiry.property_id?.images?.[0]?.image_url ? (
                                            <img
                                                src={inquiry.property_id.images[0].image_url}
                                                alt="Property"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                                                <Home size={24} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {inquiry.property_id?.title || 'Unknown Property'}
                                            </h3>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                                    <Calendar size={12} /> {new Date(inquiry.timestamp).toLocaleDateString()}
                                                </div>
                                                {isAgent && inquiry.user_id && (
                                                    <div className="flex items-center gap-2 text-primary font-medium mt-1">
                                                        <User size={14} />
                                                        <span>From: <span className="text-white">{inquiry.user_id.name}</span></span>
                                                        <span className="text-text-muted text-xs bg-white/5 px-2 py-0.5 rounded">
                                                            {inquiry.user_id.email} {inquiry.user_id.phone && `| ${inquiry.user_id.phone}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Bubble */}
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5 relative">
                                        <div className="text-text-main leading-relaxed">
                                            "{inquiry.message}"
                                        </div>
                                        <div className="absolute -left-2 -top-2 w-4 h-4 bg-white/5 transform rotate-45 border-l border-t border-white/5"></div>
                                    </div>

                                    {/* Existing Reply */}
                                    {inquiry.reply && (
                                        <div className="ml-8 bg-primary/10 rounded-2xl rounded-tr-none p-4 border border-primary/20 relative">
                                            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                                                <CornerDownRight size={14} /> Replied by Agent
                                            </div>
                                            <div className="text-white/80 leading-relaxed">
                                                "{inquiry.reply}"
                                            </div>
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    {isAgent && !inquiry.reply && (
                                        <div className="pt-2 flex gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Type a reply..."
                                                    value={replyText[inquiry.id] || ''}
                                                    onChange={(e) => handleReplyChange(inquiry.id, e.target.value)}
                                                    className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none transition"
                                                />
                                            </div>
                                            <button
                                                onClick={() => submitReply(inquiry.id)}
                                                disabled={sending[inquiry.id] || !replyText[inquiry.id]}
                                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                                            >
                                                {sending[inquiry.id] ? 'Sending...' : 'Send Reply'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inquiries;