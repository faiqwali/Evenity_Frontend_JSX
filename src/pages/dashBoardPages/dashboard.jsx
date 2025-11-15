// src/pages/dashBoardPages/dashboard.jsx
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";

/**
 * Replace these fetchers with your real API calls.
 * Example endpoints assumed:
 *  GET /api/me                 -> returns { id, name, initials, role }
 *  GET /api/organizer/events   -> returns [{ id, title, date, bookingsCount, status }]
 *  GET /api/organizer/bookings -> returns [{ id, eventId, eventTitle, customerName, date, amount, status }]
 */

const fetchMe = async () => {
    const res = await fetch("/api/me");
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  };
  const fetchEvents = async () => {
    const res = await fetch("/api/organizer/events");
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
  };
  const fetchBookings = async () => {
    const res = await fetch("/api/organizer/bookings");
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  };
  
  export default function Dashboard() {
    /* ✅ Updated React Query v5 syntax */
    const { data: me, isLoading: meLoading } = useQuery({
      queryKey: ["me"],
      queryFn: fetchMe,
      staleTime: 1000 * 60 * 2,
    });
  
    const { data: events = [], isLoading: eventsLoading } = useQuery({
      queryKey: ["organizer", "events"],
      queryFn: fetchEvents,
      staleTime: 1000 * 60 * 2,
    });
  
    const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
      queryKey: ["organizer", "bookings"],
      queryFn: fetchBookings,
      staleTime: 1000 * 60 * 2,
    });

  // derived stats
  const totalEvents = events.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s, b) => s + (b.amount || 0), 0);

  // bookings grouped by event for chart
  const bookingsByEvent = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      map[e.title] = 0;
    });
    bookings.forEach((b) => {
      map[b.eventTitle] = (map[b.eventTitle] || 0) + 1;
    });
    // return array sorted by count desc
    return Object.entries(map)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [events, bookings]);

  // loading state
  const loading = meLoading || eventsLoading || bookingsLoading;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {loading ? "Welcome," : `Welcome back, ${me?.name || ""}`}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {loading
              ? "Loading your dashboard..."
              : `You have ${totalEvents} event${totalEvents !== 1 ? "s" : ""} and ${totalBookings} booking${
                  totalBookings !== 1 ? "s" : ""
                }.`}
          </p>
        </div>

        {/* <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-sky-700">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-sky-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-medium">
              {me?.initials || "ME"}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium text-gray-800">{me?.name || "Organizer"}</span>
              <span className="text-xs text-gray-500">{me?.role || "Organizer"}</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Events" value={loading ? "-" : totalEvents} subtitle="Events you've posted" />
        <StatCard title="Total Bookings" value={loading ? "-" : totalBookings} subtitle="Bookings across your events" />
        <StatCard title="Total Revenue" value={loading ? "-" : `PKR ${formatNumber(totalRevenue)}`} subtitle="Collected (est.)" />
        <StatCard title="Active Events" value={loading ? "-" : events.filter((e) => e.status === "active").length} subtitle="Currently visible" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bookings table */}
        <div className="lg:col-span-2 bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <div className="text-sm text-gray-500">Latest 10</div>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              <Skeleton rows={4} />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No bookings yet. Promote your events to get bookings!</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="py-2">Event</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 10).map((b) => (
                    <tr key={b.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-3">{b.eventTitle}</td>
                      <td className="py-3">{b.customerName}</td>
                      <td className="py-3 text-xs text-gray-600">{formatDate(b.date)}</td>
                      <td className="py-3">₹{b.amount ?? 0}</td>
                      <td className="py-3">
                        <StatusPill status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Events + chart + quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Bookings by Event</h3>
            {loading ? (
              <Skeleton rows={6} />
            ) : bookingsByEvent.length === 0 ? (
              <div className="text-gray-500 text-sm">No bookings yet.</div>
            ) : (
              <BarChart data={bookingsByEvent} />
            )}
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Events</h3>
              <button className="text-sm text-sky-600">View all</button>
            </div>

            {loading ? (
              <Skeleton rows={3} />
            ) : events.length === 0 ? (
              <div className="text-gray-500 text-sm">You haven't posted any events yet.</div>
            ) : (
              <ul className="space-y-3">
                {events.slice(0, 5).map((e) => (
                  <li key={e.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs font-medium">
                      {e.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{e.title}</div>
                      <div className="text-xs text-gray-500">{formatDate(e.date)}</div>
                    </div>
                    <div className="text-xs text-gray-600">{e.bookingsCount ?? 0} bookings</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <a href="/post-event" className="block text-center py-2 rounded bg-sky-600 text-white">Post New Event</a>
              <a href="/bookings" className="block text-center py-2 rounded border border-sky-600 text-sky-600">View Bookings</a>
              <button className="block text-center py-2 rounded bg-gray-50 text-gray-700">Create Promo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Small helper components
   ------------------------- */

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="mt-2 text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
}

function StatusPill({ status = "confirmed" }) {
  const map = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const cls = map[status] || "bg-gray-100 text-gray-700";
  return <span className={`${cls} px-2 py-1 rounded text-xs font-medium`}>{status}</span>;
}

/* Tiny bar chart using SVG (no external deps) */
function BarChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const height = 140;
  const barWidth = 28;
  return (
    <div className="w-full overflow-x-auto">
      <svg width={Math.max(data.length * (barWidth + 12), 220)} height={height} className="block">
        {data.map((d, i) => {
          const x = i * (barWidth + 12) + 10;
          const barH = Math.round((d.count / max) * (height - 40));
          const y = height - barH - 20;
          return (
            <g key={d.title}>
              <rect x={x} y={y} width={barWidth} height={barH} rx="6" ry="6" className="fill-sky-600" />
              <text x={x + barWidth / 2} y={height - 4} fontSize="10" textAnchor="middle" fill="#475569">
                {truncate(d.title, 12)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* Skeleton */
function Skeleton({ rows = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded" />
      ))}
    </div>
  );
}

/* Utilities */
function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}
function formatNumber(n) {
  return n.toLocaleString();
}
function truncate(s = "", l = 12) {
  return s.length > l ? s.slice(0, l - 1) + "…" : s;
}
