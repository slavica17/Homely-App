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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getRoommateAds, deleteRoommateAd } from "@/data/roommates";
import RoommateDialog from "@/components/roommate-dialog";

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

const Roommates = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const username = localStorage.getItem("username");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const loadAds = async () => {
    setLoading(true);
    const result = await getRoommateAds();
    if (result.ok) {
      setAds(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleDelete = async (id) => {
    await deleteRoommateAd(id);
    loadAds();
  };

  const typeLabel = (t) => (t === "NUDIM" ? "Offering" : "Looking");

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
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/properties")}
          sx={{ color: "#555555", textTransform: "none" }}
        >
          Properties
        </Button>
      </NavBar>

      <Content>
        <Header>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#222222" }}>
            Roommates
          </Typography>
          {isLoggedIn && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ backgroundColor: "#2b2b2b", textTransform: "none", "&:hover": { backgroundColor: "#000000" } }}
            >
              Add roommate ad
            </Button>
          )}
        </Header>

        {loading ? (
          <CircularProgress />
        ) : ads.length === 0 ? (
          <Typography sx={{ color: "#888888" }}>No roommate ads yet.</Typography>
        ) : (
          <Grid>
            {ads.map((ad) => (
              <Card
                key={ad.id}
                onClick={() => navigate(`/roommates/${ad.id}`)}
                sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer" }}
              >
                {ad.images && ad.images.length > 0 && (
                  <img
                    src={"http://localhost:8080" + ad.images[0]}
                    alt={ad.title}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{ad.title}</Typography>
                    <Chip
                      label={typeLabel(ad.adType)}
                      size="small"
                      sx={{ backgroundColor: ad.adType === "NUDIM" ? "#e0f0e0" : "#e0e8f0" }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", columnGap: 4, marginTop: 8, color: "#888888" }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: 14 }}>{ad.location}</Typography>
                  </div>

                  <Typography sx={{ fontSize: 13, color: "#777777", mt: 1, minHeight: 40, textAlign: "justify" }}>
                    {ad.description || "No description."}
                  </Typography>

                  {ad.price != null && (
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b", mt: 1 }}>
                      €{ad.price}
                    </Typography>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: "#aaaaaa" }}>
                      By: {ad.authorUsername}
                    </Typography>

                    {ad.authorUsername === username && (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ad.id);
                        }}
                        sx={{ textTransform: "none", color: "#d32f2f", pl: 0, minWidth: 0 }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
        )}
      </Content>

      {dialogOpen && (
        <RoommateDialog
          onClose={() => setDialogOpen(false)}
          onCreated={loadAds}
        />
      )}
    </Page>
  );
};

export default Roommates;