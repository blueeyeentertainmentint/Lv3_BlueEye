"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  Upcoming: "gold", Ongoing: "emerald", Completed: "muted", Cancelled: "crimson",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/events?limit=50")
      .then(r => r.json())
      .then(d => {
        setEvents(d.events || []);
        setStats(d.stats || {});
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents(prev => prev.filter(e => e._id !== id));
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex justify-between items-end mb-10 gap-8">
        <div>
          <h1 className="admin-title">
            Event <span className="text-gold">Management</span>
          </h1>
          <p className="admin-subtitle">
            Create and manage events, post timeline updates, and handle registrations.
          </p>
        </div>
        <Link href="/admin/events/new" className="btn-primary py-3 px-6 rounded-xl">
          + Create Event
        </Link>
      </div>

      {/* Stats row */}
      {Object.keys(stats).length > 0 && (
        <div className="flex gap-4 flex-wrap mb-8">
          {Object.entries(stats).map(([status, count]) => (
            <div key={status} className="admin-table-container py-4 px-6 flex flex-col gap-1" style={{ minWidth: 120 }}>
              <span className="text-xs text-text3 uppercase tracking-widest">{status}</span>
              <span className="text-2xl font-bold text-gold">{count as number}</span>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="admin-table-container">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Category</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Reg.</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-16">Loading events…</td></tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    No events yet.{" "}
                    <Link href="/admin/events/new" className="text-gold underline">Create one →</Link>
                  </td>
                </tr>
              ) : events.map((ev) => (
                <tr key={ev._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {ev.coverImage ? (
                        <img src={ev.coverImage} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(212,160,23,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        </div>
                      )}
                      <div>
                        <div className="font-bold">
                          {ev.featured && <span className="text-gold mr-1">✦</span>}
                          {ev.title}
                        </div>
                        <div className="text-xs text-text3">{ev.registrationOpen ? "Registration open" : "Registration closed"}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="admin-badge">{ev.category}</span></td>
                  <td className="text-sm">
                    {new Date(ev.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="text-sm text-text2">{ev.venue?.city || "—"}</td>
                  <td>
                    <span className={`admin-badge ${ev.status === "Ongoing" ? "bg-emerald/10 text-emerald border-emerald/20" : ev.status === "Cancelled" ? "bg-crimson/10 text-crimson border-crimson/20" : ev.status === "Completed" ? "opacity-50" : ""}`}>
                      {ev.status === "Ongoing" && <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#22c55e", marginRight: 5, animation: "pulse 1.5s infinite" }} />}
                      {ev.status}
                    </span>
                  </td>
                  <td className="text-sm text-center">
                    {ev.capacity > 0 ? `/ ${ev.capacity}` : "∞"}
                  </td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/events/${ev._id}`} className="admin-action-btn" title="Manage">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </Link>
                      <Link href={`/events/${ev.slug}`} target="_blank" className="admin-action-btn" title="View public">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </Link>
                      <button onClick={() => handleDelete(ev._id, ev.title)} className="admin-action-btn delete" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
