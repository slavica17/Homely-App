import styled from "@emotion/styled";
import {
  Button,
  Chip,
  CircularProgress,
  GlobalStyles,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProperty } from "@/data/properties";
import ReservationDialog from "@/components/reservation-dialog";

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
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 16px;
`;

const Thumbs = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const Thumb = styled.img`
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.selected ? "#2b2b2b" : "transparent")};
`;

const InfoCard = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px;
  margin-top: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reserveOpen, setReserveOpen] = useState(false);

  const role = localStorage.getItem("role");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getProperty(id);
      if (result.ok) {
        setProperty(result.data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const typeLabel = (t) => {
    if (t === "STAN") return "Apartment";
    if (t === "KUCA") return "House";
    if (t === "SOBA") return "Room";
    return t;
  };

  if (loading) {
    return (
      <Page>
        <Content>
          <CircularProgress />
        </Content>
      </Page>
    );
  }

  if (!property) {
    return (
      <Page>
        <Content>
          <Typography>Property not found.</Typography>
        </Content>
      </Page>
    );
  }

  const images = property.images || [];
  const baseUrl = "http://localhost:8080";

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
          Back
        </Button>
      </NavBar>

      <Content>
        {images.length > 0 ? (
          <>
            <MainImage src={baseUrl + images[selectedImage]} alt={property.title} />
            {images.length > 1 && (
              <Thumbs>
                {images.map((img, index) => (
                  <Thumb
                    key={index}
                    src={baseUrl + img}
                    selected={index === selectedImage}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Thumbs>
            )}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: 300,
              borderRadius: 16,
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888888",
            }}
          >
            No images
          </div>
        )}

        <InfoCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 28, fontWeight: 700 }}>{property.title}</Typography>
            <Chip label={typeLabel(property.type)} sx={{ backgroundColor: "#eeeeee" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", columnGap: 4, marginTop: 8, color: "#888888" }}>
            <PlaceOutlinedIcon sx={{ fontSize: 20 }} />
            <Typography>{property.location}</Typography>
          </div>

          <Typography sx={{ fontSize: 32, fontWeight: 700, color: "#2b2b2b", mt: 2 }}>
            €{property.price}
          </Typography>

          <Typography sx={{ fontSize: 15, color: "#555555", mt: 2, lineHeight: 1.6 }}>
            {property.description || "No description."}
          </Typography>

          <Typography sx={{ fontSize: 13, color: "#aaaaaa", mt: 3 }}>
            Owner: {property.ownerUsername}
          </Typography>

          <Chip
            label={property.available ? "Available" : "Not available"}
            size="small"
            sx={{ mt: 2, backgroundColor: property.available ? "#e0f0e0" : "#ffe0e0" }}
          />

          {isLoggedIn && role === "STANAR" && property.available && (
            <div style={{ marginTop: 24 }}>
              <Button
                variant="contained"
                onClick={() => setReserveOpen(true)}
                sx={{ backgroundColor: "#2b2b2b", textTransform: "none", "&:hover": { backgroundColor: "#000000" } }}
              >
                Reserve
              </Button>
            </div>
          )}
        </InfoCard>
      </Content>

      {reserveOpen && (
        <ReservationDialog
          propertyId={property.id}
          propertyTitle={property.title}
          onClose={() => setReserveOpen(false)}
        />
      )}
    </Page>
  );
};

export default PropertyDetails;