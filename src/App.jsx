// src/App.jsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ReviewsPage from "./pages/Reviews";
import Categories from "./pages/Categories";
import CategoryEvents from "./pages/CategoryEvents";
import EventDetails from "./pages/EventDetails";
import NotFound from "./pages/NotFound";
import PaymentPage from "./pages/PaymentPage";

// Layout and dashboard pages (make sure filenames/exports match)
import MainLayout from "./layouts/mainLayout";
import Dashboard from "./pages/dashBoardPages/dashboard";
import PostEvent from "./pages/dashBoardPages/postEvent";
import Bookings from "./pages/dashBoardPages/bookings";
import DashboardEventReviews from "./pages/dashBoardPages/dashboardReviews"; // dashboard reviews (rename to avoid clash)
import Logout from "./pages/dashBoardPages/logout";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
     
      <BrowserRouter>
        <Routes>
          {/* Public / top-level routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/events/:category" element={<CategoryEvents />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/payment" element={<PaymentPage />} />



          {/* Admin / Dashboard area wrapped by MainLayout */}
          
          <Route element={<MainLayout />}>
            {/* child paths here render into <Outlet /> inside MainLayout */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="post-event" element={<PostEvent />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="dashboard-reviews" element={<DashboardEventReviews />} />
            <Route path="logout" element={<Logout />} />
            

            {/* <Route path="/pending" element={<EventList status="pending" />} /> */}
            {/* <Route path="/approved" element={<EventList status="approved" />} /> */}
            {/* If you want / (root) to redirect to dashboard when logged in, add:
                <Route index element={<Navigate to="/dashboard" replace />} />
            */}
          </Route>
          

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
