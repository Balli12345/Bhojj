import React, { useState, useEffect, useRef, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Order, RiderLiveTelemetry, Coordinates } from '../../types';
import { 
  Bike, 
  MapPin, 
  Navigation, 
  Compass, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Clock, 
  ShieldCheck, 
  Radio, 
  Gauge, 
  Layers, 
  Store,
  Home
} from 'lucide-react';
import { 
  DEFAULT_DELIVERY_ROUTE, 
  formatCoordinates, 
  calculateDistanceKm 
} from '../../utils/geoUtils';

interface LiveDeliveryMapProps {
  order: Order;
  telemetry?: RiderLiveTelemetry | null;
  isRiderView?: boolean;
  className?: string;
  height?: string;
  showControls?: boolean;
}

export const LiveDeliveryMap: React.FC<LiveDeliveryMapProps> = ({
  order,
  telemetry,
  isRiderView = false,
  className = '',
  height = 'h-80',
  showControls = true,
}) => {
  // Check for Google Maps API Key
  const rawKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  const hasValidGoogleKey = Boolean(
    rawKey && 
    rawKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' && 
    rawKey.trim().length > 10
  );

  // Map display settings
  const [mapTheme, setMapTheme] = useState<'street' | 'dark' | 'satellite'>('street');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [radarPulse, setRadarPulse] = useState(0);

  // Positions
  const kitchenCoords: Coordinates = useMemo(() => {
    return order.restaurantCoordinates || { lat: 27.5015, lng: 77.4645 };
  }, [order.restaurantCoordinates]);

  const dropoffCoords: Coordinates = useMemo(() => {
    return order.deliveryCoordinates || { lat: 27.5180, lng: 77.4785 };
  }, [order.deliveryCoordinates]);

  // Current Rider Position from Telemetry
  const riderCoords: Coordinates = useMemo(() => {
    if (telemetry?.location) {
      return telemetry.location;
    }
    // Default to mid-way if no telemetry is yet available
    return {
      lat: (kitchenCoords.lat + dropoffCoords.lat) / 2,
      lng: (kitchenCoords.lng + dropoffCoords.lng) / 2,
    };
  }, [telemetry, kitchenCoords, dropoffCoords]);

  const speedKmh = telemetry?.speedKmh ?? 26;
  const headingDeg = telemetry?.heading ?? 42;
  const remainingDist = telemetry?.remainingDistanceKm ?? calculateDistanceKm(riderCoords, dropoffCoords);
  const remainingMins = telemetry?.remainingMinutes ?? Math.max(1, Math.round(remainingDist * 2.8));
  const accuracy = telemetry?.accuracyMeters ?? 4;
  const isLiveGps = telemetry?.isLiveGps ?? false;

  // Radar ping animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarPulse(p => (p + 1) % 100);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Center coordinate
  const centerCoords = useMemo(() => {
    return {
      lat: riderCoords.lat,
      lng: riderCoords.lng,
    };
  }, [riderCoords]);

  // Handle Drag / Pan for Vector Map
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRecenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  // Convert geo-coordinates to normalized SVG/Canvas coordinates
  // Lat bounds: 27.4980 to 27.5220 (~2.6km)
  // Lng bounds: 77.4600 to 77.4820 (~2.4km)
  const minLat = 27.4980;
  const maxLat = 27.5220;
  const minLng = 77.4600;
  const maxLng = 77.4830;

  const projectToMap = (coord: Coordinates) => {
    const width = 800;
    const height = 500;
    const x = ((coord.lng - minLng) / (maxLng - minLng)) * (width - 160) + 80;
    // Invert lat for SVG y-axis
    const y = ((maxLat - coord.lat) / (maxLat - minLat)) * (height - 140) + 70;
    return { x: Math.round(x), y: Math.round(y) };
  };

  const kitchenPt = projectToMap(kitchenCoords);
  const dropoffPt = projectToMap(dropoffCoords);
  const riderPt = projectToMap(riderCoords);

  // Route path waypoints
  const routePoints = DEFAULT_DELIVERY_ROUTE.map(projectToMap);
  const routeSvgPath = routePoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  return (
    <div 
      className={`relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-slate-900 select-none ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl h-[calc(100vh-2rem)]' : height
      } ${className}`}
    >
      {/* 1. GOOGLE MAPS PLATFORM (If API Key is configured) */}
      {hasValidGoogleKey ? (
        <div className="w-full h-full relative">
          <APIProvider apiKey={rawKey}>
            <Map
              defaultCenter={{ lat: centerCoords.lat, lng: centerCoords.lng }}
              defaultZoom={15}
              mapId="BHOJJ_DELIVERY_TRACKER_MAP"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              disableDefaultUI={false}
              className="w-full h-full"
            >
              {/* Pickup / Restaurant Marker */}
              <AdvancedMarker position={{ lat: kitchenCoords.lat, lng: kitchenCoords.lng }}>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="bg-orange-600 text-white p-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1">
                    <Store className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase px-1">Kitchen</span>
                  </div>
                  <div className="w-2 h-2 bg-orange-600 rotate-45 -mt-1"></div>
                </div>
              </AdvancedMarker>

              {/* Rider Live Telemetry Marker */}
              <AdvancedMarker position={{ lat: riderCoords.lat, lng: riderCoords.lng }}>
                <div className="relative flex items-center justify-center cursor-pointer">
                  {/* Radar pulse wave */}
                  <div className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping"></div>
                  <div className="relative bg-slate-950 text-white p-2.5 rounded-full shadow-2xl border-2 border-amber-400">
                    <Bike 
                      className="w-5 h-5 text-amber-400 transition-transform duration-300"
                      style={{ transform: `rotate(${headingDeg}deg)` }} 
                    />
                  </div>
                </div>
              </AdvancedMarker>

              {/* Delivery Dropoff Marker */}
              <AdvancedMarker position={{ lat: dropoffCoords.lat, lng: dropoffCoords.lng }}>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="bg-emerald-600 text-white p-2 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase px-1">Destination</span>
                  </div>
                  <div className="w-2 h-2 bg-emerald-600 rotate-45 -mt-1"></div>
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>
        </div>
      ) : (
        /* 2. VECTOR REAL-TIME CARTOGRAPHY ENGINE (Self-contained interactive map) */
        <div 
          className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background Map Canvas Theme */}
          <div 
            className={`absolute inset-0 transition-colors duration-500 ${
              mapTheme === 'street' 
                ? 'bg-[#f4f3ed]' 
                : mapTheme === 'dark' 
                  ? 'bg-[#151821]' 
                  : 'bg-[#1a2e26]'
            }`}
          >
            {/* SVG Roads & Geography */}
            <svg 
              className="w-full h-full transition-transform duration-100 ease-out"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: `${riderPt.x}px ${riderPt.y}px`
              }}
            >
              <defs>
                {/* Route gradient */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>

                {/* Radar pulse animation */}
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                  <stop offset="70%" stopColor="#ea580c" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Water / Greenery zones */}
              <rect x="0" y="0" width="800" height="500" fill={mapTheme === 'street' ? '#f5f4ef' : mapTheme === 'dark' ? '#11131a' : '#14251e'} />
              
              {/* Sacred Kund / Waterbody (Manasi Ganga) */}
              <ellipse 
                cx="310" 
                cy="230" 
                rx="65" 
                ry="38" 
                fill={mapTheme === 'street' ? '#d4e8f7' : mapTheme === 'dark' ? '#182b3d' : '#1b3b3a'} 
                stroke={mapTheme === 'street' ? '#bad9f2' : '#223d54'} 
                strokeWidth="2" 
              />
              <text x="310" y="234" textAnchor="middle" fill={mapTheme === 'street' ? '#5a8cb5' : '#699ec7'} fontSize="9" fontWeight="700" fontFamily="sans-serif">
                Manasi Ganga Kund
              </text>

              {/* Green Park / Giriraj Govardhan Holy Hill Range */}
              <path 
                d="M 60,380 Q 200,320 380,410 T 740,360 L 800,500 L 0,500 Z" 
                fill={mapTheme === 'street' ? '#e4f0dc' : mapTheme === 'dark' ? '#18261e' : '#183624'} 
                opacity="0.85" 
              />
              <text x="210" y="440" fill={mapTheme === 'street' ? '#688c52' : '#5da872'} fontSize="10" fontWeight="800">
                ⛰️ Shri Giriraj Govardhan Parikrama Path
              </text>

              {/* Base Road Network (Town Grid) */}
              <g stroke={mapTheme === 'street' ? '#ffffff' : mapTheme === 'dark' ? '#252936' : '#23382c'} strokeLinecap="round" strokeLinejoin="round">
                {/* Main Arteries */}
                <line x1="20" y1="450" x2="780" y2="90" strokeWidth="18" />
                <line x1="80" y1="120" x2="720" y2="470" strokeWidth="14" />
                <line x1="160" y1="30" x2="680" y2="480" strokeWidth="10" />
                <line x1="40" y1="260" x2="760" y2="240" strokeWidth="12" />
                <line x1="240" y1="50" x2="260" y2="460" strokeWidth="9" />
                <line x1="520" y1="40" x2="550" y2="470" strokeWidth="11" />
              </g>

              {/* Road Casing for Street Mode */}
              {mapTheme === 'street' && (
                <g stroke="#e5e5dc" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <line x1="20" y1="450" x2="780" y2="90" strokeWidth="2" strokeDasharray="6,6" />
                  <line x1="40" y1="260" x2="760" y2="240" strokeWidth="2" strokeDasharray="6,6" />
                </g>
              )}

              {/* Road Names */}
              <text x="180" y="325" fill={mapTheme === 'street' ? '#8a8d94' : '#576075'} fontSize="9" fontWeight="700" transform="rotate(-26, 180, 325)">
                Dan Ghati Mandir Marg
              </text>
              <text x="440" y="235" fill={mapTheme === 'street' ? '#8a8d94' : '#576075'} fontSize="9" fontWeight="700">
                Govardhan Link Bypass
              </text>
              <text x="590" y="160" fill={mapTheme === 'street' ? '#8a8d94' : '#576075'} fontSize="9" fontWeight="700" transform="rotate(-26, 590, 160)">
                Mathura Road
              </text>

              {/* DELIVERY ROUTE HIGHLIGHT (Underlay Glow) */}
              <path 
                d={routeSvgPath}
                fill="none"
                stroke="#ea580c"
                strokeWidth="10"
                strokeOpacity="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Primary Active Delivery Route Polyline */}
              <path 
                d={routeSvgPath}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Pulsing Energy Animation along Route */}
              <path 
                d={routeSvgPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="8,16"
                strokeDashoffset={-radarPulse * 2}
                strokeLinecap="round"
                strokeOpacity="0.7"
              />

              {/* 1. KITCHEN / RESTAURANT MARKER */}
              <g transform={`translate(${kitchenPt.x}, ${kitchenPt.y})`}>
                <circle r="18" fill="#ea580c" fillOpacity="0.15" />
                <circle r="12" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">👨‍🍳</text>
                
                {/* Kitchen Label Callout */}
                <g transform="translate(0, -22)">
                  <rect x="-65" y="-18" width="130" height="20" rx="8" fill="#1e293b" fillOpacity="0.95" />
                  <text x="0" y="-4" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="800">
                    {order.restaurantName || 'Royal Rasoi Kitchen'}
                  </text>
                </g>
              </g>

              {/* 2. DESTINATION / CUSTOMER MARKER */}
              <g transform={`translate(${dropoffPt.x}, ${dropoffPt.y})`}>
                <circle r="18" fill="#10b981" fillOpacity="0.15" />
                <circle r="12" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">🏠</text>

                {/* Destination Label Callout */}
                <g transform="translate(0, -22)">
                  <rect x="-65" y="-18" width="130" height="20" rx="8" fill="#064e3b" fillOpacity="0.95" />
                  <text x="0" y="-4" textAnchor="middle" fill="#ecfdf5" fontSize="9" fontWeight="800">
                    Customer Doorstep
                  </text>
                </g>
              </g>

              {/* 3. LIVE RIDER MARKER (Animated Telemetry) */}
              <g transform={`translate(${riderPt.x}, ${riderPt.y})`}>
                {/* Outer expanding sonar ring */}
                <circle r="36" fill="url(#radarGlow)" className="animate-pulse" />
                <circle 
                  r="24" 
                  fill="none" 
                  stroke="#ea580c" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,4" 
                  className="animate-spin" 
                  style={{ animationDuration: '8s' }} 
                />

                {/* Headlight directional beam */}
                <g transform={`rotate(${headingDeg})`}>
                  <polygon 
                    points="0,-8 -18,-48 18,-48" 
                    fill="#fef08a" 
                    fillOpacity="0.35" 
                  />
                  <line x1="0" y1="-8" x2="0" y2="-48" stroke="#facc15" strokeWidth="1.5" strokeOpacity="0.6" />
                </g>

                {/* Center Rider Bike Puck */}
                <circle r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
                <g transform={`rotate(${headingDeg})`}>
                  <path d="M 0 -8 L 4 4 L -4 4 Z" fill="#fbbf24" />
                </g>
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">🏍️</text>

                {/* Floating Speedometer & Rider Pill */}
                <g transform="translate(0, 26)">
                  <rect x="-42" y="0" width="84" height="18" rx="9" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                  <text x="0" y="13" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="900" fontFamily="monospace">
                    {speedKmh} km/h • {remainingDist.toFixed(1)}km
                  </text>
                </g>
              </g>

            </svg>
          </div>
        </div>
      )}

      {/* 2. OVERLAY HUD: TOP STATUS & GPS TELEMETRY */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
        
        {/* Left: Telemetry Live Status Pill */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 relative"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                {isLiveGps ? 'Device GPS Stream' : 'Live Fleet Telemetry'}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                ±{accuracy}m
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-200 font-bold">
              {formatCoordinates(riderCoords)}
            </div>
          </div>
        </div>

        {/* Right: ETA & Speedometer */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <div className="bg-orange-600 text-white rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2 border border-orange-400/40">
            <Clock className="w-3.5 h-3.5" />
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-orange-200 block leading-none">Arriving In</span>
              <span className="font-mono font-black text-xs leading-tight">~{remainingMins} mins</span>
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center shadow-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* 3. BOTTOM FLOATING CONTROLS: ZOOM, RECENTER & MAP THEME */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          
          {/* Rider Turn-by-Turn Navigation Instruction */}
          <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2 max-w-[280px] sm:max-w-xs">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 rotate-45" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold truncate leading-tight text-amber-300">
                {isRiderView ? 'Continue on Govardhan Link Road' : `${order.riderName || 'Rider'} is heading to destination`}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                {remainingDist.toFixed(1)} km remaining • Bearing {headingDeg}°
              </p>
            </div>
          </div>

          {/* Map Controls */}
          <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1 shadow-xl">
            {/* Theme switcher */}
            <button
              onClick={() => setMapTheme(t => t === 'street' ? 'dark' : t === 'dark' ? 'satellite' : 'street')}
              className="px-2 py-1 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Toggle Map Style"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="capitalize">{mapTheme}</span>
            </button>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            {/* Recenter */}
            <button
              onClick={handleRecenter}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Recenter Map on Rider"
            >
              <Crosshair className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={() => setZoomLevel(z => Math.max(0.8, z - 0.2))}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Zoom In */}
            <button
              onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.2))}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
