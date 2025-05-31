import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Create a custom icon using a div element
const customIcon = L.divIcon({
  className: 'custom-map-marker',
  html: '<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Create a highlighted icon for selected property
const highlightedIcon = L.divIcon({
  className: 'custom-map-marker-highlighted',
  html: '<div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;"></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  listingType: {
    name: string;
  };
  propertyType: {
    name: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  latitude?: string | null;
  longitude?: string | null;
  media: {
    filePath: string;
    type: string;
  }[];
}

interface MapComponentProps {
  properties: Property[];
  selectedProperty: number | null;
  mapCenter: [number, number];
  mapZoom: number;
  onPropertySelect: (propertyId: number) => void;
}

export default function MapComponent({
  properties,
  selectedProperty,
  mapCenter,
  mapZoom,
  onPropertySelect
}: MapComponentProps) {
  const router = useRouter();

  // Fix Leaflet icon issue
  useEffect(() => {
    // This code runs only on the client side
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        key={`map-${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => {
          const position: [number, number] = [
            parseFloat(property.latitude || "0"),
            parseFloat(property.longitude || "0")
          ];

          // Get the first image from media array or use a default
          const propertyMedia = property.media || [];
          const imageUrl = propertyMedia.length > 0 && propertyMedia[0]?.filePath
            ? propertyMedia[0].filePath
            : "https://digiestateorg.wordpress.com/wp-content/uploads/2023/11/ask-us-1024x583-1.jpg";

          // Format price with currency
          const formattedPrice = `ZMW ${property.price.toLocaleString()}`;

          // Determine if it's monthly or total price
          const period = property.listingType?.name === "For Rent" ? "month" : "total";

          // Determine badges based on listing type
          const badges = [];
          if (property.listingType?.name === "For Sale") {
            badges.push("Sale");
          } else if (property.listingType?.name === "For Rent") {
            badges.push("Rent");
          }

          return (
            <Marker
              key={property.id}
              position={position}
              icon={selectedProperty === property.id ? highlightedIcon : customIcon}
              eventHandlers={{
                click: () => onPropertySelect(property.id)
              }}
            >
              <Popup className="property-popup" maxWidth={300}>
                <div className="p-2">
                  <h3 className="font-semibold mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                  <p className="text-blue-600 font-bold mb-2">{formattedPrice}</p>
                  <div className="flex gap-2 text-xs mb-2">
                    {property.bedrooms && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {property.bedrooms} beds
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {property.bathrooms} baths
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/listing-single/${property.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
