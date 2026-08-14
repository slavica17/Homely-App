import styled from "@emotion/styled";
import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  GlobalStyles,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddIcon from "@mui/icons-material/Add";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getProperties, deleteProperty } from "@/data/properties";
import PropertyDialog from "@/components/property-dialog";

const Page = styled.div`
  min-height: 100vh;
  background-color: #f4f4f4;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #ffffff;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: #222222;
`;

const Content = styled.div`
  padding: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const loadProperties = async () => {
    setLoading(true);
    const result = await getProperties();
    if (result.ok) {
      setProperties(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id) => {
    await deleteProperty(id);
    loadProperties();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  const typeLabel = (t) => {
    if (t === "STAN") return "Apartment";
    if (t === "KUCA") return "House";
    if (t === "SOBA") return "Room";
    return t;
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
          <HomeOutlinedIcon sx={{ color: "#555555" }} />
          Homely
        </Logo>
        {isLoggedIn ? (
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{ color: "#555555", borderColor: "#bdbdbd", textTransform: "none" }}
          >
            Log out
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ backgroundColor: "#2b2b2b", textTransform: "none" }}
          >
            Log in
          </Button>
        )}
      </NavBar>

      <Content>
        <Header>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#222222" }}>
            Properties
          </Typography>
          {role === "VLASNIK" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ backgroundColor: "#2b2b2b", textTransform: "none", "&:hover": { backgroundColor: "#000000" } }}
            >
              Add property
            </Button>
          )}
        </Header>

        {loading ? (
          <CircularProgress />
        ) : properties.length === 0 ? (
          <Typography sx={{ color: "#888888" }}>No properties yet.</Typography>
        ) : (
          <Grid>
            {properties.map((p) => (
              <Card key={p.id} sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <CardContent>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{p.title}</Typography>
                    <Chip label={typeLabel(p.type)} size="small" sx={{ backgroundColor: "#eeeeee" }} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", columnGap: 4, marginTop: 8, color: "#888888" }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: 14 }}>{p.location}</Typography>
                  </div>

                  <Typography sx={{
                    fontSize: 13, color: "#777777", mt: 1, minHeight: 40, textAlign: "justify"
                  }}>
                    {p.description || "No description."}
                  </Typography>

                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b", mt: 1 }}>
                    €{p.price}
                  </Typography>

                  <Typography sx={{ fontSize: 12, color: "#aaaaaa", mt: 1 }}>
                    Owner: {p.ownerUsername}
                  </Typography>

                  {p.ownerUsername === username && (
                    <Button
                      size="small"
                      onClick={() => handleDelete(p.id)}
                      sx={{ textTransform: "none", color: "#d32f2f", mt: 1, pl: 0 }}
                    >
                      Delete
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Grid>
        )}
      </Content>

      {dialogOpen && (
        <PropertyDialog
          onClose={() => setDialogOpen(false)}
          onCreated={loadProperties}
        />
      )}
    </Page>
  );
};

export default Properties;