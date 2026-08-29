import styled from "@emotion/styled";
import {
  Button,
  Chip,
  CircularProgress,
  GlobalStyles,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  getAllUsers,
  approveUser,
  toggleBlockUser,
  deleteUser,
  getAllPropertiesAdmin,
  deletePropertyAdmin,
} from "@/data/auth";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import UserDetailsDialog from "@/components/user-details-dialog";

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
  padding: 30px 40px 0 40px;
`;

const TableWrapper = styled.div`
  background-color: #ffffff;
  overflow: hidden;
  max-width: 1300px;
  margin: 0 auto;
`;

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [properties, setProperties] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.ok) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const loadProperties = async () => {
    const result = await getAllPropertiesAdmin();
    if (result.ok) {
      setProperties(result.data);
    }
  };

  useEffect(() => {
    loadUsers();
    loadProperties();
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

  const handleDeleteProperty = async (id) => {
    await deletePropertyAdmin(id);
    loadProperties();
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
          Homely - Admin
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
        <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 2, color: "#222222", textAlign: "center" }}>
          Admin panel
        </Typography>

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Users" sx={{ textTransform: "none" }} />
          <Tab label="Properties" sx={{ textTransform: "none" }} />
        </Tabs>

        {tab === 0 &&
          (loading ? (
            <CircularProgress />
          ) : (
            <TableWrapper>
              <Table sx={{ "& td, & th": { borderColor: "#f0f0f0", px: 4 } }}>
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
                      onClick={() => setSelectedUser(user)}
                      sx={{ "&:hover": { backgroundColor: "#fafafa" }, cursor: "pointer" }}
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
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, flexWrap: "nowrap" }}>
                          {!user.approved && (
                            <Button
                              size="small"
                              onClick={(e) => { e.stopPropagation(); handleApprove(user.id); }}
                              sx={{ textTransform: "none", color: "#2e7d32", minWidth: 0 }}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleBlock(user.id); }}
                            sx={{ textTransform: "none", color: "#ed6c02", minWidth: 0 }}
                          >
                            {user.blocked ? "Unblock" : "Block"}
                          </Button>
                          <Button
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                            sx={{ textTransform: "none", color: "#d32f2f", minWidth: 0 }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          ))}

        {tab === 1 && (
          <TableWrapper>
            <Table sx={{ "& td, & th": { borderColor: "#f0f0f0", px: 4 } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8e8e8" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#555555" }}>Owner</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#555555" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((p) => (
                  <TableRow
                    key={p.id}
                    onClick={() => navigate(`/properties/${p.id}`)}
                    sx={{ "&:hover": { backgroundColor: "#fafafa" }, cursor: "pointer" }}
                  >
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.location}</TableCell>
                    <TableCell>€{p.price}</TableCell>
                    <TableCell>{p.type}</TableCell>
                    <TableCell>{p.ownerUsername}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleDeleteProperty(p.id); }}
                        sx={{ textTransform: "none", color: "#d32f2f" }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </Content>

      {selectedUser && (
        <UserDetailsDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onApprove={async (id) => { await handleApprove(id); setSelectedUser(null); }}
          onBlock={async (id) => { await handleBlock(id); setSelectedUser(null); }}
          onDelete={async (id) => { await handleDelete(id); setSelectedUser(null); }}
        />
      )}
    </Page>
  );
};

export default Admin;