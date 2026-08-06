import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/*
  Read-only route map for the ride detail modal: pickup pin, dropoff pin,
  and a straight line between them. Uses free OpenStreetMap tiles (no API
  key) — same approach as the rider web app.

  Rides created before Places Autocomplete stored coordinates have null
  lat/lng; callers should render the fallback instead of this component.
*/

// Leaflet's default marker icons reference bundler-relative asset paths that
// break under Vite. Build simple colored div markers instead.
const pinIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<span style="
      display:block;width:16px;height:16px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 0 0 1px rgba(0,0,0,.25);"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const PICKUP_COLOR = '#16a34a'; // green-600
const DROPOFF_COLOR = '#dc2626'; // red-600

export default function RideRouteMap({
  pickUpLat,
  pickUpLng,
  dropOffLat,
  dropOffLng,
  pickUp,
  dropOff,
}) {
  const hasPickup = pickUpLat != null && pickUpLng != null;
  const hasDropoff = dropOffLat != null && dropOffLng != null;
  if (!hasPickup && !hasDropoff) return null;

  const points = [];
  if (hasPickup) points.push([pickUpLat, pickUpLng]);
  if (hasDropoff) points.push([dropOffLat, dropOffLng]);

  // Fit both pins when we have them; otherwise center on the single point.
  const bounds = points.length > 1 ? points : undefined;
  const center = points[0];

  return (
    <div className="h-56 w-full rounded-lg overflow-hidden border border-admin-200">
      <MapContainer
        center={center}
        zoom={14}
        bounds={bounds}
        boundsOptions={{ padding: [30, 30] }}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasPickup && (
          <Marker position={[pickUpLat, pickUpLng]} icon={pinIcon(PICKUP_COLOR)}>
            <Popup>Pick up: {pickUp}</Popup>
          </Marker>
        )}

        {hasDropoff && (
          <Marker position={[dropOffLat, dropOffLng]} icon={pinIcon(DROPOFF_COLOR)}>
            <Popup>Drop off: {dropOff}</Popup>
          </Marker>
        )}

        {points.length > 1 && (
          <Polyline positions={points} pathOptions={{ color: '#0e7490', weight: 3, dashArray: '6 6' }} />
        )}
      </MapContainer>
    </div>
  );
}
