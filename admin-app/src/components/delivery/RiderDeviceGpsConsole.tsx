import React, { useState, useEffect, useRef } from 'react';
import { Order, RiderLiveTelemetry, Coordinates } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  DEFAULT_DELIVERY_ROUTE, 
  getRoutePositionAtProgress, 
  calculateDistanceKm, 
  formatCoordinates 
} from '../../utils/geoUtils';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  Navigation, 
  Zap, 
  Compass, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  Sliders,
  Battery
} from 'lucide-react';

interface RiderDeviceGpsConsoleProps {
  order: Order;
  telemetry: RiderLiveTelemetry | null;
}

export const RiderDeviceGpsConsole: React.FC<RiderDeviceGpsConsoleProps> = ({
  order,
  telemetry,
}) => {
  const { updateRiderTelemetry } = useApp();

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 4>(2);
  const [progress, setProgress] = useState<number>(() => {
    return (telemetry?.routeProgressPercent ?? 50) / 100;
  });

  // Real device GPS watching state
  const [isWatchingRealGps, setIsWatchingRealGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Sync internal progress if external telemetry changes significantly
  useEffect(() => {
    if (telemetry?.routeProgressPercent !== undefined && !isSimulating && !isWatchingRealGps) {
      setProgress(telemetry.routeProgressPercent / 100);
    }
  }, [telemetry?.routeProgressPercent, isSimulating, isWatchingRealGps]);

  // Handle Real Device GPS Watch (`navigator.geolocation.watchPosition`)
  const toggleRealDeviceGps = () => {
    if (isWatchingRealGps) {
      // Stop watching
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsWatchingRealGps(false);
      setGpsError(null);
      updateRiderTelemetry(order.id, { isLiveGps: false });
    } else {
      // Stop simulation if running
      setIsSimulating(false);

      if (!('geolocation' in navigator)) {
        setGpsError('Geolocation is not supported by your browser environment.');
        return;
      }

      setGpsError(null);
      try {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const rawLat = position.coords.latitude;
            const rawLng = position.coords.longitude;
            const rawSpeed = position.coords.speed ? Math.round(position.coords.speed * 3.6) : 28;
            const rawHeading = position.coords.heading !== null && !isNaN(position.coords.heading) 
              ? Math.round(position.coords.heading) 
              : 45;
            const rawAccuracy = Math.round(position.coords.accuracy || 5);

            const newCoords: Coordinates = {
              lat: Number(rawLat.toFixed(6)),
              lng: Number(rawLng.toFixed(6)),
            };

            const destCoords = order.deliveryCoordinates || { lat: 27.5180, lng: 77.4785 };
            const distRemaining = calculateDistanceKm(newCoords, destCoords);
            const minsRemaining = Math.max(1, Math.round(distRemaining * 2.8));

            updateRiderTelemetry(order.id, {
              location: newCoords,
              speedKmh: rawSpeed,
              heading: rawHeading,
              accuracyMeters: rawAccuracy,
              remainingDistanceKm: distRemaining,
              remainingMinutes: minsRemaining,
              isLiveGps: true,
              status: 'on_the_way',
            });
            setIsWatchingRealGps(true);
          },
          (err) => {
            console.warn('Geolocation watch error:', err.message);
            setGpsError(`Device GPS note: ${err.message}. Using high-precision telemetry stream.`);
            setIsWatchingRealGps(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000,
          }
        );
        watchIdRef.current = id;
        setIsWatchingRealGps(true);
      } catch (err: any) {
        setGpsError(`Error starting GPS: ${err.message}`);
        setIsWatchingRealGps(false);
      }
    }
  };

  // Clean up geolocation on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Route Drive Simulator Timer Loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = 250;
    const progressIncrement = 0.005 * simSpeed;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressIncrement;
        if (next >= 1.0) {
          setIsSimulating(false);
          // Arrived at destination
          const finalPos = DEFAULT_DELIVERY_ROUTE[DEFAULT_DELIVERY_ROUTE.length - 1];
          updateRiderTelemetry(order.id, {
            location: finalPos,
            speedKmh: 0,
            heading: 90,
            remainingDistanceKm: 0,
            remainingMinutes: 0,
            routeProgressPercent: 100,
            status: 'arrived',
            isLiveGps: false,
          });
          return 1.0;
        }

        const { location, heading } = getRoutePositionAtProgress(DEFAULT_DELIVERY_ROUTE, next);
        const destCoords = order.deliveryCoordinates || { lat: 27.5180, lng: 77.4785 };
        const distRemaining = calculateDistanceKm(location, destCoords);
        const minsRemaining = Math.max(1, Math.round(distRemaining * 2.8));
        const dynamicSpeed = Math.round(28 + Math.sin(next * 20) * 8);

        updateRiderTelemetry(order.id, {
          location,
          heading,
          speedKmh: dynamicSpeed,
          remainingDistanceKm: distRemaining,
          remainingMinutes: minsRemaining,
          routeProgressPercent: Math.round(next * 100),
          status: 'on_the_way',
          isLiveGps: false,
        });

        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, order.id, order.deliveryCoordinates, updateRiderTelemetry]);

  // Scrub progress manually
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProg = parseFloat(e.target.value);
    setProgress(newProg);
    const { location, heading } = getRoutePositionAtProgress(DEFAULT_DELIVERY_ROUTE, newProg);
    const destCoords = order.deliveryCoordinates || { lat: 27.5180, lng: 77.4785 };
    const distRemaining = calculateDistanceKm(location, destCoords);
    const minsRemaining = Math.max(1, Math.round(distRemaining * 2.8));

    updateRiderTelemetry(order.id, {
      location,
      heading,
      speedKmh: 30,
      remainingDistanceKm: distRemaining,
      remainingMinutes: minsRemaining,
      routeProgressPercent: Math.round(newProg * 100),
      status: newProg >= 0.98 ? 'arrived' : 'on_the_way',
      isLiveGps: false,
    });
  };

  const handleResetToStart = () => {
    setIsSimulating(false);
    setProgress(0);
    const startPos = DEFAULT_DELIVERY_ROUTE[0];
    const destCoords = order.deliveryCoordinates || { lat: 27.5180, lng: 77.4785 };
    const distRemaining = calculateDistanceKm(startPos, destCoords);

    updateRiderTelemetry(order.id, {
      location: startPos,
      heading: 42,
      speedKmh: 0,
      remainingDistanceKm: distRemaining,
      remainingMinutes: Math.round(distRemaining * 2.8),
      routeProgressPercent: 0,
      status: 'picked_up',
      isLiveGps: false,
    });
  };

  const currentCoords = telemetry?.location || DEFAULT_DELIVERY_ROUTE[4];
  const speed = telemetry?.speedKmh ?? 28;
  const dist = telemetry?.remainingDistanceKm ?? 1.4;
  const eta = telemetry?.remainingMinutes ?? 6;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
      {/* Header with transmission indicator */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
              <span>Rider Device GPS Transmitter</span>
              {isWatchingRealGps ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REAL GPS BROADCASTING
                </span>
              ) : isSimulating ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ROUTE DRIVE ACTIVE ({simSpeed}x)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  TELEMETRY READY
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              Broadcasting high-accuracy coordinates to customer & restaurant in real-time.
            </p>
          </div>
        </div>

        {/* Live Device Battery & Latency */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200">88%</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-200">12ms Latency</span>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Readout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Metric 1: Live Latitude & Longitude */}
        <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Navigation className="w-3 h-3 text-orange-400" />
            <span>Coordinates</span>
          </div>
          <div className="font-mono text-xs font-black text-amber-300 mt-1 truncate">
            {formatCoordinates(currentCoords)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Acc: ±{telemetry?.accuracyMeters ?? 4}m
          </div>
        </div>

        {/* Metric 2: Speedometer */}
        <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Gauge className="w-3 h-3 text-blue-400" />
            <span>Road Speed</span>
          </div>
          <div className="font-mono text-base font-black text-blue-300 mt-0.5">
            {speed} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Bearing: {telemetry?.heading ?? 42}° NE
          </div>
        </div>

        {/* Metric 3: Distance Remaining */}
        <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-400" />
            <span>To Customer</span>
          </div>
          <div className="font-mono text-base font-black text-emerald-300 mt-0.5">
            {dist.toFixed(1)} <span className="text-xs font-normal text-slate-400">km</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Progress: {Math.round(progress * 100)}%
          </div>
        </div>

        {/* Metric 4: ETA */}
        <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Estimated Arrival</span>
          </div>
          <div className="font-mono text-base font-black text-amber-300 mt-0.5">
            {eta} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Status: {telemetry?.status?.replace(/_/g, ' ') || 'on the way'}
          </div>
        </div>

      </div>

      {/* Interactive Controls Bar: Real Device GPS vs Simulated Drive */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        
        {/* Route scrubbing slider */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 font-bold text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-orange-400" />
              <span>Route Position Scrubbing</span>
            </span>
            <span className="font-mono text-amber-300 font-bold">
              {Math.round(progress * 100)}% ({dist.toFixed(1)} km left)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={handleSliderChange}
            disabled={isWatchingRealGps}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>👨‍🍳 Royal Rasoi (Kitchen)</span>
            <span>Dan Ghati Chowk</span>
            <span>🏠 Customer Doorstep</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
          
          {/* Simulator controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isWatchingRealGps) {
                  setIsWatchingRealGps(false);
                  if (watchIdRef.current !== null && navigator.geolocation) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                    watchIdRef.current = null;
                  }
                }
                setIsSimulating(!isSimulating);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all ${
                isSimulating 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-orange-600 hover:bg-orange-500 text-white'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Route Drive</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Live Route Drive</span>
                </>
              )}
            </button>

            {/* Reset */}
            <button
              onClick={handleResetToStart}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Reset Route to Kitchen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed multipliers */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700 text-xs">
              {([1, 2, 4] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                    simSpeed === spd 
                      ? 'bg-orange-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Real Device Hardware GPS Toggle */}
          <button
            onClick={toggleRealDeviceGps}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all ${
              isWatchingRealGps
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isWatchingRealGps ? 'Device GPS Active' : 'Stream Device Hardware GPS'}</span>
          </button>

        </div>

      </div>

      {gpsError && (
        <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{gpsError}</span>
        </div>
      )}
    </div>
  );
};
