import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { Box } from "@mui/material";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

const PropertiesMap = ({ properties, onOpen }) => {
  const withCoords = properties.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  const center =
    withCoords.length > 0
      ? [withCoords[0].latitude, withCoords[0].longitude]
      : [44.7866, 20.4489];

  return (
    <Box
      sx={{
        height: 200,
        width: "100%",
        mb: 4,
        "& .leaflet-container": {
          height: "200px !important",
          width: "100%",
          borderRadius: "12px",
        },
      }}
    >
      <MapContainer center={center} zoom={12}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ResizeFix />
        {withCoords.map((p) => (
          <Marker key={p.id} position={[p.latitude, p.longitude]} icon={markerIcon}>
            <Popup>
              <div style={{ minWidth: 140 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
                <div style={{ color: "#555", marginBottom: 2 }}>{p.location}</div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>€{p.price}</div>
                <button
                  onClick={() => onOpen(p.id)}
                  style={{
                    border: "none",
                    background: "#2b2b2b",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default PropertiesMap;