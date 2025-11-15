// src/pages/Profile.jsx
import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer"; // adjust path if your Navbar lives elsewhere

const MySwal = withReactContent(Swal);

// Validation for editable profile (password not edited here)
const ProfileSchema = Yup.object({
  name: Yup.string()
    .min(3, "Too short")
    .max(50, "Too long")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

// Validation for password reset modal
const PasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("New password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm the new password"),
});

// Small Footer (replace with your app footer if you have one)

export default function ProfilePage() {
  const [user, setUser] = useState(null); // full user object
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const inputFileRef = useRef(null);

  // Helper: get stored user from localStorage or fallback API
  const loadUserFromStorageOrApi = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure role exists and default to 'attendee'
        if (!parsed.role) parsed.role = "attendee";
        setUser(parsed);
        if (parsed.avatar) setAvatarPreview(parsed.avatar);
        setLoading(false);
        return;
      }

      // fallback: try API (adjust endpoint to your backend)
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        const u = data.user ?? data;
        if (!u.role) u.role = "attendee";
        setUser(u);
        if (u.avatar) setAvatarPreview(u.avatar);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to load user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromStorageOrApi();
  }, []);

  // Utility: initials for avatar fallback
  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "U";
    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Avatar file selected
  const handleAvatarSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  // Remove selected avatar
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  // Save profile (name, email, optional avatar upload)
  const saveProfile = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      // Prepare formData if sending avatar to backend
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      // role should remain as-is (read-only)
      if (avatarFile) formData.append("avatar", avatarFile);

      // Replace with your actual endpoint & method (PUT/PATCH)
      const res = await fetch("/api/user", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Update local user state and localStorage
        const updatedUser = data.user ?? {
          ...user,
          ...values,
          avatar: avatarPreview,
        };
        if (!updatedUser.role) updatedUser.role = "attendee";
        setUser(updatedUser);
        try {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (e) {
          /* ignore localStorage set error */
        }

        MySwal.fire({
          title: "Saved",
          text: "Profile updated successfully",
          icon: "success",
        });
        setEditing(false);
      } else {
        MySwal.fire({
          title: "Error",
          text: data?.message || "Failed to save profile",
          icon: "error",
        });
      }
    } catch (err) {
      console.error(err);
      MySwal.fire({
        title: "Error",
        text: "Network error while saving profile",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Password reset flow
  const handlePasswordReset = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      // Call backend password reset endpoint (adjust path)
      const res = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? user?._id ?? user?.email,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        MySwal.fire({
          title: "Password Reset",
          text: "Password has been updated.",
          icon: "success",
        });
        setShowPasswordModal(false);
        resetForm();
      } else {
        MySwal.fire({
          title: "Error",
          text: data?.message || "Could not reset password",
          icon: "error",
        });
      }
    } catch (err) {
      console.error(err);
      MySwal.fire({
        title: "Error",
        text: "Network error resetting password",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="p-6">Loading profile…</div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="p-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-semibold">No user found</h2>
            <p className="text-sm text-gray-600 mt-2">
              Please login to view your profile.
            </p>
          </div>
        </div>
      </>
    );
  }

  // form initial values
  const initialValues = {
    name: user.name ?? user.displayName ?? user.firstName ?? "",
    email: user.email ?? "",
  };

  return (
    <>
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded shadow">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* avatar */}
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-28 h-28 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                    {getInitials(initialValues.name || user.email)}
                  </div>
                )}

                <div className="absolute right-0 bottom-0 flex gap-2">
                  <label className="bg-white border px-2 py-1 rounded shadow cursor-pointer text-xs hover:bg-gray-100">
                    Change
                    <input
                      ref={inputFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                  </label>
                  {avatarPreview && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="bg-white border px-2 py-1 rounded shadow text-xs hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {user.name ?? user.displayName}
                    </h2>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="mt-2">
                      <span className="inline-block text-xs px-3 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                        Role: {user.role ?? "attendee"}
                      </span>
                    </div>
                  </div>

                  <div>
                    {!editing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(true)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
                        >
                          Edit
                        </button>
                        <Link to={`/reset-password`}>
                          <button className="px-4 py-2 bg-gray-100 rounded">
                            Reset Password
                          </button>
                        </Link>

                       
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(false)}
                          className="px-4 py-2 bg-gray-100 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={ProfileSchema}
                    onSubmit={saveProfile}
                    enableReinitialize
                  >
                    {({ isSubmitting }) => (
                      <Form className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <Field
                            name="name"
                            disabled={!editing}
                            className={`mt-1 block w-full border rounded px-3 py-2 ${
                              editing ? "" : "bg-gray-50 cursor-not-allowed"
                            }`}
                            placeholder="Full name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-xs text-red-600 mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <Field
                            name="email"
                            disabled={!editing}
                            className={`mt-1 block w-full border rounded px-3 py-2 ${
                              editing ? "" : "bg-gray-50 cursor-not-allowed"
                            }`}
                            placeholder="Email address"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-xs text-red-600 mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <div className="mt-1 block w-full border rounded px-3 py-2 bg-gray-50">
                            {user.role ?? "attendee"}
                          </div>
                        </div>

                        {/* password field should not be editable; we show masked with reset button above */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <div className="mt-1 block w-full border rounded px-3 py-2 bg-gray-50">
                            ••••••••
                          </div>
                        </div>

                        {editing && (
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
                            >
                              {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditing(false);
                                loadUserFromStorageOrApi();
                              }}
                              className="px-4 py-2 bg-gray-100 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>

          {/* You could add other cards here: recent bookings, preferences, etc. */}
        </div>
      </main>

      {/* Password reset modal */}
    </>
  );
}
