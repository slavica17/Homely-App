import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { createProperty } from "@/data/properties";

const PropertyDialog = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  const [description, setDescription] = useState("");

  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");

  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");

  const [type, setType] = useState("STAN");

  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    if (validateInput()) {
      return;
    }

    try {
      setSaving(true);
      const result = await createProperty({
        title,
        description,
        location,
        price: Number(price),
        type,
      });

      if (result.ok) {
        onCreated();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>New property</DialogTitle>
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