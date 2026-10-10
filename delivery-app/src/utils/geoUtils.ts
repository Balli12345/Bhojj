import { Coordinates, RiderLiveTelemetry } from '../types';

/**
 * Standard Haversine Distance in Kilometers
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Calculate compass bearing in degrees (0 to 360) from coord1 to coord2
 */
export function calculateBearing(coord1: Coordinates, coord2: Coordinates): number {
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

/**
 * Waypoints along the primary Satvik delivery corridor in Goverdhan / Braj
 * from Royal Rasoi Bhojnalaya (Dan Ghati) to Anand Heights (Vijay Nagar / Govardhan)
 */
export const DEFAULT_DELIVERY_ROUTE: Coordinates[] = [
  { lat: 27.5015, lng: 77.4645 }, // 0: Kitchen (Shri Giriraj / Royal Rasoi, Dan Ghati Marg)
  { lat: 27.5032, lng: 77.4658 }, // 1: Dan Ghati Mandir Chowk
  { lat: 27.5055, lng: 77.4675 }, // 2: Manasi Ganga Kund Marg
  { lat: 27.5078, lng: 77.4690 }, // 3: Parikrama Marg Turn
  { lat: 27.5098, lng: 77.4715 }, // 4: Goverdhan Bus Stand Crossing
  { lat: 27.5125, lng: 77.4735 }, // 5: Govardhan Link Canal Road
  { lat: 27.5148, lng: 77.4755 }, // 6: Anand Vihar / Vijay Nagar Gate
  { lat: 27.5165, lng: 77.4770 }, // 7: Anand Heights Society Turn
  { lat: 27.5180, lng: 77.4785 }, // 8: Customer Doorstep (Flat 402, Anand Heights)
];

/**
 * Interpolate location along route given progress fraction (0.0 to 1.0)
 */
export function getRoutePositionAtProgress(
  route: Coordinates[],
  progress: number
): { location: Coordinates; heading: number; segmentIndex: number } {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  if (route.length < 2) {
    return {
      location: route[0] || { lat: 27.5015, lng: 77.4645 },
      heading: 0,
      segmentIndex: 0,
    };
  }

  const totalSegments = route.length - 1;
  const scaled = clampedProgress * totalSegments;
  const segmentIndex = Math.min(Math.floor(scaled), totalSegments - 1);
  const fraction = scaled - segmentIndex;

  const start = route[segmentIndex];
  const end = route[segmentIndex + 1];

  const lat = start.lat + (end.lat - start.lat) * fraction;
  const lng = start.lng + (end.lng - start.lng) * fraction;
  const heading = calculateBearing(start, end);

  return {
    location: {
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    },
    heading,
    segmentIndex,
  };
}

/**
 * Format Latitude & Longitude in GPS format: 27.5098° N, 77.4715° E
 */
export function formatCoordinates(coords: Coordinates): string {
  const latDir = coords.lat >= 0 ? 'N' : 'S';
  const lngDir = coords.lng >= 0 ? 'E' : 'W';
  return `${Math.abs(coords.lat).toFixed(4)}° ${latDir}, ${Math.abs(coords.lng).toFixed(4)}° ${lngDir}`;
}
