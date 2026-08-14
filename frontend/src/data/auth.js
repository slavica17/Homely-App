export const register = async (fields, imageFile) => {
  const formData = new FormData();
  formData.append("username", fields.username);
  formData.append("password", fields.password);
  formData.append("firstName", fields.firstName);
  formData.append("lastName", fields.lastName);
  formData.append("email", fields.email);
  formData.append("role", fields.role);
  if (imageFile) {
    formData.append("profileImage", imageFile);
  }

  const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    body: formData,
  });

  const message = await response.text();
  return { ok: response.ok, message };
};

export const login = async (payload) => {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const data = await response.json();
    return { ok: true, data };
  } else {
    const message = await response.text();
    return { ok: false, message };
  }
};

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: "Bearer " + token };
};

export const getAllUsers = async () => {
  const response = await fetch("http://localhost:8080/api/admin/users", {
    headers: authHeader(),
  });
  if (response.ok) {
    const data = await response.json();
    return { ok: true, data };
  }
  return { ok: false, data: [] };
};

export const approveUser = async (id) => {
  const response = await fetch(`http://localhost:8080/api/admin/users/${id}/approve`, {
    method: "PUT",
    headers: authHeader(),
  });
  return { ok: response.ok };
};

export const toggleBlockUser = async (id) => {
  const response = await fetch(`http://localhost:8080/api/admin/users/${id}/block`, {
    method: "PUT",
    headers: authHeader(),
  });
  return { ok: response.ok };
};

export const deleteUser = async (id) => {
  const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return { ok: response.ok };
};