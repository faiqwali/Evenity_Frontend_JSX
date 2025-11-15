// src/pages/dashBoardPages/OrganizerEventBookings.jsx
import React, { useMemo, useState } from "react";

/**
 * OrganizerEventBookings.jsx
 *
 * Features:
 * - Top summary cards (total events, total seats sold, total revenue)
 * - Filters: search events by name, filter by category
 * - Events pagination
 * - Accordion per event with rotating SVG chevron
 * - Badges per event: total bookings, total revenue, seats left
 * - Bookings list (small cards) with attendee search & bookings pagination per event
 *
 * Dummy data below — replace fetch logic with your API calls as needed.
 */

/* ----------------- Dummy data (replace with real API data) ----------------- */
const dummyEvents = [
  {
    eventId: 1,
    title: "Rock Concert",
    category: "concert",
    eventDate: "2025-12-01T18:00:00Z",
    totalTickets: 200,
    price: 25.0,
    bookings: Array.from({ length: 23 }, (_, i) => ({
      bookingId: `b-1-${i + 1}`,
      attendeeId: 100 + i,
      attendeeName: `Alice ${i + 1}`,
      ticketCount: Math.floor(Math.random() * 3) + 1,
      amount: undefined, // calculated below
      createdAt: new Date(2025, 10, i + 1, 10, 0, 0).toISOString(),
      status: "confirmed",
    })),
  },
  {
    eventId: 2,
    title: "Tech Conference",
    category: "conference",
    eventDate: "2025-12-05T09:00:00Z",
    totalTickets: 150,
    price: 75.0,
    bookings: Array.from({ length: 12 }, (_, i) => ({
      bookingId: `b-2-${i + 1}`,
      attendeeId: 200 + i,
      attendeeName: `Bob ${i + 1}`,
      ticketCount: Math.floor(Math.random() * 4) + 1,
      amount: undefined,
      createdAt: new Date(2025, 10, i + 1, 9, 30, 0).toISOString(),
      status: "confirmed",
    })),
  },
  {
    eventId: 3,
    title: "Cooking Workshop",
    category: "workshop",
    eventDate: "2025-12-10T15:00:00Z",
    totalTickets: 60,
    price: 40.0,
    bookings: Array.from({ length: 8 }, (_, i) => ({
      bookingId: `b-3-${i + 1}`,
      attendeeId: 300 + i,
      attendeeName: `Cara ${i + 1}`,
      ticketCount: Math.floor(Math.random() * 2) + 1,
      amount: undefined,
      createdAt: new Date(2025, 10, i + 1, 14, 0, 0).toISOString(),
      status: "confirmed",
    })),
  },
  {
    eventId: 4,
    title: "Art Exhibition",
    category: "exhibition",
    eventDate: "2025-12-15T12:00:00Z",
    totalTickets: 120,
    price: 15.0,
    bookings: Array.from({ length: 15 }, (_, i) => ({
      bookingId: `b-4-${i + 1}`,
      attendeeId: 400 + i,
      attendeeName: `Dana ${i + 1}`,
      ticketCount: Math.floor(Math.random() * 3) + 1,
      amount: undefined,
      createdAt: new Date(2025, 10, i + 1, 11, 30, 0).toISOString(),
      status: "confirmed",
    })),
  },
  {
    eventId: 5,
    title: "Yoga Retreat",
    category: "wellness",
    eventDate: "2025-12-20T08:00:00Z",
    totalTickets: 80,
    price: 55.0,
    bookings: Array.from({ length: 10 }, (_, i) => ({
      bookingId: `b-5-${i + 1}`,
      attendeeId: 500 + i,
      attendeeName: `Eve ${i + 1}`,
      ticketCount: Math.floor(Math.random() * 2) + 1,
      amount: undefined,
      createdAt: new Date(2025, 10, i + 1, 8, 15, 0).toISOString(),
      status: "confirmed",
    })),
  },
  {
    eventId: 6,
    title: "Startup Meetup",
    category: "meetup",
    eventDate: "2025-12-25T18:00:00Z",
    totalTickets: 250,
    price: 10.0,
    bookings: Array.from({ length: 18 }, (_, i) => ({
      bookingId: `b-6-${i + 1}`,
      attendeeId: 600 + i,
      attendeeName: `Frank ${i + 1}`,
      ticketCount: Math.floor(Math.random() * 3) + 1,
      amount: undefined,
      createdAt: new Date(2025, 10, i + 1, 17, 45, 0).toISOString(),
      status: "confirmed",
    })),
  },
];

