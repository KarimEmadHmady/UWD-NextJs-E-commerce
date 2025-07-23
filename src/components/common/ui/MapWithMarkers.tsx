import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

interface Branch {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export default function MapWithMarkers({ branches }: { branches: Branch[] }) {
  const center = branches.length > 0 ? [branches[0].lat, branches[0].lng] : [30.0444, 31.2357];
  return (
    <MapContainer center={center as [number, number]} zoom={6} scrollWheelZoom={true} style={{ width: '100%', height: '100%', minHeight: 300, borderRadius: 12 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {branches.map((branch, idx) => (
        <Marker key={idx} position={[branch.lat, branch.lng]} icon={markerIcon}>
          <Popup>
            <b>{branch.name}</b><br />
            {branch.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 