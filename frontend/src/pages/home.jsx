import styled from "@emotion/styled";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  GlobalStyles,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "@/data/auth";
import RegisterSection from "@/components/register-section";

const Page = styled.div`
  min-height: 100vh;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  color: #333333;
  font-weight: 700;
  font-size: 18px;
`;

const NavLinks = styled.div`
  display: flex;
  column-gap: 32px;
  color: #555555;
  font-size: 14px;

  span {
    cursor: pointer;
  }
  span:hover {
    color: #000000;
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`;

const Card = styled.div`
  background-color: #ffffff;
  border-radius: 30px;
  padding: 40px 36px;
  width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 18px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
`;

const IconCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Home = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showRegister, setShowRegister] = useState(false);

  const openRegister = () => {
    setShowRegister(true);
    setTimeout(
      () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
      100
    );
  };

  const validateInput = () => {
    let hasErrors = false;

    if (!username) {
      setUsernameError("Username is required");
      hasErrors = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      hasErrors = true;
    }

    return hasErrors;
  };

  const handleLogin = async () => {
    setMessage("");

    if (validateInput()) {
      return;
    }

    try {
      setLoading(true);

      const result = await login({ username, password });

      if (result.ok) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("username", result.data.username);
        localStorage.setItem("role", result.data.role);

        if (result.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/properties");
        }
      } else {
        setMessage(result.message);
      }
    } catch {
      setMessage("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <GlobalStyles
        styles={{
          "*": { margin: 0, padding: 0, boxSizing: "border-box" },
          "html, body, #root": { height: "100%" },
        }}
      />

      <NavBar>
        <Logo>
          <HomeOutlinedIcon sx={{ color: "#333333" }} />
          Homely
        </Logo>

        <NavLinks>
          <span onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</span>
          <span onClick={() => navigate("/properties")}>Properties</span>
          <span onClick={() => navigate("/roommates")}>Roommates</span>
        </NavLinks>

        <div style={{ width: 100 }} />
      </NavBar>

      <Center>
        <Card>
          <IconCircle>
            <HomeOutlinedIcon sx={{ fontSize: 30, color: "#555555" }} />
          </IconCircle>

          <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#222222" }}>
            Welcome to Homely
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#999999", mt: "-10px" }}>
            Sign in to continue to your account
          </Typography>

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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon sx={{ color: "#aaaaaa" }} />
                      ) : (
                        <VisibilityOutlinedIcon sx={{ color: "#aaaaaa" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Row>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: "#999999", "&.Mui-checked": { color: "#2b2b2b" } }}
                />
              }
              label={<Typography sx={{ fontSize: 13, color: "#666666" }}>Remember me</Typography>}
            />
            <Link
              underline="hover"
              sx={{ fontSize: 13, color: "#666666", cursor: "pointer" }}
            >
              Forgot password?
            </Link>
          </Row>

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={() => handleLogin()}
            sx={{
              backgroundColor: "#2b2b2b",
              textTransform: "none",
              padding: "10px",
              fontSize: 15,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#000000" },
            }}
          >
            {loading && <CircularProgress size={20} sx={{ mr: 1, color: "#ffffff" }} />}
            Log in
          </Button>

          <Divider sx={{ width: "100%", color: "#bbbbbb", fontSize: 12 }}>or</Divider>

          <Typography sx={{ fontSize: 13, color: "#666666" }}>
            Don't have an account?{" "}
            <Link
              underline="hover"
              onClick={openRegister}
              sx={{ color: "#2b2b2b", fontWeight: 600, cursor: "pointer" }}
            >
              Sign up
            </Link>
          </Typography>

          <Link
            underline="hover"
            onClick={() => navigate("/properties")}
            sx={{ fontSize: 13, color: "#888888", cursor: "pointer" }}
          >
            Continue as a guest
          </Link>

          {message && (
            <Typography sx={{ fontSize: 13, color: "#888888", textAlign: "center" }}>
              {message}
            </Typography>
          )}
        </Card>
      </Center>

      {showRegister && <RegisterSection />}
    </Page>
  );
};

export default Home;