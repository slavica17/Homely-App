const authHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: "Bearer " + token };
};

export const getRoommateAds = async () => {
  const response = await fetch("http://localhost:8080/api/roommates");
  if (response.ok) {
    return { ok: true, data: await response.json() };
  }
  return { ok: false, data: [] };
};

export const getRoommateAd = async (id) => {
  const response = await fetch(`http://localhost:8080/api/roommates/${id}`);
  if (response.ok) {
    return { ok: true, data: await response.json() };
  }
  return { ok: false, data: null };
};

export const createRoommateAd = async (ad) => {
  const response = await fetch("http://localhost:8080/api/roommates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", ...authHeader(),
    },
    body: JSON.stringify(ad),
  });
  const data = await response.json().catch(() => null);
  return { ok: response.ok, data };
};

export const uploadRoommateImages = async (adId, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }
  const response = await fetch(`http://localhost:8080/api/roommates/${adId}/images`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });
  return { ok: response.ok };
};

export const deleteRoommateAd = async (id) => {
  const response = await fetch(`http://localhost:8080/api/roommates/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return { ok: response.ok };
};