// compute amount from ticketCount and event price
dummyEvents.forEach((ev) => {
  ev.bookings.forEach((b) => {
    b.amount = Number((b.ticketCount * ev.price).toFixed(2));
  });
});
/* ----------------- End dummy data ----------------- */

const EVENTS_PER_PAGE = 4;
const BOOKINGS_PER_PAGE = 5;

export default function OrganizerEventBookings() {
  // UI state
  const [openEventId, setOpenEventId] = useState(null);
  const [eventsPage, setEventsPage] = useState(1);

  // event-level state for bookings pagination & attendee search (per event)
  const [bookingsPages, setBookingsPages] = useState({}); // { [eventId]: page }
  const [attendeeFilters, setAttendeeFilters] = useState({}); // { [eventId]: "search text" }

  // event filters
  const [eventSearch, setEventSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  /* ----------------- Derived data (filtered & paginated events) ----------------- */
  const categories = useMemo(() => {
    const set = new Set(dummyEvents.map((e) => e.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    return dummyEvents.filter((e) => {
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      if (q && !e.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [eventSearch, categoryFilter]);

  const totalEvents = filteredEvents.length;

  const eventsTotalPages = Math.max(1, Math.ceil(totalEvents / EVENTS_PER_PAGE));
  const eventsStart = (eventsPage - 1) * EVENTS_PER_PAGE;
  const eventsEnd = eventsStart + EVENTS_PER_PAGE;
  const pageEvents = filteredEvents.slice(eventsStart, eventsEnd);

  /* Top summary: computed from ENTIRE dummyEvents (not just filtered) — you can change to filtered if you prefer */
  const summary = useMemo(() => {
    const totalEv = dummyEvents.length;
    let totalSold = 0;
    let totalRevenue = 0;
    dummyEvents.forEach((e) => {
      const sold = e.bookings.reduce((s, b) => s + b.ticketCount, 0);
      const revenue = e.bookings.reduce((s, b) => s + b.amount, 0);
      totalSold += sold;
      totalRevenue += revenue;
    });
    return { totalEv, totalSold, totalRevenue };
  }, []);

  /* ----------------- Helpers ----------------- */
  const toggleAccordion = (eventId) => {
    setOpenEventId((prev) => (prev === eventId ? null : eventId));
    // reset attendee filter/page when opening
    if (openEventId !== eventId) {
      setAttendeeFilters((p) => ({ ...p, [eventId]: "" }));
      setBookingsPages((p) => ({ ...p, [eventId]: 1 }));
    }
  };

  const handleEventPage = (newPage) => {
    setEventsPage(newPage);
    // close open accordion when changing page (optional)
    setOpenEventId(null);
  };

  const handleBookingsPage = (eventId, newPage) => {
    setBookingsPages((prev) => ({ ...prev, [eventId]: newPage }));
  };

  const handleAttendeeFilter = (eventId, text) => {
    setAttendeeFilters((prev) => ({ ...prev, [eventId]: text }));
    // reset page when filter changes
    setBookingsPages((prev) => ({ ...prev, [eventId]: 1 }));
  };

  /* ----------------- Render helpers for badges & booking pagination ----------------- */
  const calcEventStats = (event) => {
    const totalBookings = event.bookings.length;
    const totalBookedSeats = event.bookings.reduce((s, b) => s + b.ticketCount, 0);
    const totalRevenue = event.bookings.reduce((s, b) => s + b.amount, 0);
    const seatsLeft = Math.max((event.totalTickets ?? 0) - totalBookedSeats, 0);
    return { totalBookings, totalBookedSeats, totalRevenue, seatsLeft };
  };

  const renderChevron = ({ open }) => (
    <svg
      className={`w-6 h-6 transform transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7 5l6 5-6 5V5z" />
    </svg>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700">Organizer Dashboard — Bookings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage events, see bookings and revenue at a glance.</p>
        </div>

        {/* Top summary cards */}
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded shadow flex flex-col items-center w-40">
            <div className="text-xs text-gray-500">Total Events</div>
            <div className="text-2xl font-bold text-indigo-700">{summary.totalEv}</div>
          </div>
          <div className="bg-white p-4 rounded shadow flex flex-col items-center w-44">
            <div className="text-xs text-gray-500">Total Seats Sold</div>
            <div className="text-2xl font-bold text-green-600">{summary.totalSold}</div>
          </div>
          <div className="bg-white p-4 rounded shadow flex flex-col items-center w-52">
            <div className="text-xs text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold text-yellow-600">${summary.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search event by title..."
            value={eventSearch}
            onChange={(e) => { setEventSearch(e.target.value); setEventsPage(1); }}
            className="px-3 py-2 rounded border w-full sm:w-72"
          />
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setEventsPage(1); }}
            className="px-3 py-2 rounded border"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">Showing {pageEvents.length} of {totalEvents} events</div>
      </div>

      {/* Events list (paginated) */}
      <div className="space-y-4">
        {pageEvents.map((event) => {
          const { totalBookings, totalBookedSeats, totalRevenue, seatsLeft } = calcEventStats(event);

          // bookings filter & pagination per event
          const attendeeQuery = (attendeeFilters[event.eventId] || "").trim().toLowerCase();
          const filteredBookings = event.bookings.filter((b) =>
            !attendeeQuery || b.attendeeName.toLowerCase().includes(attendeeQuery)
          );

          const bp = bookingsPages[event.eventId] || 1;
          const bookingsTotalPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE));
          const bookStart = (bp - 1) * BOOKINGS_PER_PAGE;
          const bookEnd = bookStart + BOOKINGS_PER_PAGE;
          const pageBookings = filteredBookings.slice(bookStart, bookEnd);

          return (
            <div key={event.eventId} className="relative bg-white rounded shadow-md border-l-4 border-indigo-500 overflow-hidden">
              {/* floating badges */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">{totalBookings} Bookings</div>
                <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">${totalRevenue.toFixed(2)}</div>
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">{seatsLeft} Seats Left</div>
              </div>

              {/* accordion header */}
              <button
                onClick={() => toggleAccordion(event.eventId)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 hover:bg-indigo-50 transition"
              >
                <div>
                  <div className="text-lg font-semibold text-indigo-700">{event.title}</div>
                  <div className="text-sm text-gray-500">{new Date(event.eventDate).toLocaleString()}</div>
                  <div className="text-xs mt-1 inline-flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 text-xs">{event.category}</span>
                    <span className="text-gray-500"> • Price: ${Number(event.price).toFixed(2)}</span>
                    <span className="text-gray-500"> • Tickets: {event.totalTickets}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-4`}>
                  <div className="text-sm text-gray-600">Revenue ${totalRevenue.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">{totalBookings} bookings</div>
                  <div className="transform transition-transform duration-300">
                    {/* chevron rotates when open */}
                    <svg
                      className={`w-6 h-6 text-indigo-500 ${openEventId === event.eventId ? "rotate-90" : "rotate-0"} transition-transform`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M7 5l6 5-6 5V5z" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* accordion body */}
              {openEventId === event.eventId && (
                <div className="px-6 pb-6 pt-2 border-t bg-gray-50">
                  {/* event summary row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white rounded p-3 shadow">
                      <div className="text-xs text-gray-500">Total Tickets</div>
                      <div className="font-bold">{event.totalTickets}</div>
                    </div>
                    <div className="bg-white rounded p-3 shadow">
                      <div className="text-xs text-gray-500">Sold Seats</div>
                      <div className="font-bold text-green-600">{totalBookedSeats}</div>
                    </div>
                    <div className="bg-white rounded p-3 shadow">
                      <div className="text-xs text-gray-500">Event Revenue</div>
                      <div className="font-bold text-yellow-600">${totalRevenue.toFixed(2)}</div>
                    </div>
                    <div className="bg-white rounded p-3 shadow">
                      <div className="text-xs text-gray-500">Seats Left</div>
                      <div className="font-bold">{seatsLeft}</div>
                    </div>
                  </div>

                  {/* attendee search */}
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Filter attendees by name..."
                      value={attendeeFilters[event.eventId] || ""}
                      onChange={(e) => handleAttendeeFilter(event.eventId, e.target.value)}
                      className="px-3 py-2 rounded border w-full md:w-1/2"
                    />
                    <div className="text-sm text-gray-600">{filteredBookings.length} matching bookings</div>
                  </div>

                  {/* bookings list (cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pageBookings.length === 0 ? (
                      <div className="col-span-full text-center text-gray-500 p-6 bg-white rounded shadow">No bookings found.</div>
                    ) : (
                      pageBookings.map((b) => (
                        <div key={b.bookingId} className="bg-white p-3 rounded shadow hover:shadow-lg transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">{b.attendeeName}</div>
                              <div className="text-xs text-gray-500">ID: {b.attendeeId}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold">${b.amount.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">{b.ticketCount} ticket(s)</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mt-2">{b.status}</div>
                          <div className="text-xs text-gray-400 mt-2">{new Date(b.createdAt).toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* bookings pagination */}
                  {bookingsTotalPages > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleBookingsPage(event.eventId, Math.max(1, bp - 1))}
                        disabled={bp <= 1}
                        className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                      >
                        Prev
                      </button>
                      <div className="text-sm text-gray-700">Page {bp} of {bookingsTotalPages}</div>
                      <button
                        onClick={() => handleBookingsPage(event.eventId, Math.min(bookingsTotalPages, bp + 1))}
                        disabled={bp >= bookingsTotalPages}
                        className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* events pagination */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => handleEventPage(Math.max(1, eventsPage - 1))}
          disabled={eventsPage <= 1}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
        >
          Prev
        </button>
        <div className="text-sm text-gray-700">Page {eventsPage} of {eventsTotalPages}</div>
        <button
          onClick={() => handleEventPage(Math.min(eventsTotalPages, eventsPage + 1))}
          disabled={eventsPage >= eventsTotalPages}
          className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}


// // src/pages/dashBoardPages/OrganizerBookings.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

// /**
//  * OrganizerBookings
//  *
//  * Props:
//  * - organizerId (number|string) optional. If not provided, component will try to read localStorage.organizerId
//  *
//  * Endpoints expected (adjust if your backend uses other routes):
//  * GET  /api/organizer/:organizerId/events-with-sales        -> { success: true, events: [...] }
//  * GET  /api/events/:eventId/bookings?page=1&limit=50        -> { success: true, bookings: [...], total }
//  * PATCH /api/bookings/:bookingId/cancel                      -> { success: true, booking }
//  *
//  * Note: edit endpoint paths to match your backend. This component is frontend-only.
//  */

// export default function Bookings({ organizerId: propOrganizerId }) {
//   const nav = useNavigate();
//   const organizerId = propOrganizerId ?? localStorage.getItem("organizerId"); // fallback
//   const [events, setEvents] = useState([]);
//   const [loadingEvents, setLoadingEvents] = useState(false);

//   // bookings modal state
//   const [showBookingsModal, setShowBookingsModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [bookingsPage, setBookingsPage] = useState(1);
//   const [bookingsTotal, setBookingsTotal] = useState(0);
//   const [loadingBookings, setLoadingBookings] = useState(false);
//   const BOOKINGS_LIMIT = 20;

//   // fetch all events with sales for this organizer
//   const fetchEvents = useCallback(async () => {
//     if (!organizerId) return;
//     setLoadingEvents(true);
//     try {
//       const res = await fetch(`/api/organizer/${organizerId}/events-with-sales`);
//       const data = await res.json();
//       if (data?.success) {
//         setEvents(data.events);
//       } else {
//         console.error("Failed to fetch events", data);
//         MySwal.fire({ title: "Error", text: (data?.message || "Failed to fetch events"), icon: "error" });
//       }
//     } catch (err) {
//       console.error(err);
//       MySwal.fire({ title: "Error", text: "Network error while fetching events", icon: "error" });
//     } finally {
//       setLoadingEvents(false);
//     }
//   }, [organizerId]);

//   useEffect(() => {
//     fetchEvents();
//     // optional: poll for updates every 30s
//     // const id = setInterval(fetchEvents, 30000); return () => clearInterval(id);
//   }, [fetchEvents]);

//   // summary values
//   const totalEvents = events.length;
//   const totalSoldSeats = events.reduce((s, e) => s + Number(e.sold_seats ?? 0), 0);
//   const totalRevenue = events.reduce((s, e) => s + (Number(e.sold_seats ?? 0) * Number(e.price ?? 0)), 0);

//   // open bookings modal for an event
//   const openBookingsModal = (event) => {
//     setSelectedEvent(event);
//     setBookingsPage(1);
//     setShowBookingsModal(true);
//     fetchBookings(event.id, 1);
//   };

//   // fetch bookings for event (paginated)
//   const fetchBookings = async (eventId, page = 1) => {
//     setLoadingBookings(true);
//     try {
//       const res = await fetch(`/api/events/${eventId}/bookings?page=${page}&limit=${BOOKINGS_LIMIT}`);
//       const data = await res.json();
//       if (data?.success) {
//         setBookings(data.bookings || []);
//         setBookingsTotal(data.total ?? data.bookings?.length ?? 0);
//         setBookingsPage(page);
//       } else {
//         console.error("Failed to fetch bookings", data);
//         MySwal.fire({ title: "Error", text: (data?.message || "Failed to fetch bookings"), icon: "error" });
//       }
//     } catch (err) {
//       console.error(err);
//       MySwal.fire({ title: "Error", text: "Network error while fetching bookings", icon: "error" });
//     } finally {
//       setLoadingBookings(false);
//     }
//   };

//   // cancel a booking (confirmation)
//   const handleCancelBooking = async (bookingId) => {
//     const confirmed = await MySwal.fire({
//       title: "Cancel booking?",
//       text: "This will mark the booking as cancelled and (if your backend restores tickets) return seats to available tickets.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, cancel",
//     });
//     if (!confirmed.isConfirmed) return;

//     try {
//       const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" }); // adjust path if needed
//       const data = await res.json();
//       if (data?.success) {
//         MySwal.fire({ title: "Cancelled", text: "Booking cancelled successfully.", icon: "success" });
//         // refresh bookings & events counts
//         if (selectedEvent) fetchBookings(selectedEvent.id, bookingsPage);
//         fetchEvents();
//       } else {
//         MySwal.fire({ title: "Error", text: (data?.message || "Could not cancel booking"), icon: "error" });
//       }
//     } catch (err) {
//       console.error(err);
//       MySwal.fire({ title: "Error", text: "Network error while cancelling booking", icon: "error" });
//     }
//   };

//   // helper: render bookings rows
//   const renderBookingsRows = () => {
//     if (loadingBookings) return <tr><td colSpan="6" className="p-4">Loading bookings...</td></tr>;
//     if (!bookings?.length) return <tr><td colSpan="6" className="p-4">No bookings yet for this event.</td></tr>;

//     return bookings.map((b) => (
//       <tr key={b.id} className="border-t">
//         <td className="p-2">{b.attendee_name ?? b.attendeeId ?? "—"}</td>
//         <td className="p-2">{b.ticket_count ?? b.ticketCount ?? b.ticketCount}</td>
//         <td className="p-2">{Number(b.total_amount ?? b.totalAmount ?? 0).toFixed(2)}</td>
//         <td className="p-2">{(new Date(b.created_at ?? b.createdAt)).toLocaleString()}</td>
//         <td className="p-2">{b.status || "pending"}</td>
//         <td className="p-2">
//           {b.status !== "cancelled" && (
//             <button
//               onClick={() => handleCancelBooking(b.id)}
//               className="px-2 py-1 bg-red-500 text-white rounded text-sm"
//             >
//               Cancel
//             </button>
//           )}
//         </td>
//       </tr>
//     ));
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Organizer — Events & Bookings</h2>

//       {/* Summary Cards */}
//       <div className="flex gap-4 mb-6">
//         <div className="bg-sky-100 p-4 rounded shadow flex-1 text-center">
//           <h4 className="text-sm">Total Events</h4>
//           <div className="text-2xl font-bold">{totalEvents}</div>
//         </div>
//         <div className="bg-green-100 p-4 rounded shadow flex-1 text-center">
//           <h4 className="text-sm">Total Seats Sold</h4>
//           <div className="text-2xl font-bold">{totalSoldSeats}</div>
//         </div>
//         <div className="bg-yellow-100 p-4 rounded shadow flex-1 text-center">
//           <h4 className="text-sm">Total Revenue</h4>
//           <div className="text-2xl font-bold">{totalRevenue.toFixed(2)}</div>
//         </div>
//       </div>

//       {/* Events list */}
//       <div className="bg-white rounded p-4 shadow">
//         {loadingEvents ? (
//           <div>Loading events...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr>
//                   <th className="p-2">Title</th>
//                   <th className="p-2">Date</th>
//                   <th className="p-2">Category</th>
//                   <th className="p-2">Price</th>
//                   <th className="p-2">Total</th>
//                   <th className="p-2">Sold</th>
//                   <th className="p-2">Remaining</th>
//                   <th className="p-2">Status</th>
//                   <th className="p-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {events.map((ev) => (
//                   <tr key={ev.id ?? ev._id} className="border-t">
//                     <td className="p-2">{ev.title}</td>
//                     <td className="p-2">{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : (ev.eventDate ? new Date(ev.eventDate).toLocaleDateString() : "-")}</td>
//                     <td className="p-2">{ev.category}</td>
//                     <td className="p-2">{ev.price ?? "-"}</td>
//                     <td className="p-2">{ev.total_tickets ?? ev.totalTickets ?? "-"}</td>
//                     <td className="p-2">{ev.sold_seats ?? ev.soldSeats ?? 0}</td>
//                     <td className="p-2">{ev.remaining_tickets ?? ev.remainingTickets ?? 0}</td>
//                     <td className="p-2">{ev.status}</td>
//                     <td className="p-2">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => openBookingsModal(ev)}
//                           className="px-2 py-1 bg-sky-500 text-white rounded text-sm"
//                         >
//                           View Bookings
//                         </button>
//                         <button
//                           onClick={() => nav(`/dashboard/post-event/edit/${ev.id ?? ev._id}`)}
//                           className="px-2 py-1 bg-gray-200 text-black rounded text-sm"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {events.length === 0 && (
//                   <tr><td colSpan="9" className="p-4 text-center">No events found. Create events from Post Event page.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Bookings Modal */}
//       {showBookingsModal && selectedEvent && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
//           <div className="absolute inset-0 bg-black/40" onClick={() => setShowBookingsModal(false)}></div>
//           <div className="relative bg-white rounded shadow-lg w-full max-w-4xl p-6 z-10">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">{selectedEvent.title} — Bookings</h3>
//               <button className="text-gray-500" onClick={() => setShowBookingsModal(false)}>Close</button>
//             </div>

//             <div className="mb-4">
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="bg-sky-50 p-3 rounded">
//                   <div className="text-xs">Total Tickets</div>
//                   <div className="font-bold">{selectedEvent.total_tickets ?? selectedEvent.totalTickets}</div>
//                 </div>
//                 <div className="bg-green-50 p-3 rounded">
//                   <div className="text-xs">Sold</div>
//                   <div className="font-bold">{selectedEvent.sold_seats ?? selectedEvent.soldSeats ?? 0}</div>
//                 </div>
//                 <div className="bg-yellow-50 p-3 rounded">
//                   <div className="text-xs">Remaining</div>
//                   <div className="font-bold">{selectedEvent.remaining_tickets ?? selectedEvent.remainingTickets ?? 0}</div>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded">
//                   <div className="text-xs">Price</div>
//                   <div className="font-bold">{Number(selectedEvent.price ?? 0).toFixed(2)}</div>
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr>
//                     <th className="p-2">Attendee</th>
//                     <th className="p-2">Tickets</th>
//                     <th className="p-2">Amount</th>
//                     <th className="p-2">Booked At</th>
//                     <th className="p-2">Status</th>
//                     <th className="p-2">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>{renderBookingsRows()}</tbody>
//               </table>
//             </div>

//             {/* bookings pagination */}
//             <div className="mt-4 flex items-center justify-between">
//               <div>
//                 <button
//                   onClick={() => fetchBookings(selectedEvent.id, Math.max(1, bookingsPage - 1))}
//                   disabled={bookingsPage <= 1}
//                   className="px-3 py-1 bg-gray-200 rounded mr-2"
//                 >
//                   Prev
//                 </button>
//                 <button
//                   onClick={() => fetchBookings(selectedEvent.id, bookingsPage + 1)}
//                   disabled={bookingsPage * BOOKINGS_LIMIT >= bookingsTotal}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                 >
//                   Next
//                 </button>
//               </div>

//               <div className="text-sm text-gray-600">
//                 Page {bookingsPage} — Showing {bookings.length} of {bookingsTotal} bookings
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
