"use client"

import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import Script from "next/script"

// Create a custom icon using a div element instead of image files
const customIcon = L.divIcon({
  className: 'custom-map-marker',
  html: '<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
})

interface MapProps {
  latitude?: string | null;
  longitude?: string | null;
  address?: string;
  showDirections?: boolean;
}

// Component to handle routing
function RoutingControl({ destination, showDirections }: { destination: [number, number], showDirections: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!showDirections) return;

    // Check if the Routing control is already loaded
    if (!L.Routing) {
      console.error("Leaflet Routing Machine not loaded");
      return;
    }

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation: [number, number] = [latitude, longitude];

        // Create routing control
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(userLocation[0], userLocation[1]),
            L.latLng(destination[0], destination[1])
          ],
          routeWhileDragging: true,
          showAlternatives: true,
          fitSelectedRoutes: true,
          show: true,
          collapsible: true,
          lineOptions: {
            styles: [{ color: '#3b82f6', opacity: 0.8, weight: 5 }]
          }
        }).addTo(map);

        return () => {
          map.removeControl(routingControl);
        };
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert("Could not get your location. Please allow location access to use directions.");
      }
    );
  }, [map, destination, showDirections]);

  return null;
}

export default function Map({ latitude, longitude, address, showDirections = false }: MapProps) {
  // Default to Zambia coordinates if no coordinates are provided
  // Lusaka, Zambia coordinates: -15.3875, 28.3228
  const lat = latitude ? parseFloat(latitude) : -15.3875;
  const lng = longitude ? parseFloat(longitude) : 28.3228;

  const position: [number, number] = [lat, lng];
  const popupText = address || "Property Location";

  return (
    <>
      {/* Load Leaflet Routing Machine scripts and styles */}
      <Script 
        src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js" 
        strategy="lazyOnload"
      />
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" 
      />

      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>{popupText}</Popup>
        </Marker>
        {showDirections && <RoutingControl destination={position} showDirections={showDirections} />}
      </MapContainer>
    </>
  )
}
