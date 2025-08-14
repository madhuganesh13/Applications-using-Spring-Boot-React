import axios from "axios";

const API_BASE = "http://localhost:8080/api/events";

export const getEvents = (params) => axios.get(API_BASE, { params });
export const getEvent = (id) => axios.get(`${API_BASE}/${id}`);
export const createEvent = (data) => axios.post(API_BASE, data);
export const updateEvent = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteEvent = (id) => axios.delete(`${API_BASE}/${id}`);
