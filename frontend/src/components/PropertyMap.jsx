import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

// Fix for default marker icon missing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const PropertyMap = ({ properties, center = [40.7128, -74.0060], zoom = 12, height = "400px" }) => {
    const navigate = useNavigate();

    // Ensure properties is an array
    const props = Array.isArray(properties) ? properties : [properties];

    // Helper to get coordinates (Mocking based on string if lat/lng missing)
    // In a real app, these would come from the database
    const getCoords = (prop, index) => {
        if (prop.lat && prop.lng) return [prop.lat, prop.lng];

        // Pseudo-random spread for demo based on index or string hash
        // Centered around NYC/Default center
        const offset = 0.02;
        const lat = center[0] + (Math.sin(index * 132.1) * offset);
        const lng = center[1] + (Math.cos(index * 321.4) * offset);
        return [lat, lng];
    };

    return (
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg z-0 relative">
            <MapContainer center={center} zoom={zoom} style={{ height: height, width: "100%", zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {props.map((prop, idx) => {
                    const position = getCoords(prop, idx);
                    return (
                        <Marker key={prop.id || idx} position={position}>
                            <Popup>
                                <div className="min-w-[200px]">
                                    <div className="h-24 w-full mb-2 rounded-lg overflow-hidden relative">
                                        <img
                                            src={prop.images?.[0]?.image_url || 'https://via.placeholder.com/300'}
                                            alt={prop.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                            ₹{prop.price?.toLocaleString()}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-sm truncate">{prop.title}</h3>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                                        <MapPin size={10} /> {prop.location}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/properties/${prop.id}`)}
                                        className="w-full bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 transition"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default PropertyMap;
