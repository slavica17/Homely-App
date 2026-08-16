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

export const getProperty = async (id) => {
  const response = await fetch(`http://localhost:8080/api/properties/${id}`);
  if (response.ok) {
    return { ok: true, data: await response.json() };
  }
  return { ok: false, data: null };
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

export const updateProperty = async (id, property) => {
  const response = await fetch(`http://localhost:8080/api/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(property),
  });
  const data = await response.json().catch(() => null);
  return { ok: response.ok, data };
};

export const uploadPropertyImages = async (propertyId, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  const response = await fetch(
    `http://localhost:8080/api/properties/${propertyId}/images`,
    {
      method: "POST",
      headers: authHeader(),
      body: formData,
    }
  );
  return { ok: response.ok };
};

export const deleteProperty = async (id) => {
  const response = await fetch(`http://localhost:8080/api/properties/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return { ok: response.ok };
};

export const toggleAvailability = async (id) => {
  const response = await fetch(`http://localhost:8080/api/properties/${id}/availability`, {
    method: "PUT",
    headers: authHeader(),
  });
  return { ok: response.ok };
};