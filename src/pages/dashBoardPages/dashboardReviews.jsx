// src/pages/dashBoardPages/OrganizerEventReviews.jsx
import React, { useState } from "react";

// Dummy events data (6 events with multiple reviews)
const dummyEvents = [
  {
    eventId: 1,
    title: "Rock Concert",
    eventDate: "2025-12-01T18:00:00Z",
    reviews: Array.from({ length: 23 }, (_, i) => ({
      userId: 100 + i,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Amazing performance! Comment #${i + 1}`,
      createdAt: new Date(2025, 10, i + 1, 10, 0, 0).toISOString(),
    })),
  },
  {
    eventId: 2,
    title: "Tech Conference",
    eventDate: "2025-12-05T09:00:00Z",
    reviews: Array.from({ length: 12 }, (_, i) => ({
      userId: 200 + i,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Very informative session. Comment #${i + 1}`,
      createdAt: new Date(2025, 10, i + 1, 9, 30, 0).toISOString(),
    })),
  },
  {
    eventId: 3,
    title: "Cooking Workshop",
    eventDate: "2025-12-10T15:00:00Z",
    reviews: Array.from({ length: 8 }, (_, i) => ({
      userId: 300 + i,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Learned a lot! Comment #${i + 1}`,
      createdAt: new Date(2025, 10, i + 1, 14, 0, 0).toISOString(),
    })),
  },
  {
    eventId: 4,
    title: "Art Exhibition",
    eventDate: "2025-12-15T12:00:00Z",
    reviews: Array.from({ length: 15 }, (_, i) => ({
      userId: 400 + i,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Beautiful artworks! Comment #${i + 1}`,
      createdAt: new Date(2025, 10, i + 1, 11, 30, 0).toISOString(),
    })),
  },
  {
    eventId: 5,
    title: "Yoga Retreat",
    eventDate: "2025-12-20T08:00:00Z",
    reviews: Array.from({ length: 10 }, (_, i) => ({
      userId: 500 + i,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Relaxing experience! Comment #${i + 1}`,
      createdAt: new Date(2025, 10, i + 1, 8, 15, 0).toISOString(),
    })),
  },
  {
    eventId: 6,
    title: "Startup Meetup",
    eventDate: "2025-12-25T18:00:00Z",
    reviews: Array.from({ length: 18 }, (_, i) => ({
      userId: 600 + i,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `Great networking! Comment #${i + 1}`,
      createdAt: new Date(2025, 10, i + 1, 17, 45, 0).toISOString(),
    })),
  },
];

const REVIEWS_PER_PAGE = 5;

export default function DashboardEventReviews() {
  const [openEventId, setOpenEventId] = useState(null);
  const [reviewPages, setReviewPages] = useState({});

  const toggleAccordion = (eventId) => {
    setOpenEventId(openEventId === eventId ? null : eventId);
  };

  const renderStars = (rating) => (
    <span className="text-yellow-400 text-lg">
      {"★".repeat(rating) + "☆".repeat(5 - rating)}
    </span>
  );

  const handlePageChange = (eventId, newPage) => {
    setReviewPages((prev) => ({ ...prev, [eventId]: newPage }));
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">
        Organizer Event Reviews
      </h1>

      {dummyEvents.map((event) => {
        const currentPage = reviewPages[event.eventId] || 1;
        const startIdx = (currentPage - 1) * REVIEWS_PER_PAGE;
        const endIdx = startIdx + REVIEWS_PER_PAGE;
        const paginatedReviews = event.reviews.slice(startIdx, endIdx);
        const totalPages = Math.ceil(event.reviews.length / REVIEWS_PER_PAGE);

        return (
          <div
            key={event.eventId}
            className="relative bg-white border-l-4 border-indigo-500 rounded shadow-md"
          >
            {/* Total Reviews Badge */}
            <span className="absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {event.reviews.length} Review{event.reviews.length !== 1 ? "s" : ""}
            </span>

            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(event.eventId)}
              className="w-full flex justify-between items-center px-4 py-3 focus:outline-none hover:bg-indigo-50 transition relative"
            >
              <div>
                <h2 className="text-2xl font-semibold text-indigo-700">{event.title}</h2>
                <p className="text-sm text-gray-500">{new Date(event.eventDate).toLocaleDateString()}</p>
              </div>
              <div className="transform transition-transform duration-300 text-indigo-500 text-3xl">
                {openEventId === event.eventId ? "⮟" : "⮞"}
              </div>
            </button>

            {/* Reviews List */}
            {openEventId === event.eventId && (
              <div className="px-4 py-4 border-t space-y-3">
                {paginatedReviews.length === 0 ? (
                  <div className="text-gray-500 text-center">No reviews yet for this event.</div>
                ) : (
                  paginatedReviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-indigo-50 border rounded shadow-sm hover:bg-indigo-100 transition"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-indigo-700">User {review.userId}</span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 mb-1">{review.comment}</p>
                      <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                      onClick={() =>
                        handlePageChange(event.eventId, Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage <= 1}
                      className="px-3 py-1 bg-indigo-500 text-white rounded disabled:bg-gray-300"
                    >
                      Prev
                    </button>
                    <span className="text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(event.eventId, Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage >= totalPages}
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
  );
}
