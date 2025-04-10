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
import AuthorizeView from "./components/AuthorizeView";
import CookieConsentBanner from "./components/CookieConsentBanner";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (no layout, no auth) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main layout routes (wrapped in AuthorizeView for full context) */}
        <Route
          element={
            <AuthorizeView>
              <MainLayout />
            </AuthorizeView>
          }
        >
          {/* Public layout pages */}
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Protected pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Persistent footer/banner stuff */}
      <CookieConsentBanner />
    </Router>
  );
}

export default App;
