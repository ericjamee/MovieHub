import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Card,
  InputGroup,
  FormControl,
  Collapse,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Movie } from "../types/movie";
import { movieService } from "../services/movieService";
import Pagination from "../components/Pagination";

const AdminMovies: React.FC = () => {
  const blankMovie = {
    showId: "",
    type: "",
    title: "",
    director: "",
    cast: "",
    country: "",
    releaseYear: new Date().getFullYear(),
    rating: "",
    duration: "0",
    description: "",
    Action: 0,
    Adventure: 0,
    AnimeSeriesInternationalTVShows: 0,
    BritishTVShowsDocuseriesInternationalTVShows: 0,
    Children: 0,
    Comedies: 0,
    ComediesDramasInternationalMovies: 0,
    ComediesInternationalMovies: 0,
    ComediesRomanticMovies: 0,
    CrimeTVShowsDocuseries: 0,
    Documentaries: 0,
    DocumentariesInternationalMovies: 0,
    Docuseries: 0,
    Dramas: 0,
    DramasInternationalMovies: 0,
    DramasRomanticMovies: 0,
    FamilyMovies: 0,
    Fantasy: 0,
    HorrorMovies: 0,
    InternationalMoviesThrillers: 0,
    InternationalTVShowsRomanticTVShowsTVDramas: 0,
    KidsTV: 0,
    LanguageTVShows: 0,
    Musicals: 0,
    NatureTV: 0,
    RealityTV: 0,
    Spirituality: 0,
    TVAction: 0,
    TVComedies: 0,
    TVDramas: 0,
    TalkShowsTVComedies: 0,
    Thrillers: 0,
  };
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Movie>(blankMovie);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [fallbackPosters] = useState([
    "https://wallpapercave.com/wp/wp5978625.png",
    "https://img.freepik.com/free-photo/movie-background-collage_23-2149876030.jpg",
    "https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg?semt=ais_hybrid&w=740",
    "https://t3.ftcdn.net/jpg/02/09/52/26/360_F_209522668_IWRapuvKgoCF2iIw6UqK54mVNYbAFGfN.jpg"
  ]);

  // Get a random fallback poster
  const getRandomFallbackPoster = () => {
    const randomIndex = Math.floor(Math.random() * fallbackPosters.length);
    return fallbackPosters[randomIndex];
  };

  // Get movie poster path
  const getMoviePosterPath = (title: string) => {
    return `/Movie Posters/Movie Posters/${encodeURIComponent(title)}.jpg`;
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovies(pageSize, currentPage);
      setMovies(response.movies);
      setTotalPages(Math.ceil(response.totalNumMovies / pageSize));
    } catch (err) {
      console.error("Error loading movies:", err);
      setError(
        "Failed to load movies. Please try again later or contact support if the issue persists."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AdminMovies component mounted");
    loadMovies();
  }, [currentPage, pageSize]);

  const handleShowModal = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData(movie);
    } else {
      setEditingMovie(null);
      setFormData(blankMovie);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMovie(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await movieService.updateMovie(editingMovie.showId, formData);
      } else {
        await movieService.createMovie(formData as Movie);
      }
      handleCloseModal();
      loadMovies();
    } catch (err) {
      setError("Failed to save movie: " + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await movieService.deleteMovie(id);
        loadMovies();
      } catch (err) {
        setError("Failed to delete movie: " + err);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "releaseYear" ? Number(value) : value,
    }));
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <Container fluid className="py-4 px-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Movie Management</h4>
            <Button
              variant="light"
              className="d-flex align-items-center"
              onClick={() => handleShowModal()}
            >
              <FaPlus className="me-2" /> Add New Movie
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={6} lg={4}>
              <Form onSubmit={(e) => e.preventDefault()}>
                <InputGroup>
                  <FormControl
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="primary" onClick={loadMovies}>
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : movies.length === 0 ? (
            <Alert variant="info">No movies found.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover striped bordered className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: "80px" }}>Show ID</th>
                    <th style={{ width: "80px" }}>Type</th>
                    <th style={{ width: "180px" }}>Title <small className="text-muted">(click row to expand)</small></th>
                    <th style={{ width: "120px" }}>Director</th>
                    <th style={{ width: "150px" }}>Cast</th>
                    <th style={{ width: "120px" }}>Country</th>
                    <th style={{ width: "80px" }}>Release Year</th>
                    <th style={{ width: "80px" }}>Rating</th>
                    <th style={{ width: "80px" }}>Duration</th>
                    <th style={{ width: "200px" }}>Description</th>
                    <th style={{ width: "150px" }}>Genre</th>
                    <th style={{ width: "180px" }} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <React.Fragment key={movie.showId}>
                      <tr 
                        onClick={() => toggleRowExpansion(movie.showId)}
                        className={expandedRows.has(movie.showId) ? "bg-light border-primary" : ""}
                        style={{ 
                          cursor: "pointer",
                          transition: "all 0.2s",
                          borderLeft: expandedRows.has(movie.showId) ? "4px solid #0d6efd" : ""
                        }}
                      >
                        <td>{movie.showId}</td>
                        <td>{movie.type}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {expandedRows.has(movie.showId) ? 
                              <FaChevronDown className="me-2 text-primary" /> : 
                              <FaChevronRight className="me-2 text-secondary" />
                            }
                            {movie.title}
                          </div>
                        </td>
                        <td className="text-truncate" style={{ maxWidth: "150px" }}>{movie.director}</td>
                        <td className="text-truncate" style={{ maxWidth: "150px" }}>{movie.cast}</td>
                        <td>{movie.country}</td>
                        <td>{movie.releaseYear}</td>
                        <td>{movie.rating}</td>
                        <td>{movie.duration}</td>
                        <td className="text-truncate" style={{ maxWidth: "200px" }}>{movie.description}</td>
                        <td className="text-truncate" style={{ maxWidth: "150px" }}>
                          {Object.entries(movie)
                            .filter(([key, value]) => value === 1 && 
                              !['showId', 'type', 'title', 'director', 'cast', 'country', 'releaseYear', 'rating', 'duration', 'description'].includes(key))
                            .map(([key]) => key)
                            .join(', ')}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{ width: "80px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(movie);
                              }}
                            >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{ width: "80px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(movie.showId);
                              }}
                            >
                              <FaTrash className="me-1" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={12} className="p-0">
                          <Collapse in={expandedRows.has(movie.showId)}>
                            <div>
                              <div className="bg-light p-3 border-top">
                                <Row>
                                  <Col md={3} className="mb-3">
                                    <div className="text-center">
                                      <img 
                                        src={getMoviePosterPath(movie.title || '')}
                                        alt={movie.title}
                                        className="img-fluid rounded shadow"
                                        style={{ maxHeight: '250px', objectFit: 'cover' }}
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.onerror = null;
                                          target.src = getRandomFallbackPoster();
                                        }}
                                      />
                                    </div>
                                  </Col>
                                  <Col md={4} className="mb-3">
                                    <h5 className="mb-3 text-primary">Movie Details</h5>
                                    <p><strong>Title:</strong> {movie.title}</p>
                                    <p><strong>Director:</strong> {movie.director || 'N/A'}</p>
                                    <p><strong>Release Year:</strong> {movie.releaseYear}</p>
                                    <p><strong>Rating:</strong> {movie.rating || 'N/A'}</p>
                                    <p><strong>Duration:</strong> {movie.duration || 'N/A'}</p>
                                    <p><strong>Country:</strong> {movie.country || 'N/A'}</p>
                                    <p><strong>Type:</strong> {movie.type}</p>
                                  </Col>
                                  <Col md={5}>
                                    <h5 className="mb-3 text-primary">Additional Information</h5>
                                    <p><strong>Cast:</strong> {movie.cast || 'N/A'}</p>
                                    <div className="mb-3">
                                      <strong>Description:</strong>
                                      <p className="mt-2">{movie.description || 'No description available.'}</p>
                                    </div>
                                    <div>
                                      <strong>Genres:</strong>
                                      <div className="mt-2">
                                        {Object.entries(movie)
                                          .filter(([key, value]) => value === 1 && 
                                            !['showId', 'type', 'title', 'director', 'cast', 'country', 'releaseYear', 'rating', 'duration', 'description'].includes(key))
                                          .map(([key], index) => (
                                            <span key={index} className="badge bg-primary me-1 mb-1 p-2">
                                              {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                          ))}
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMovie
              ? `Edit Movie: ${editingMovie.title}`
              : "Add New Movie"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={formData.director || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cast</Form.Label>
              <Form.Control
                type="text"
                name="cast"
                value={formData.cast || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Release Year</Form.Label>
              <Form.Control
                type="number"
                name="releaseYear"
                value={formData.releaseYear || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                name="rating"
                value={formData.rating || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={formData.duration || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingMovie ? "Update Movie" : "Add Movie"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </Container>
  );
};

export default AdminMovies;
