"use client";

import { useEffect, useState, use } from "react";
import EventForm from "@/components/admin/EventForm";
import EventUpdateForm from "@/components/admin/EventUpdateForm";
import RegistrationTable from "@/components/admin/RegistrationTable";
import Link from "next/link";

type Tab = "details" | "thread" | "registrations";

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>("details");
  const [event, setEvent] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [evRes, updRes, regRes] = await Promise.all([
          fetch(`/api/admin/events/${id}`),
          fetch(`/api/admin/events/${id}/updates`),
          fetch(`/api/admin/events/${id}/registrations`),
        ]);
        if (evRes.ok) setEvent(await evRes.json());
        if (updRes.ok) setUpdates(await updRes.json());
        if (regRes.ok) setRegistrations(await regRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function deleteUpdate(uid: string) {
    if (!confirm("Are you sure you want to delete this update? This action cannot be undone.")) return;
    await fetch(`/api/admin/events/${id}/updates/${uid}`, { method: "DELETE" });
    setUpdates(prev => prev.filter(u => u._id !== uid));
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "details",       label: "Event Details" },
    { key: "thread",        label: `Live Updates Thread (${updates.length})` },
    { key: "registrations", label: `Guest Registrations (${registrations.length})` },
  ];

  const tabBtn = (key: Tab, label: string) => (
    <button
      key={key}
      onClick={() => setTab(key)}
      className={`py-3 px-6 text-sm font-semibold transition-all border-b-2 outline-none ${
        tab === key
          ? "border-gold text-gold font-bold"
          : "border-transparent text-text3 hover:text-white"
      }`}
      style={{ background: "transparent" }}
    >
      {label}
    </button>
  );

  if (loading) return <div className="p-16 text-center text-text3">Loading event details...</div>;
  if (!event) return <div className="p-16 text-center text-crimson">Event not found.</div>;

  return (
    <div className="fade-in">
      {/* Back Link & Header */}
      <div className="mb-8">
        <Link href="/admin/events" className="text-text3 no-underline text-sm flex items-center gap-2 mb-4 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Events List
        </Link>
        
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="admin-title">
              Manage <span className="text-gold">{event.title}</span>
            </h1>
            <p className="admin-subtitle">Configure options, manage the live event status updates, and oversee guest bookings.</p>
          </div>
          <Link href={`/events/${event.slug}`} target="_blank" className="btn-outline flex items-center gap-2 py-2 px-4 rounded-xl text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View Live Page
          </Link>
        </div>
      </div>

      {/* Modern Tabs Navigation */}
      <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
        {tabs.map(t => tabBtn(t.key, t.label))}
      </div>

      {/* Tab Contents */}
      {tab === "details" && (
        <div className="admin-table-container p-8" style={{ maxWidth: "800px" }}>
          <EventForm mode="edit" eventId={id} initial={event} />
        </div>
      )}

      {tab === "thread" && (
        <div style={{ maxWidth: "800px" }}>
          <EventUpdateForm eventId={id} onPosted={u => setUpdates(prev => [u, ...prev])} />
          
          <div className="flex flex-col gap-4 mt-6">
            {updates.length === 0 ? (
              <div className="text-center py-12 text-text3 border border-dashed border-white/10 rounded-xl">
                No updates posted to the live thread yet. Use the form above to add one.
              </div>
            ) : (
              updates.map((u) => {
                const badgeColor = u.type === "Milestone" ? "text-gold bg-gold/10 border-gold/20" : u.type === "Alert" ? "text-crimson bg-crimson/10 border-crimson/20" : u.type === "Media" ? "text-purple-400 bg-purple-400/10 border-purple-400/20" : "text-blue-400 bg-blue-400/10 border-blue-400/20";
                return (
                  <div key={u._id} className="admin-table-container p-6 flex flex-col gap-3">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className={`admin-badge ${badgeColor}`}>{u.type}</span>
                        <span className="text-xs text-text3">
                          {new Date(u.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <button onClick={() => deleteUpdate(u._id)} className="text-xs text-crimson hover:underline bg-transparent border-none cursor-pointer">
                        Delete Post
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed text-text2 m-0">{u.content}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {tab === "registrations" && (
        <div className="admin-table-container p-6">
          <RegistrationTable initialRegistrations={registrations} eventId={id} />
        </div>
      )}
    </div>
  );
}
