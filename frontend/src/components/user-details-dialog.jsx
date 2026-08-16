import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

const Row = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
    <Typography sx={{ fontSize: 13, color: "#888888" }}>{label}</Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{value}</Typography>
  </div>
);

const UserDetailsDialog = ({ user, onClose, onApprove, onBlock, onDelete }) => {
  const statusChip = () => {
    if (user.blocked) return <Chip label="Blocked" size="small" sx={{ backgroundColor: "#ffe0e0" }} />;
    if (user.approved) return <Chip label="Active" size="small" sx={{ backgroundColor: "#e0f0e0" }} />;
    return <Chip label="Pending" size="small" sx={{ backgroundColor: "#fff2d0" }} />;
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>User details</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", rowGap: 1, mt: 1 }}>
        <div style={{ display: "flex", alignItems: "center", columnGap: 16, marginBottom: 8 }}>
          <Avatar
            src={user.profileImage ? "http://localhost:8080" + user.profileImage : undefined}
            sx={{ width: 72, height: 72 }}
          >
            {user.firstName ? user.firstName[0] : "?"}
          </Avatar>
          <div>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#888888" }}>@{user.username}</Typography>
            <div style={{ marginTop: 4 }}>{statusChip()}</div>
          </div>
        </div>

        <Divider />

        <Row label="Email" value={user.email} />
        <Row label="Role" value={user.role} />
        <Row label="Username" value={user.username} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, flexWrap: "wrap", gap: 1 }}>
        {!user.approved && (
          <Button
            onClick={() => onApprove(user.id)}
            sx={{ textTransform: "none", color: "#2e7d32" }}
          >
            Approve
          </Button>
        )}
        <Button
          onClick={() => onBlock(user.id)}
          sx={{ textTransform: "none", color: "#ed6c02" }}
        >
          {user.blocked ? "Unblock" : "Block"}
        </Button>
        <Button
          onClick={() => onDelete(user.id)}
          sx={{ textTransform: "none", color: "#d32f2f" }}
        >
          Delete
        </Button>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#666666" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;