import axiosInstance from "../lib/axios";

export const createReview = (data: { eventId: string; rating: number; comment: string }) => 
  axiosInstance.post("/v1/reviews", data);
export const getEventReviews = (eventId: string) => axiosInstance.get(`/v1/reviews/event/${eventId}`);
export const updateReview = (id: string, data: {rating?: number; comment?: string}) => axiosInstance.patch(`/v1/reviews/${id}`, data);
export const deleteReview = (id: string) => axiosInstance.delete(`/v1/reviews/${id}`);