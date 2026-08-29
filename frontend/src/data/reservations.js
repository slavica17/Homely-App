const authHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: "Bearer " + token };
};

export const createReservation = async (reservation) => {
  const response = await fetch("http://localhost:8080/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", ...authHeader(),
    },
    body: JSON.stringify(reservation),
  });
  const message = await response.text();
  return { ok: response.ok, message };
};

export const getMyReservations = async () => {
  const response = await fetch("http://localhost:8080/api/reservations/my", {
    headers: authHeader(),
  });
  if (response.ok) {
    return { ok: true, data: await response.json() };
  }
  return { ok: false, data: [] };
};

export const getReceivedReservations = async () => {
  const response = await fetch("http://localhost:8080/api/reservations/received", {
    headers: authHeader(),
  });
  if (response.ok) {
    return { ok: true, data: await response.json() };
  }
  return { ok: false, data: [] };
};

export const updateReservationStatus = async (id, status) => {
  const response = await fetch(
    `http://localhost:8080/api/reservations/${id}/status?status=${status}`,
    {
      method: "PUT",
      headers: authHeader(),
    }
  );
  return { ok: response.ok };
};