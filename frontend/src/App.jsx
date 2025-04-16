import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import RecoverEmail from "./pages/Auth/RecoverEmail";
import BusinessDetails from "./pages/Onboarding/BusinessDetails";
import Confirmation from "./pages/Onboarding/Confirmation";
import Home from "./pages/Main/Home";
import Settings from "./pages/Main/SettingsPage";
import Dashboard from "./pages/Main/Dashboard";
import Analytics from "./pages/Main/Analytics";
import Listener from "./pages/Main/Listener";
import Scheduler from "./pages/Main/Scheduler";
import EmailVerification from "./pages/Auth/verifyEmail";
import { auth } from "./firebase/firebase";

const ProtectedRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.FB) {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: false,
          version: "v19.0",
        });
        clearInterval(interval);
      }
    }, 100);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/onboarding/business-details"element={
            <ProtectedRoute>
              <BusinessDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="/listener" element={
            <ProtectedRoute>
              <Listener />
            </ProtectedRoute>
          }
        />
        <Route path="/scheduler" element={
            <ProtectedRoute>
              <Scheduler />
            </ProtectedRoute>
          }
        />
        <Route path="/onboarding/confirmation" element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />
        <Route path="/recover-email" element={<RecoverEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
