"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type FormState = "idle" | "loading" | "success" | "error";
type RegistrationStatus = "Pending" | "Approved" | "Rejected" | "Waitlisted";

type ExistingRegistration = {
  status: RegistrationStatus;
  guestName?: string;
  headcount?: number;
};

const STATUS_COPY: Record<
  RegistrationStatus,
  { title: string; body: string; color: string; border: string; bg: string }
> = {
  Pending: {
    title: "Registration pending",
    body: "Your request is under review. We'll notify you by email and WhatsApp once it's confirmed.",
    color: "#d4a017",
    border: "rgba(212,160,23,0.25)",
    bg: "rgba(212,160,23,0.07)",
  },
  Approved: {
    title: "You're registered",
    body: "Your spot is confirmed. See you at the event!",
    color: "#22c55e",
    border: "rgba(34,197,94,0.2)",
    bg: "rgba(34,197,94,0.07)",
  },
  Rejected: {
    title: "Registration not accepted",
    body: "We couldn't accommodate your request this time. Thank you for your interest.",
    color: "#f87171",
    border: "rgba(248,113,113,0.2)",
    bg: "rgba(248,113,113,0.07)",
  },
  Waitlisted: {
    title: "You're on the waitlist",
    body: "We'll contact you if a spot opens up.",
    color: "#60a5fa",
    border: "rgba(96,165,250,0.2)",
    bg: "rgba(96,165,250,0.07)",
  },
};

export default function EventRegistrationForm({
  slug,
  closed,
  initialRegistration = null,
  registrationPrefetched = false,
}: {
  slug: string;
  closed?: boolean;
  initialRegistration?: ExistingRegistration | null;
  /** True when the server already resolved registration for the signed-in user */
  registrationPrefetched?: boolean;
}) {
  const { data: session, status: authStatus } = useSession();
  const loginHref = `/login?callbackUrl=${encodeURIComponent(`/events/${slug}`)}`;

  const [form, setForm] = useState({ guestName: "", guestPhone: "", headcount: 1, message: "" });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [existing, setExisting] = useState<ExistingRegistration | null>(initialRegistration);
  const [statusLoading, setStatusLoading] = useState(
    !registrationPrefetched && authStatus === "authenticated"
  );

  useEffect(() => {
    if (session?.user?.name && !form.guestName) {
      setForm((f) => ({ ...f, guestName: session.user?.name || "" }));
    }
  }, [session?.user?.name, form.guestName]);

  useEffect(() => {
    if (authStatus !== "authenticated") {
      setStatusLoading(false);
      return;
    }

    if (registrationPrefetched) {
      setExisting(initialRegistration);
      setStatusLoading(false);
      return;
    }

    let cancelled = false;
    setStatusLoading(true);

    fetch(`/api/events/${slug}/register`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setExisting(json.registration ?? null);
        if (json.name) {
          setForm((f) => (f.guestName ? f : { ...f, guestName: json.name }));
        }
      })
      .catch(() => {
        if (!cancelled) setExisting(null);
      })
      .finally(() => {
        if (!cancelled) setStatusLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authStatus, slug, initialRegistration, registrationPrefetched]);

  useEffect(() => {
    if (authStatus !== "authenticated" || existing) return;

    let cancelled = false;
    fetch("/api/users/profile")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.success || !json.data?.contactDetails) return;
        setForm((f) => (f.guestPhone ? f : { ...f, guestPhone: json.data.contactDetails }));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [authStatus, existing]);

  if (closed) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          color: "var(--muted,#9ca3af)",
          fontSize: "0.875rem",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "0.75rem",
        }}
      >
        Registration is currently closed for this event.
      </div>
    );
  }

  if (authStatus === "loading" || statusLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--muted,#9ca3af)", fontSize: "0.875rem" }}>
        Checking your registration…
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          borderRadius: "0.75rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "var(--muted,#9ca3af)", lineHeight: 1.6 }}>
          Sign in to register. We use your account email so you can see your registration status right away.
        </p>
        <Link href={loginHref} className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
          Sign in to register ✦
        </Link>
      </div>
    );
  }

  if (existing) {
    const copy = STATUS_COPY[existing.status] || STATUS_COPY.Pending;
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          borderRadius: "0.75rem",
          background: copy.bg,
          border: `1px solid ${copy.border}`,
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {existing.status === "Approved" ? "🎉" : existing.status === "Rejected" ? "—" : "✦"}
        </div>
        <h3 style={{ margin: "0 0 0.5rem", color: copy.color, fontSize: "1.05rem" }}>{copy.title}</h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted,#9ca3af)", lineHeight: 1.6 }}>{copy.body}</p>
        {session?.user?.email && (
          <p style={{ margin: "1rem 0 0", fontSize: "0.75rem", color: "var(--muted,#6b7280)" }}>
            Registered as {session.user.email}
          </p>
        )}
      </div>
    );
  }

  if (state === "success") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem 1rem",
          borderRadius: "0.75rem",
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.2)",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
        <h3 style={{ margin: "0 0 0.5rem", color: "#22c55e", fontSize: "1.05rem" }}>Request Submitted!</h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted,#9ca3af)", lineHeight: 1.6 }}>
          Your registration is pending review. You'll be notified by email and WhatsApp once confirmed.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setExisting(json.registration || { status: "Pending" });
      setState("idle");
    } catch (err: unknown) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.65rem 0.85rem",
    borderRadius: "0.5rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--text)",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--muted,#9ca3af)",
    marginBottom: "0.35rem",
    letterSpacing: "0.04em",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {session?.user?.email && (
        <div
          style={{
            padding: "0.65rem 0.85rem",
            borderRadius: "0.5rem",
            background: "rgba(212,160,23,0.06)",
            border: "1px solid rgba(212,160,23,0.15)",
            fontSize: "0.82rem",
            color: "var(--muted,#9ca3af)",
          }}
        >
          <span style={{ display: "block", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
            Account email
          </span>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>{session.user.email}</span>
        </div>
      )}
      <div>
        <label style={labelStyle}>Full Name *</label>
        <input
          style={inputStyle}
          required
          placeholder="Your name"
          value={form.guestName}
          onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
        />
      </div>
      <div>
        <label style={labelStyle}>Phone (WhatsApp) *</label>
        <input
          style={inputStyle}
          required
          placeholder="+91 98765 43210"
          value={form.guestPhone}
          onChange={(e) => setForm((f) => ({ ...f, guestPhone: e.target.value }))}
        />
      </div>
      <div>
        <label style={labelStyle}>Number of Guests</label>
        <input
          style={inputStyle}
          type="number"
          min={1}
          max={20}
          value={form.headcount}
          onChange={(e) => setForm((f) => ({ ...f, headcount: parseInt(e.target.value, 10) || 1 }))}
        />
      </div>
      <div>
        <label style={labelStyle}>Message (optional)</label>
        <textarea
          style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
          placeholder="Any special requirements?"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
      </div>

      {state === "error" && (
        <p
          style={{
            margin: 0,
            fontSize: "0.82rem",
            color: "#f87171",
            padding: "0.5rem 0.75rem",
            background: "rgba(248,113,113,0.08)",
            borderRadius: "0.4rem",
          }}
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-primary"
        style={{ opacity: state === "loading" ? 0.7 : 1, cursor: state === "loading" ? "wait" : "pointer" }}
      >
        {state === "loading" ? "Submitting…" : "Request Registration ✦"}
      </button>
      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted,#6b7280)", textAlign: "center" }}>
        Confirmation goes to your account email and WhatsApp.
      </p>
    </form>
  );
}
