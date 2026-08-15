import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createReservation } from "@/data/reservations";

const ReservationDialog = ({ propertyId, propertyTitle, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setMessage("");
    if (!startDate || !endDate) {
      setMessage("Please select both dates.");
      return;
    }

    try {
      setSaving(true);
      const result = await createReservation({
        propertyId,
        startDate,
        endDate,
      });
      if (result.ok) {
        setMessage("Reservation request sent! Waiting for owner approval.");
      } else {
        setMessage(result.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Reserve — {propertyTitle}</DialogTitle>
      <DialogContent sx={{ width: 360, display: "flex", flexDirection: "column", rowGap: 2, mt: 1 }}>
        <TextField
          label="Start date"
          type="date"
          value={startDate}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End date"
          type="date"
          value={endDate}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {message && (
          <Typography sx={{ fontSize: 13, color: "#666666" }}>{message}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#666666" }}>
          Close
        </Button>
        <Button
          variant="contained"
          disabled={saving}
          onClick={handleSave}
          sx={{ textTransform: "none", backgroundColor: "#2b2b2b", "&:hover": { backgroundColor: "#000000" } }}
        >
          Send request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;