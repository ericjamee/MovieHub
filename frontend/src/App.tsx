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
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
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
          <Route
            path="/admin/movies"
            element={
              <AuthorizeView>
                <AdminMovies />
              </AuthorizeView>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <CookieConsentBanner />
    </Router>
  );
}

export default App;

