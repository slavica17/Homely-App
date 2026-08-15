import styled from "@emotion/styled";
import {
  Button,
  Chip,
  CircularProgress,
  GlobalStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMyReservations } from "@/data/reservations";

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

const statusChip = (status) => {
  if (status === "ACCEPTED") return <Chip label="Accepted" size="small" sx={{ backgroundColor: "#e0f0e0" }} />;
  if (status === "REJECTED") return <Chip label="Rejected" size="small" sx={{ backgroundColor: "#ffe0e0" }} />;
  return <Chip label="Pending" size="small" sx={{ backgroundColor: "#fff2d0" }} />;
};

const MyReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const result = await getMyReservations();
    if (result.ok) {
      setReservations(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

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
        <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 3 }}>My reservations</Typography>

        {loading ? (
          <CircularProgress />
        ) : reservations.length === 0 ? (
          <Typography sx={{ color: "#888888" }}>You have no reservations.</Typography>
        ) : (
          <Table sx={{ backgroundColor: "#ffffff", borderRadius: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                <TableCell sx={{ fontWeight: 700 }}>Property</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>From</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>To</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.propertyTitle}</TableCell>
                  <TableCell>{r.startDate}</TableCell>
                  <TableCell>{r.endDate}</TableCell>
                  <TableCell>{statusChip(r.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Content>
    </Page>
  );
};

export default MyReservations;