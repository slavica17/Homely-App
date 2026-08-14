import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useState } from "react";
import { register } from "@/data/auth";

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  column-gap: 60px;
  padding: 40px;
`;

const LeftSide = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  padding-top: 20px;
`;

const Feature = styled.div`
  display: flex;
  column-gap: 14px;
  align-items: flex-start;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 36px;
  width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
  display: flex;
  column-gap: 14px;
  width: 100%;
`;

const FileBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: 1px solid #cccccc;
  border-radius: 6px;
  padding: 6px 10px;
`;

const RegisterSection = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [role, setRole] = useState("STANAR");

  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setFileName(file.name);
    setImageFile(file);
  };

  const validateInput = () => {
    let hasErrors = false;

    if (!username) {
      setUsernameError("Username is required");
      hasErrors = true;
    }
    if (!email) {
      setEmailError("Email is required");
      hasErrors = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasErrors = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasErrors = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasErrors = true;
    }
    if (!firstName) {
      setFirstNameError("First name is required");
      hasErrors = true;
    }
    if (!lastName) {
      setLastNameError("Last name is required");
      hasErrors = true;
    }
    if (!agree) {
      setAgreeError("You must accept the terms");
      hasErrors = true;
    }

    return hasErrors;
  };

  const handleRegister = async () => {
    setMessage("");

    if (validateInput()) {
      return;
    }

    try {
      setLoading(true);

      const result = await register(
        { username, password, firstName, lastName, email, role },
        imageFile
      );

      if (result.ok) {
        setMessage(result.message);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setRole("STANAR");
        setImageFile(null);
        setFileName("");
        setAgree(false);
      } else {
        setMessage("Error: " + result.message);
      }
    } catch {
      setMessage("Connection error with the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Body>
      <LeftSide>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#222222" }}>
          Create your account
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#888888" }}>
          Join Homely and find your perfect place or the right roommate.
        </Typography>

        <Feature>
          <IconBox>
            <HomeOutlinedIcon sx={{ color: "#555555", fontSize: 22 }} />
          </IconBox>
          <div>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Find your place</Typography>
            <Typography sx={{ fontSize: 13, color: "#999999" }}>
              Browse thousands of verified properties.
            </Typography>
          </div>
        </Feature>

        <Feature>
          <IconBox>
            <PeopleAltOutlinedIcon sx={{ color: "#555555", fontSize: 22 }} />
          </IconBox>
          <div>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Find a roommate</Typography>
            <Typography sx={{ fontSize: 13, color: "#999999" }}>
              Connect with people looking for a shared home.
            </Typography>
          </div>
        </Feature>

        <Feature>
          <IconBox>
            <ShieldOutlinedIcon sx={{ color: "#555555", fontSize: 22 }} />
          </IconBox>
          <div>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Safe & secure</Typography>
            <Typography sx={{ fontSize: 13, color: "#999999" }}>
              Your data is protected and your experience is our priority.
            </Typography>
          </div>
        </Feature>
      </LeftSide>

      <Card>
        <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#222222" }}>
          Sign up
        </Typography>
        <Typography sx={{ fontSize: 13, color: "#999999", mt: "-8px" }}>
          Registration is quick and easy
        </Typography>

        <Row>
          <TextField
            placeholder="Username"
            value={username}
            error={Boolean(usernameError)}
            helperText={usernameError}
            fullWidth
            size="small"
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError("");
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: "#aaaaaa" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            placeholder="Email"
            value={email}
            error={Boolean(emailError)}
            helperText={emailError}
            fullWidth
            size="small"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "#aaaaaa" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Row>

        <Row>
          <TextField
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            error={Boolean(passwordError)}
            helperText={passwordError}
            fullWidth
            size="small"
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#aaaaaa" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            placeholder="Confirm password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            error={Boolean(confirmPasswordError)}
            helperText={confirmPasswordError}
            fullWidth
            size="small"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError("");
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#aaaaaa" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon sx={{ color: "#aaaaaa", fontSize: 20 }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ color: "#aaaaaa", fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Row>

        <Typography sx={{ fontSize: 12, color: "#999999", alignSelf: "flex-start" }}>
          At least 8 characters with uppercase, lowercase, number and special character.
        </Typography>

        <Row>
          <TextField
            placeholder="First name"
            value={firstName}
            error={Boolean(firstNameError)}
            helperText={firstNameError}
            fullWidth
            size="small"
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameError("");
            }}
          />
          <TextField
            placeholder="Last name"
            value={lastName}
            error={Boolean(lastNameError)}
            helperText={lastNameError}
            fullWidth
            size="small"
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameError("");
            }}
          />
        </Row>

        <TextField
          select
          label="I am a"
          value={role}
          fullWidth
          size="small"
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="STANAR">Tenant</MenuItem>
          <MenuItem value="VLASNIK">Owner</MenuItem>
        </TextField>

        <FileBox>
          <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
            <ImageOutlinedIcon sx={{ color: "#aaaaaa" }} />
            <Typography sx={{ fontSize: 13, color: "#888888" }}>
              {fileName || "Profile picture (optional)"}
            </Typography>
          </div>
          <Button
            component="label"
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", color: "#555555", borderColor: "#cccccc" }}
          >
            Choose file
            <input type="file" hidden accept="image/*" onChange={handleFile} />
          </Button>
        </FileBox>

        <div style={{ display: "flex", alignItems: "center", alignSelf: "flex-start" }}>
          <Checkbox
            size="small"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setAgreeError("");
            }}
            sx={{ color: agreeError ? "#d32f2f" : "#999999", "&.Mui-checked": { color: "#2b2b2b" } }}
          />
          <Typography sx={{ fontSize: 13, color: "#666666" }}>
            I agree to the Terms of Service and Privacy Policy
          </Typography>
        </div>

        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={() => handleRegister()}
          sx={{
            backgroundColor: "#2b2b2b",
            textTransform: "none",
            padding: "10px",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#000000" },
          }}
        >
          {loading && <CircularProgress size={20} sx={{ mr: 1, color: "#ffffff" }} />}
          Create account
        </Button>

        {message && (
          <Typography sx={{ fontSize: 13, color: "#888888", textAlign: "center" }}>
            {message}
          </Typography>
        )}
      </Card>
    </Body>
  );
};

export default RegisterSection;