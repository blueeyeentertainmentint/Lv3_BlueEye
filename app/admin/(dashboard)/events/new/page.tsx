import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") redirect("/login");

  return (
    <div className="fade-in" style={{ maxWidth: "800px" }}>
      <div className="mb-10">
        <h1 className="admin-title">
          Create <span className="text-gold">New Event</span>
        </h1>
        <p className="admin-subtitle">Add a new event with timeline updates and guest registrations.</p>
      </div>

      <div className="admin-table-container" style={{ padding: "2rem", marginTop: "1rem" }}>
        <EventForm mode="create" />
      </div>
    </div>
  );
}
