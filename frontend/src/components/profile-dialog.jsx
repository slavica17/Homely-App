import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getMe,
  updateProfile,
  changePassword,
  updateProfileImage,
} from "@/data/auth";

const ProfileDialog = ({ onClose }) => {
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);

  const [profileMsg, setProfileMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [saving, setSaving] = useState(false);

  const loadMe = async () => {
    setLoading(true);
    const result = await getMe();
    if (result.ok) {
      const u = result.data;
      setFirstName(u.firstName);
      setLastName(u.lastName);
      setEmail(u.email);
      setUsername(u.username);
      setRole(u.role);
      setImage(u.profileImage);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMe();
  }, []);

  const handleSaveProfile = async () => {
    setProfileMsg("");
    setSaving(true);
    const result = await updateProfile({ firstName, lastName, email });
    setProfileMsg(result.ok ? "Profile updated." : result.message);
    setSaving(false);
  };

  const handleChangePassword = async () => {
    setPasswordMsg("");
    setSaving(true);
    const result = await changePassword({ currentPassword, newPassword });
    setPasswordMsg(result.message);
    if (result.ok) {
      setCurrentPassword("");
      setNewPassword("");
    }
    setSaving(false);
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const result = await updateProfileImage(file);
    if (result.ok) {
      await loadMe();
    }
    setSaving(false);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>My profile</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", rowGap: 2, mt: 1 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", columnGap: 16 }}>
              <Avatar
                src={image ? "http://localhost:8080" + image : undefined}
                sx={{ width: 72, height: 72 }}
              >
                {firstName ? firstName[0] : "?"}
              </Avatar>
              <div>
                <Typography sx={{ fontWeight: 700 }}>{username}</Typography>
                <Typography sx={{ fontSize: 13, color: "#888888" }}>{role}</Typography>
                <Button
                  component="label"
                  size="small"
                  sx={{ textTransform: "none", pl: 0, mt: 0.5 }}
                >
                  Change photo
                  <input type="file" hidden accept="image/*" onChange={handleImage} />
                </Button>
              </div>
            </div>

            <Divider />

            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>Edit details</Typography>
            <TextField
              label="First name"
              value={firstName}
              size="small"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last name"
              value={lastName}
              size="small"
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              value={email}
              size="small"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              disabled={saving}
              onClick={handleSaveProfile}
              sx={{ textTransform: "none", backgroundColor: "#2b2b2b", "&:hover": { backgroundColor: "#000000" }, alignSelf: "flex-start" }}
            >
              Save changes
            </Button>
            {profileMsg && (
              <Typography sx={{ fontSize: 13, color: "#666666" }}>{profileMsg}</Typography>
            )}

            <Divider />

            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>Change password</Typography>
            <TextField
              label="Current password"
              type="password"
              value={currentPassword}
              size="small"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              size="small"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              variant="outlined"
              disabled={saving}
              onClick={handleChangePassword}
              sx={{ textTransform: "none", color: "#555555", borderColor: "#bdbdbd", alignSelf: "flex-start" }}
            >
              Change password
            </Button>
            {passwordMsg && (
              <Typography sx={{ fontSize: 13, color: "#666666" }}>{passwordMsg}</Typography>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;