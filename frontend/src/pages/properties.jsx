import styled from "@emotion/styled";
import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  GlobalStyles,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddIcon from "@mui/icons-material/Add";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getProperties, deleteProperty } from "@/data/properties";
import PropertyDialog from "@/components/property-dialog";
import { IconButton } from "@mui/material";
import ProfileDialog from "@/components/profile-dialog";
import { Avatar } from "@mui/material";
import { getMe } from "@/data/auth";
import PropertiesMap from "@/components/properties-map";

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
  margin-bottom: 20px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
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
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const [profileOpen, setProfileOpen] = useState(false);

  const [myImage, setMyImage] = useState(null);

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
    if (isLoggedIn) {
      getMe().then((result) => {
        if (result.ok) {
          setMyImage(result.data.profileImage);
        }
      });
    }
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

  let visibleProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || p.type === typeFilter;
    const matchesPrice = !maxPrice || p.price <= Number(maxPrice);
    return matchesSearch && matchesType && matchesPrice;
  });

  if (sortBy === "priceAsc") {
    visibleProperties = [...visibleProperties].sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceDesc") {
    visibleProperties = [...visibleProperties].sort((a, b) => b.price - a.price);
  }

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
          <div style={{ display: "flex", columnGap: 10, alignItems: "center" }}>
            <Button
              onClick={() => navigate("/roommates")}
              sx={{ color: "#555555", textTransform: "none" }}
            >
              Roommates
            </Button>
            {role === "STANAR" && (
              <Button
                onClick={() => navigate("/my-reservations")}
                sx={{ color: "#555555", textTransform: "none" }}
              >
                My reservations
              </Button>
            )}
            {role === "VLASNIK" && (
              <Button
                onClick={() => navigate("/reservation-requests")}
                sx={{ color: "#555555", textTransform: "none" }}
              >
                Requests
              </Button>
            )}

            <IconButton onClick={() => setProfileOpen(true)}>
              <Avatar
                src={myImage ? "http://localhost:8080" + myImage : undefined}
                sx={{ width: 32, height: 32 }}
              >
                {username ? username[0].toUpperCase() : "?"}
              </Avatar>
            </IconButton>

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{ color: "#555555", borderColor: "#bdbdbd", textTransform: "none" }}
            >
              Log out
            </Button>
          </div>
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

        <Filters>
          <TextField
            placeholder="Search by title or location"
            value={search}
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 220 }}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: "#aaaaaa", mr: 1 }} />,
              },
            }}
          />
          <TextField
            select
            label="Type"
            value={typeFilter}
            size="small"
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="ALL">All types</MenuItem>
            <MenuItem value="STAN">Apartment</MenuItem>
            <MenuItem value="KUCA">House</MenuItem>
            <MenuItem value="SOBA">Room</MenuItem>
          </TextField>
          <TextField
            label="Max price (€)"
            type="number"
            value={maxPrice}
            size="small"
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ minWidth: 140 }}
          />
         <TextField
            select
            label="Sort by"
            value={sortBy}
            size="small"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="none">Default</MenuItem>
            <MenuItem value="priceAsc">Price: low to high</MenuItem>
            <MenuItem value="priceDesc">Price: high to low</MenuItem>
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
          </TextField>
        </Filters>

        <PropertiesMap
          properties={visibleProperties}
          onOpen={(id) => navigate(`/properties/${id}`)}
        />

        {loading ? (
          <CircularProgress />
        ) : visibleProperties.length === 0 ? (
          <Typography sx={{ color: "#888888" }}>No properties match your search.</Typography>
        ) : (
          <Grid>
            {visibleProperties.map((p) => (
              <Card
                key={p.id}
                onClick={() => navigate(`/properties/${p.id}`)}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                }}
              >
                {p.images && p.images.length > 0 && (
                  <img
                    src={"http://localhost:8080" + p.images[0]}
                    alt={p.title}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{p.title}</Typography>
                    <Chip label={typeLabel(p.type)} size="small" sx={{ backgroundColor: "#eeeeee" }} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", columnGap: 4, marginTop: 8, color: "#888888" }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: 14 }}>{p.location}</Typography>
                  </div>

                  <Typography sx={{ fontSize: 13, color: "#777777", mt: 1, minHeight: 40, textAlign: "justify" }}>
                    {p.description || "No description."}
                  </Typography>

                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#2b2b2b", mt: 1 }}>
                    €{p.price}
                  </Typography>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: "#aaaaaa" }}>
                      Owner: {p.ownerUsername}
                    </Typography>

                    {p.ownerUsername === username && (
                      <div style={{ display: "flex", columnGap: 8 }}>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(p);
                          }}
                          sx={{ textTransform: "none", color: "#555555", pl: 0, minWidth: 0 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
                          }}
                          sx={{ textTransform: "none", color: "#d32f2f", pl: 0, minWidth: 0 }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
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

      {editing && (
        <PropertyDialog
          existing={editing}
          onClose={() => setEditing(null)}
          onCreated={loadProperties}
        />
      )}

      {profileOpen && <ProfileDialog onClose={() => setProfileOpen(false)} />}

    </Page>
  );
};

export default Properties;