import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { VerifiedHospital } from '../types';

interface HospitalMapProps {
  hospitals: VerifiedHospital[];
  userLocation: { lat: number; lng: number } | null;
  selectedHospital: VerifiedHospital | null;
  onSelectHospital: (hospital: VerifiedHospital) => void;
  centerCoordinates?: { lat: number; lng: number };
  zoomLevel?: number;
}

export const HospitalMap: React.FC<HospitalMapProps> = ({
  hospitals,
  userLocation,
  selectedHospital,
  onSelectHospital,
  centerCoordinates,
  zoomLevel = 13
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : centerCoordinates
        ? [centerCoordinates.lat, centerCoordinates.lng]
        : [22.6958, 88.3742]; // Panihati center fallback

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: zoomLevel,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add simple attribution
      L.control.attribution({ prefix: false, position: 'bottomright' })
        .addAttribution('© OpenStreetMap')
        .addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and view when hospitals, userLocation, or selectedHospital changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const bounds = L.latLngBounds([]);

    // 1. Add User Location Marker if available
    if (userLocation) {
      const userLatLng = L.latLng(userLocation.lat, userLocation.lng);
      bounds.extend(userLatLng);

      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(14, 165, 233, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); z-index: 10;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 });
      userMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
          <strong style="color: #0369a1; display: block; font-size: 13px;">📍 আপনার অবস্থান (Your GPS Location)</strong>
          <span style="color: #64748b; font-size: 11px;">Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}</span>
        </div>
      `);
      markersLayer.addLayer(userMarker);
    }

    // 2. Add Hospital Markers
    hospitals.forEach(hosp => {
      const hospLatLng = L.latLng(hosp.latitude, hosp.longitude);
      bounds.extend(hospLatLng);

      const isSelected = selectedHospital?.id === hosp.id;
      const isEmergencyReady = hosp.emergencyAvailable && hosp.isBedVerified && (hosp.availableBeds ?? 0) > 0;
      const pinColor = isSelected ? '#e11d48' : isEmergencyReady ? '#0d9488' : '#0284c7';
      const bedCount = hosp.isBedVerified ? (hosp.availableBeds ?? 0) : '?';

      const hospIcon = L.divIcon({
        className: 'custom-hosp-pin',
        html: `
          <div style="position: relative; cursor: pointer; transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'}; transition: transform 0.2s ease;">
            <div style="background: ${pinColor}; color: #ffffff; padding: 4px 8px; border-radius: 8px; font-weight: 800; font-size: 11px; display: flex; items-center: center; gap: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid #ffffff; white-space: nowrap;">
              <span>🏥</span>
              <span>${hosp.name.split(' ')[0]}</span>
              <span style="background: rgba(255,255,255,0.25); padding: 1px 4px; border-radius: 4px; font-size: 10px;">${bedCount}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${pinColor}; margin: 0 auto;"></div>
          </div>
        `,
        iconSize: [80, 36],
        iconAnchor: [40, 36]
      });

      const marker = L.marker(hospLatLng, { icon: hospIcon, zIndexOffset: isSelected ? 500 : 100 });

      marker.on('click', () => {
        onSelectHospital(hosp);
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; min-width: 200px; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #0f172a; font-size: 13px;">${hosp.name}</h4>
          <p style="margin: 0 0 6px 0; color: #475569; font-size: 11px;">${hosp.address}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 6px; background: #f1f5f9; border-radius: 6px;">
            <span style="font-size: 11px; color: #334155;">দূরত্ব (Distance): <strong>${hosp.distanceKm} km</strong></span>
            <span style="font-size: 11px; font-weight: bold; color: ${hosp.isBedVerified ? '#0d9488' : '#64748b'};">
              ${hosp.isBedVerified ? `বেড: ${hosp.availableBeds} টি খালি` : 'বেড: অপ্রমাণিত'}
            </span>
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="tel:${hosp.phone.replace(/[^0-9+]/g, '')}" style="flex: 1; text-align: center; background: #0d9488; color: #ffffff; padding: 5px 8px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 11px;">
              📞 Call
            </a>
            <a href="${hosp.mapsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0284c7; color: #ffffff; padding: 5px 8px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 11px;">
              🗺️ Directions
            </a>
          </div>
        </div>
      `);

      markersLayer.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });

    // Center map view
    if (selectedHospital) {
      map.flyTo([selectedHospital.latitude, selectedHospital.longitude], 14, { duration: 0.8 });
    } else if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // Invalidate map size to handle flex layout smoothly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [hospitals, userLocation, selectedHospital]);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 shadow-sm flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
        <span>OpenStreetMap Live Radar</span>
      </div>
    </div>
  );
};
