import React, { useEffect, useState } from "react";

import { getEvents, createEvent, updateEvent, deleteEvent } from "./Api";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ id: null, title: "", location: "", date: "", description: "" });
  const [filter, setFilter] = useState({ startDate: "", endDate: "" });

  const fetchEvents = async (params = {}) => {
    try {
      const res = await getEvents(params);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // API expects date in yyyy-MM-dd. form.date from <input type="date"> is this format.
      const payload = {
        title: form.title,
        location: form.location,
        date: form.date,
        description: form.description
      };

      if (form.id) {
        await updateEvent(form.id, payload);
      } else {
        await createEvent(payload);
      }
      setForm({ id: null, title: "", location: "", date: "", description: "" });
      fetchEvents(filter.startDate && filter.endDate ? { startDate: filter.startDate, endDate: filter.endDate } : {});
    } catch (err) {
      console.error(err);
      alert("Failed to save event");
    }
  };

  const onEdit = (ev) => {
    setForm({ id: ev.id, title: ev.title, location: ev.location, date: ev.date, description: ev.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteEvent(id);
    fetchEvents(filter.startDate && filter.endDate ? { startDate: filter.startDate, endDate: filter.endDate } : {});
  };

  const applyFilter = () => {
    if (filter.startDate && filter.endDate) {
      fetchEvents({ startDate: filter.startDate, endDate: filter.endDate });
    } else {
      fetchEvents();
    }
  };

  const clearFilter = () => {
    setFilter({ startDate: "", endDate: "" });
    fetchEvents();
  };

  return (
    <div className="container">
      <h1>Event Planner</h1>

      <form onSubmit={onSubmit} className="form">
        <h3>{form.id ? "Edit Event" : "Add Event"}</h3>
        <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input required placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">{form.id ? "Update" : "Add"}</button>
        {form.id && <button type="button" onClick={() => setForm({ id: null, title: "", location: "", date: "", description: "" })}>Cancel</button>}
      </form>

      <div className="filter">
        <h3>Filter by Date</h3>
        <input type="date" value={filter.startDate} onChange={e => setFilter({ ...filter, startDate: e.target.value })} />
        <input type="date" value={filter.endDate} onChange={e => setFilter({ ...filter, endDate: e.target.value })} />
        <button onClick={applyFilter}>Apply</button>
        <button onClick={clearFilter}>Clear</button>
      </div>

      <div className="list">
        <h3>Events</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Date</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan="5">No events found</td></tr>
            )}
            {events.map(ev => (
              <tr key={ev.id}>
                <td>{ev.title}</td>
                <td>{ev.location}</td>
                <td>{ev.date}</td>
                <td>{ev.description}</td>
                <td>
                  <button onClick={() => onEdit(ev)}>Edit</button>
                  <button onClick={() => onDelete(ev.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
