import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useRef } from 'react';
import L from 'leaflet';

interface ManualMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function DraggableMarker({ lat, lng, onChange }: ManualMapProps) {
  const markerRef = useRef<any>(null);
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return (
    <Marker
      position={[lat, lng]}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = markerRef.current;
          if (marker) {
            const pos = marker.getLatLng();
            onChange(pos.lat, pos.lng);
          }
        },
      }}
      ref={markerRef}
    />
  );
}

export default function ManualMap({ lat, lng, onChange }: ManualMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '210px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker lat={lat} lng={lng} onChange={onChange} />
    </MapContainer>
  );
} 