import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 400);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

const LocationPicker = ({ latitude, longitude, onPick }) => {
  const center = [latitude || 44.7866, longitude || 20.4489];

  return (
    <Box
      sx={{
        height: 300,
        minHeight: 300,
        width: "100%",
        "& .leaflet-container": {
          height: "300px !important",
          width: "100%",
          borderRadius: "8px",
        },
      }}
    >
      <MapContainer center={center} zoom={12} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ClickHandler onPick={onPick} />
        <ResizeFix />
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={markerIcon} />
        )}
      </MapContainer>
    </Box>
  );
};

export default LocationPicker;