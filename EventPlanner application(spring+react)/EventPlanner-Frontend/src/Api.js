import axios from "axios";

// Use your Railway backend URL here
const API_BASE = "https://eventplanner-backend-production-cd79.up.railway.app/api";

const API = axios.create({
  baseURL: "https://eventplanner-backend-production-cd79.up.railway.app/api",
});
// Event APIs
export const getEvents = (params) => API.get("/events", { params });
export const getEvent = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post("/events", data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

export default API;










