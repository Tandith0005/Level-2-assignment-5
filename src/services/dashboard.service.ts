import axiosInstance from "../lib/axios";

// user 
export const getDashboardStats = async () => {
  const res = await axiosInstance.get("/v1/dashboard/stats");
  return res.data.data;
};

// admin
export const getAdminDashboardStats = async () => {
  const res = await axiosInstance.get("/v1/dashboard/admin-stats");
  return res.data.data;
};
export const getAllEvents = async (params: {
  search?: string;
  type?: string;
  page: number;
}) => {
  const res = await axiosInstance.get("/v1/events", { params: { ...params, limit: 10 } });
  return res.data;
};

export const adminDeleteEvent = async (id: string) => {
  const res = await axiosInstance.delete(`/v1/events/${id}`);
  return res.data;
};

export const getAllUsersForAdmin = async (params: { q?: string; page: number }) => {
  const res = await axiosInstance.get("/auth/search", {
    params: { q: params.q || "", page: params.page, limit: 12 },
  });
  return res.data;
};

export const adminSoftDelete = async (id: string) => {
  // Uses the admin-capable delete — soft deletes via isDeleted: true
  const res = await axiosInstance.patch(`/auth/adminSoftDelete/${id}`);
  return res.data;
};