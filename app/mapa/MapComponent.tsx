"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";

// Custom icons will be used, but we need to set a default to avoid errors
if (typeof window !== "undefined") {
  // Only set default icon on client side
  try {
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  } catch (e) {
    // Ignore if icons can't be loaded
  }
}

// Custom icons for different statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const orangeIcon = createCustomIcon("#ff8c00");
const greenIcon = createCustomIcon("#28a745");
const blueIcon = createCustomIcon("#007bff"); // For initiatives

type FilterType = "wszystkie" | "planowane" | "w trakcie" | "gotowe" | "inicjatywy";

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
  description?: string;
  fullDescription?: string; // dłuższy opis dla popup w sekcji usług
  date?: string;
  image?: string;
  votes?: number;
  progress?: number; // postęp projektu 0-100 (tylko dla zmian)
  daysRemaining?: number; // planowana ilość dni do zakończenia (tylko dla zmian)
}

type TabType = "wszystkie" | "zmiany" | "inicjatywy" | "zglos-problem";

interface MapComponentProps {
  activeFilter: FilterType;
  activeTab?: TabType;
  locations: Location[];
  selectedLocationId?: number | null;
  onMapClick?: (e: L.LeafletMouseEvent) => void;
  reportLocation?: { lat: number; lng: number } | null;
  showStatus?: boolean; // czy pokazywać status w popup (domyślnie true)
}

// Component to handle map centering when location is selected
function MapCenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

// Component to auto-open popup when marker is selected
function MarkerWithAutoPopup({
  position,
  icon,
  isSelected,
  children,
}: {
  position: [number, number];
  icon: L.DivIcon;
  isSelected: boolean;
  children: React.ReactNode;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      // Small delay to ensure marker is rendered
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 100);
    } else if (!isSelected && markerRef.current) {
      // Close popup when deselected
      markerRef.current.closePopup();
    }
  }, [isSelected]);

  return (
    <Marker
      eventHandlers={{
        add: (e) => {
          markerRef.current = e.target;
          if (isSelected) {
            setTimeout(() => {
              e.target.openPopup();
            }, 100);
          }
        },
      }}
      position={position}
      icon={icon}
    >
      {children}
    </Marker>
  );
}

export default function MapComponent({
  activeFilter,
  activeTab,
  locations,
  selectedLocationId,
  onMapClick,
  reportLocation,
  showStatus = true, // domyślnie pokazuj status
}: MapComponentProps) {
  const filteredLocations = locations.filter((loc) => {
    // Jeśli activeTab nie jest podane (np. w sekcji usług), pokazuj wszystkie punkty
    if (!activeTab) {
      return true;
    }
    // Jeśli aktywna zakładka to "wszystkie", pokazuj wszystkie punkty
    if (activeTab === "wszystkie") {
      return true;
    }
    // Jeśli aktywna zakładka to "inicjatywy", pokazuj tylko inicjatywy
    if (activeTab === "inicjatywy") {
      return loc.status === "inicjatywy";
    }
    // Jeśli aktywna zakładka to "zmiany", pokazuj tylko zmiany (nie inicjatywy)
    if (activeTab === "zmiany") {
      if (loc.status === "inicjatywy") {
        return false;
      }
      if (activeFilter === "wszystkie") {
        return true;
      }
      return loc.status === activeFilter;
    }
    // Dla innych zakładek (np. zglos-problem) nie pokazuj żadnych punktów
    return false;
  });

  const selectedLocation = selectedLocationId
    ? locations.find((loc) => loc.id === selectedLocationId)
    : null;

  const getIcon = (status: string) => {
    if (status === "gotowe") return greenIcon;
    if (status === "w trakcie") return orangeIcon;
    if (status === "planowane") return createCustomIcon("#007bff");
    if (status === "inicjatywy") return blueIcon;
    if (status === "wszystkie") return createCustomIcon("#0075a7"); // Primary color for services
    return createCustomIcon("#007bff");
  };

  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [51.758, 19.456];

  const reportIcon = createCustomIcon("#dc2626"); // Red icon for report

  return (
    <MapContainer
      center={center}
      zoom={selectedLocation ? 15 : 13}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      scrollWheelZoom={true}
    >
      <MapCenter center={center} zoom={selectedLocation ? 15 : 13} />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Location markers */}
      {filteredLocations.map((location) => {
        const icon = getIcon(location.status);
        const isInitiative = location.status === "inicjatywy";
        const isSelected = selectedLocationId === location.id;

        return (
          <MarkerWithAutoPopup
            key={location.id}
            position={[location.lat, location.lng]}
            icon={icon}
            isSelected={isSelected}
          >
            <Popup>
              <div className="min-w-[250px] max-w-[350px]">
                <h4 className="font-bold text-sm mb-2">{location.name}</h4>
                {location.image && (
                  <div className="mb-2">
                    <Image
                      src={location.image}
                      alt={location.name}
                      width={200}
                      height={120}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                )}
                {/* Pokazuj fullDescription jeśli dostępne, w przeciwnym razie description */}
                {location.fullDescription ? (
                  <p className="text-xs text-gray-700 mb-2 leading-relaxed">{location.fullDescription}</p>
                ) : location.description ? (
                  <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                ) : null}
                {/* Status pokazujemy tylko jeśli showStatus jest true i to nie jest inicjatywa */}
                {showStatus && !isInitiative && (
                  <>
                    <p className="text-xs mb-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          location.status === "gotowe"
                            ? "bg-green-100 text-green-800"
                            : location.status === "w trakcie"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {location.status}
                      </span>
                    </p>
                    {/* Progress bar for changes - only for "w trakcie" */}
                    {location.progress !== undefined && location.status === "w trakcie" && (
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-700">Postęp:</span>
                          <span className="text-xs font-bold text-primary">{location.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-orange-500"
                            style={{ width: `${location.progress}%` }}
                          />
                        </div>
                        {location.daysRemaining !== undefined && location.daysRemaining > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            Planowane zakończenie za: <span className="font-semibold text-primary">{location.daysRemaining} dni</span>
                          </p>
                        )}
                      </div>
                    )}
                    {location.date && (
                      <p className="text-xs mt-1">
                        <span className="font-semibold">Data:</span> {location.date}
                      </p>
                    )}
                  </>
                )}
                {isInitiative && location.votes !== undefined && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold">👍 {location.votes} głosów</span>
                      {location.date && (
                        <span className="text-gray-500">{location.date}</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        // In a real app, this would trigger a vote
                        alert("Głosowanie - funkcja w trakcie implementacji");
                      }}
                      className="mt-2 w-full px-3 py-1 bg-secondary text-white text-xs font-bold uppercase hover:bg-opacity-90 transition-colors"
                    >
                      Zagłosuj
                    </button>
                  </>
                )}
              </div>
            </Popup>
          </MarkerWithAutoPopup>
        );
      })}

      {/* Report Location Marker */}
      {reportLocation && (
        <Marker position={[reportLocation.lat, reportLocation.lng]} icon={reportIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <h4 className="font-bold text-sm mb-2">Zaznaczony punkt</h4>
              <p className="text-xs text-gray-600">
                Lokalizacja zgłoszenia problemu
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

