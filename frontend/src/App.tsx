import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import AdminMovies from "./pages/AdminMovies";
import Profile from "./pages/Profile";
import AuthorizeView from "./components/AuthorizeView"; // your working guard
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CookieConsentBanner from "./components/CookieConsentBanner";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <AuthorizeView>
            <Dashboard />
          </AuthorizeView>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthorizeView>
            <Profile />
          </AuthorizeView>
        }
      />
      <Route
        path="/movies"
        element={
          <AuthorizeView>
            <Movies />
          </AuthorizeView>
        }
      />
      <Route
        path="/movies/:id"
        element={
          <AuthorizeView>
            <MovieDetail />
          </AuthorizeView>
        }
      />

      {/* Admin routes (if needed later) */}
      <Route
        path="/admin/movies"
        element={
          <AuthorizeView>
            <AdminMovies />
          </AuthorizeView>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
        <CookieConsentBanner />
      </MainLayout>
    </Router>
  );
}

export default App;
