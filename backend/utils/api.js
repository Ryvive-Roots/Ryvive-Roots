export const API_URL = "http://localhost:4000";

export const getUserOrders = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/user/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
