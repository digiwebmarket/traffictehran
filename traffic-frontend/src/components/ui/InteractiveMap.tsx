'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toPersianDigits } from '@/lib/utils';

export interface StationMarkerPoint {
  code: string | number;
  name: string;
  custom_name?: string | null;
  lat: number;
  lng: number;
  eta?: string;
}

export interface InteractiveMapProps {
  stations: StationMarkerPoint[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  className?: string;
  height?: string;
}

export function InteractiveMap({
  stations = [],
  centerLat = 35.6892,
  centerLng = 51.3890,
  zoom = 12,
  className = '',
  height = '480px',
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const loadScript = () => {
      if ((window as any).L) {
        setIsReady(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setIsReady(true);
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isReady || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Dark / Modern Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      markersGroupRef.current = markersGroup;
    }

    const markersGroup = markersGroupRef.current;
    if (markersGroup) {
      markersGroup.clearLayers();

      stations.forEach((st) => {
        if (!st.lat || !st.lng) return;

        const customBadge = st.custom_name ? `<br/><span style="color:#0ea5e9;font-weight:bold;">${st.custom_name}</span>` : '';
        const popupContent = `
          <div style="direction:rtl;text-align:right;font-family:sans-serif;font-size:12px;min-width:140px;">
            <b style="color:#0f172a;">ایستگاه: ${st.name}</b>${customBadge}
            <div style="margin-top:4px;color:#64748b;">کد ایستگاه: <b>${toPersianDigits(st.code)}</b></div>
            ${st.eta ? `<div style="margin-top:4px;color:#10b981;">زمان تخمینی ورود: <b>${st.eta}</b></div>` : ''}
          </div>
        `;

        const marker = L.circleMarker([st.lat, st.lng], {
          radius: 6,
          fillColor: '#38bdf8',
          color: '#0284c7',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).bindPopup(popupContent);

        markersGroup.addLayer(marker);
      });
    }
  }, [isReady, stations, centerLat, centerLng, zoom]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}
      style={{ height }}
    >
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {!isReady && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-xs text-slate-400">
          در حال بارگذاری نقشه تعاملی...
        </div>
      )}
    </div>
  );
}
