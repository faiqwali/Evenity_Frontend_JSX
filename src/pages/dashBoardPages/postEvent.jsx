// src/pages/dashBoardPages/PostEvent.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const initialValues = {
  title: "",
  description: "",
  address: "",
  eventDate: "",
  price: "",
  totalTickets: "",
  availableTickets: "",
  category: "",
  images: [],
};

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Event title is required"),
  description: Yup.string().trim().required("Description is required"),
  address: Yup.string().trim().required("Address is required"),
  eventDate: Yup.date()
    .required("Event date is required")
    .transform((value, originalValue) => (originalValue ? new Date(originalValue) : null))
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Event date can't be in the past"),
  price: Yup.number().typeError("Price must be a number").min(0, "Price must be >= 0").required("Price is required"),
  totalTickets: Yup.number()
    .typeError("Total tickets must be a number")
    .integer("Must be an integer")
    .min(0, "Must be >= 0")
    .required("Total tickets required"),
  availableTickets: Yup.number()
    .typeError("Available tickets must be a number")
    .integer("Must be an integer")
    .min(0, "Must be >= 0")
    .required("Available tickets required")
    .test("available<=total", "Available tickets cannot exceed total tickets", function (value) {
      const { totalTickets } = this.parent;
      if (totalTickets === "" || value === "") return true;
      return Number(value) <= Number(totalTickets);
    }),
  category: Yup.string().required("Please select a category"),
  images: Yup.array()
    .min(1, "Please upload at least one image")
    .required("Please upload at least one image"),
});

export default function PostEvent() {
  const nav = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  // Fetch pending & approved counts
  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/events/counts"); // your backend should return {pending: x, approved: y}
      const data = await res.json();
      setPendingCount(data.pending);
      setApprovedCount(data.approved);
    } catch (err) {
      console.error("Failed to fetch counts", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const payload = { ...values, status: "pending" };
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === "images") {
          payload.images.forEach((file) => formData.append("images", file));
        } else if (key === "eventDate") {
          formData.append(key, new Date(payload.eventDate).toISOString());
        } else {
          formData.append(key, payload[key]);
        }
      });

      const res = await fetch("/api/events", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to create event");

      await MySwal.fire({
        title: "Success!",
        text: "Your event has been posted and is pending approval.",
        icon: "success",
        confirmButtonText: "OK",
      });

      resetForm();
      setPreviewImages([]);
      fetchCounts(); // refresh counts
    } catch (err) {
      await MySwal.fire({
        title: "Error",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    setFieldValue("images", files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Post an Event</h2>

      {/* Pending & Approved Cards */}
      <div className="flex gap-4 mb-6">
        <div
          onClick={() => nav("/events/pending")}
          className="cursor-pointer bg-yellow-200 p-4 rounded shadow text-center flex-1"
        >
          <h3 className="text-lg font-bold">Pending Events</h3>
          <p className="text-2xl">{pendingCount}</p>
        </div>
        <div
          onClick={() => nav("/events/approved")}
          className="cursor-pointer bg-green-200 p-4 rounded shadow text-center flex-1"
        >
          <h3 className="text-lg font-bold">Approved Events</h3>
          <p className="text-2xl">{approvedCount}</p>
        </div>
      </div>

      {/* Post Event Form */}
      <div className="bg-white rounded shadow-sm p-6">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Event title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Title *</label>
                  <Field name="title" placeholder="Enter event title" className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="title" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address *</label>
                  <Field name="address" placeholder="Venue address" className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="address" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Date *</label>
                  <Field name="eventDate" type="date" className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="eventDate" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <Field name="price" type="number" step="0.01" min="0" placeholder="0.00" className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="price" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Total Tickets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Tickets *</label>
                  <Field name="totalTickets" type="number" min="0" placeholder="100" className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="totalTickets" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Available Tickets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Available Tickets *</label>
                  <Field name="availableTickets" type="number" min="0" placeholder="100" className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="availableTickets" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <Field as="select" name="category" className="mt-1 block w-full border rounded px-3 py-2">
                    <option value="">Select category</option>
                    <option value="concert">Concert</option>
                    <option value="conference">Conference</option>
                    <option value="sports">Sports</option>
                    <option value="workshop">Workshop</option>
                    <option value="party">Party</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Description */}
                <div className="lg:col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <Field name="description" as="textarea" rows="5" placeholder="Event description" className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="description" component="div" className="text-xs text-red-600 mt-1" />
                </div>

                {/* Images */}
                <div className="lg:col-span-3 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Event Images *</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, setFieldValue)} className="mt-1 block w-full border rounded px-3 py-2" />
                  <ErrorMessage name="images" component="div" className="text-xs text-red-600 mt-1" />
                  {previewImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {previewImages.map((src, idx) => (
                        <img key={idx} src={src} alt={`Preview ${idx}`} className="w-24 h-24 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-sky-600 text-white rounded">{isSubmitting ? "Saving..." : "Post Event"}</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
