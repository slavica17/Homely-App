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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  getAllUsers,
  approveUser,
  toggleBlockUser,
  deleteUser,
} from "@/data/auth";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const Page = styled.div`
  min-height: 100vh;
  background-color: #f4f4f4;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
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
  padding: 30px 40px 0 40px;
`;

const TableWrapper = styled.div`
  background-color: #ffffff;
  overflow: hidden;
  max-width: 1100px;
  margin: 0 auto;
`;

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.ok) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (id) => {
    await approveUser(id);
    loadUsers();
  };

  const handleBlock = async (id) => {
    await toggleBlockUser(id);
    loadUsers();
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
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
          Homely — Admin
        </Logo>
        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{ color: "#555555", borderColor: "#bdbdbd", textTransform: "none" }}
        >
          Log out
        </Button>
      </NavBar>

      <Content>
        <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 3, color: "#222222", textAlign: "center" }}>
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableWrapper>
            <Table sx={{ "& td, & th": { borderColor: "#f0f0f0", px: 5 } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8e8e8" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#555555" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.blocked ? (
                        <Chip label="Blocked" size="small" sx={{ backgroundColor: "#ffe0e0" }} />
                      ) : user.approved ? (
                        <Chip label="Active" size="small" sx={{ backgroundColor: "#e0f0e0" }} />
                      ) : (
                        <Chip label="Pending" size="small" sx={{ backgroundColor: "#fff2d0" }} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {!user.approved && (
                        <Button
                          size="small"
                          onClick={() => handleApprove(user.id)}
                          sx={{ textTransform: "none", color: "#2e7d32" }}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        size="small"
                        onClick={() => handleBlock(user.id)}
                        sx={{ textTransform: "none", color: "#ed6c02" }}
                      >
                        {user.blocked ? "Unblock" : "Block"}
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleDelete(user.id)}
                        sx={{ textTransform: "none", color: "#d32f2f" }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </Content>
    </Page>
  );
};

export default Admin;