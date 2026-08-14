const authHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: "Bearer " + token };
};

export const getProperties = async () => {
  const response = await fetch("http://localhost:8080/api/properties");
  if (response.ok) {
    const data = await response.json();
    return { ok: true, data };
  }
  return { ok: false, data: [] };
};

export const createProperty = async (property) => {
  const response = await fetch("http://localhost:8080/api/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(property),
  });
  const data = await response.json().catch(() => null);
  return { ok: response.ok, data };
};

export const deleteProperty = async (id) => {
  const response = await fetch(`http://localhost:8080/api/properties/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return { ok: response.ok };
};