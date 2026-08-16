import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createProperty, updateProperty, uploadPropertyImages } from "@/data/properties";
import LocationPicker from "@/components/location-picker";

const PropertyDialog = ({ onClose, onCreated, existing }) => {
  const isEdit = Boolean(existing);

  const [title, setTitle] = useState(existing ? existing.title : "");
  const [titleError, setTitleError] = useState("");

  const [description, setDescription] = useState(existing ? existing.description || "" : "");

  const [location, setLocation] = useState(existing ? existing.location : "");
  const [locationError, setLocationError] = useState("");

  const [price, setPrice] = useState(existing ? existing.price : "");
  const [priceError, setPriceError] = useState("");

  const [type, setType] = useState(existing ? existing.type : "STAN");

  const [latitude, setLatitude] = useState(existing ? existing.latitude : null);
  const [longitude, setLongitude] = useState(existing ? existing.longitude : null);

  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);

  const validateInput = () => {
    let hasErrors = false;

    if (!title) {
      setTitleError("Title is required");
      hasErrors = true;
    }
    if (!location) {
      setLocationError("Location is required");
      hasErrors = true;
    }
    if (!price || Number(price) <= 0) {
      setPriceError("Enter a valid price");
      hasErrors = true;
    }

    return hasErrors;
  };

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSave = async () => {
    if (validateInput()) {
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title,
        description,
        location,
        price: Number(price),
        type,
        latitude,
        longitude,
      };

      let result;
      if (isEdit) {
        result = await updateProperty(existing.id, payload);
      } else {
        result = await createProperty(payload);
      }

      if (result.ok) {
        const propertyId = isEdit ? existing.id : result.data && result.data.id;
        if (propertyId && images.length > 0) {
          await uploadPropertyImages(propertyId, images);
        }
        onCreated();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{isEdit ? "Edit property" : "New property"}</DialogTitle>
      <DialogContent sx={{ width: 400, display: "flex", flexDirection: "column", rowGap: 2, mt: 1 }}>
        <TextField
          label="Title"
          value={title}
          error={Boolean(titleError)}
          helperText={titleError}
          size="small"
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError("");
          }}
        />
        <TextField
          label="Description"
          value={description}
          multiline
          rows={3}
          size="small"
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Location"
          value={location}
          error={Boolean(locationError)}
          helperText={locationError}
          size="small"
          onChange={(e) => {
            setLocation(e.target.value);
            setLocationError("");
          }}
        />

        <Typography sx={{ fontSize: 13, color: "#888888" }}>
          Click on the map to set the location
        </Typography>
        <LocationPicker
          latitude={latitude}
          longitude={longitude}
          onPick={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />

        <TextField
          label="Price (€)"
          type="number"
          value={price}
          error={Boolean(priceError)}
          helperText={priceError}
          size="small"
          onChange={(e) => {
            setPrice(e.target.value);
            setPriceError("");
          }}
        />
        <TextField
          select
          label="Type"
          value={type}
          size="small"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="STAN">Apartment</MenuItem>
          <MenuItem value="KUCA">House</MenuItem>
          <MenuItem value="SOBA">Room</MenuItem>
        </TextField>

        <Button
          component="label"
          variant="outlined"
          sx={{ textTransform: "none", color: "#555555", borderColor: "#cccccc" }}
        >
          {images.length > 0
            ? `${images.length} image(s) selected`
            : isEdit
            ? "Add more images"
            : "Choose images"}
          <input type="file" hidden multiple accept="image/*" onChange={handleFiles} />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#666666" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving}
          onClick={handleSave}
          sx={{ textTransform: "none", backgroundColor: "#2b2b2b", "&:hover": { backgroundColor: "#000000" } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDialog;