import React, { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "./Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ id: null, title: "", location: "", date: "", description: "" });
  const [filter, setFilter] = useState({ startDate: "", endDate: "" });

  const [open, setOpen] = useState(false); // for modal

  const fetchEvents = async (params = {}) => {
    try {
      setLoading(true);
      setError("");
      const res = await getEvents(params);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        location: form.location,
        date: form.date,
        description: form.description,
      };

      if (form.id) {
        await updateEvent(form.id, payload);
        setEvents(events.map(ev => (ev.id === form.id ? { ...ev, ...payload } : ev)));
      } else {
        const res = await createEvent(payload);
        setEvents([...events, res.data]);
      }

      setForm({ id: null, title: "", location: "", date: "", description: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save event.");
    }
  };

  const onEdit = (ev) => {
    setForm({ id: ev.id, title: ev.title, location: ev.location, date: ev.date, description: ev.description || "" });
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(ev => ev.id !== id));
    } catch (err) {
      setError("Failed to delete event.");
    }
  };

  const applyFilter = () => {
    if (filter.startDate && filter.endDate && filter.endDate < filter.startDate) {
      alert("End date must be after start date");
      return;
    }
    fetchEvents(filter.startDate && filter.endDate ? { startDate: filter.startDate, endDate: filter.endDate } : {});
  };

  const clearFilter = () => {
    setFilter({ startDate: "", endDate: "" });
    fetchEvents();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📅 Event Planner</h1>

      {/* Error Message */}
      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}

      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter by Date</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Input type="date" value={filter.startDate} onChange={(e) => setFilter({ ...filter, startDate: e.target.value })} />
          <Input type="date" value={filter.endDate} onChange={(e) => setFilter({ ...filter, endDate: e.target.value })} />
          <Button onClick={applyFilter}>Apply</Button>
          <Button variant="outline" onClick={clearFilter}>Clear</Button>
        </CardContent>
      </Card>

      {/* Event List */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Events</CardTitle>
          <Button onClick={() => setOpen(true)}>+ Add Event</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center text-gray-500">No events found</TableCell>
                  </TableRow>
                ) : (
                  events.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell>{ev.title}</TableCell>
                      <TableCell>{ev.location}</TableCell>
                      <TableCell>{new Date(ev.date).toLocaleDateString()}</TableCell>
                      <TableCell>{ev.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => onEdit(ev)}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => onDelete(ev.id)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal for Add/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setForm({ id: null, title: "", location: "", date: "", description: "" }); setOpen(false); }}>Cancel</Button>
              <Button type="submit">{form.id ? "Update" : "Add"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
