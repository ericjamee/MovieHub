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
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
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
    "https://t3.ftcdn.net/jpg/02/09/52/26/360_F_209522668_IWRapuvKgoCF2iIw6UqK54mVNYbAFGfN.jpg",
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
      const response = await movieService.getAdminMovies(pageSize, currentPage);
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
      setLoading(true); // Show loading state
      setError(""); // Clear any previous errors

      if (editingMovie) {
        const updatedMovie = await movieService.updateMovie(
          editingMovie.showId,
          formData
        );
        // Update the movie in the current list to avoid a full reload
        setMovies((prevMovies) =>
          prevMovies.map((m) =>
            m.showId === updatedMovie.showId ? updatedMovie : m
          )
        );
      } else {
        const newMovie = await movieService.createMovie(formData as Movie);
        // Add the new movie to the current list
        setMovies((prevMovies) => [...prevMovies, newMovie]);
      }
      handleCloseModal();
      // Reload the movies to ensure we have the latest data
      loadMovies();
    } catch (err) {
      console.error("Error saving movie:", err);
      setError("Failed to save movie. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await movieService.deleteMovie(id);
        // Remove the movie from the current list
        setMovies((prevMovies) => prevMovies.filter((m) => m.showId !== id));
        // If we're on the last page and it's now empty, go to previous page
        if (movies.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
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
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "releaseYear" ? Number(value) : value,
      }));
    }
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

  // Search handler for when Enter key is pressed
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadMovies();
    }
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
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadMovies();
                }}
              >
                <InputGroup>
                  <FormControl
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                  />
                  <Button variant="primary" type="submit">
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
                    <th style={{ width: "80px" }}>ID</th>
                    <th style={{ width: "80px" }}>Type</th>
                    <th>Title</th>
                    <th>Release Year</th>
                    <th>Rating</th>
                    <th style={{ width: "120px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <React.Fragment key={movie.showId}>
                      <tr
                        onClick={() => toggleRowExpansion(movie.showId)}
                        className={
                          expandedRows.has(movie.showId)
                            ? "bg-light border-primary"
                            : ""
                        }
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s",
                          borderLeft: expandedRows.has(movie.showId)
                            ? "4px solid #0d6efd"
                            : "",
                        }}
                      >
                        <td>{movie.showId}</td>
                        <td>{movie.type}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {expandedRows.has(movie.showId) ? (
                              <FaChevronDown className="me-2 text-primary" />
                            ) : (
                              <FaChevronRight className="me-2 text-secondary" />
                            )}
                            {movie.title}
                          </div>
                        </td>
                        <td>{movie.releaseYear}</td>
                        <td>{movie.rating}</td>
                        <td>
                          <div className="d-flex justify-content-between gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(movie);
                              }}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(movie.showId);
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="p-0">
                          <Collapse in={expandedRows.has(movie.showId)}>
                            <div>
                              <div className="bg-light p-3 border-top">
                                <Row>
                                  <Col md={3} className="mb-3">
                                    <div className="text-center">
                                      <img
                                        src={getMoviePosterPath(
                                          movie.title || ""
                                        )}
                                        alt={movie.title}
                                        className="img-fluid rounded shadow"
                                        style={{
                                          maxHeight: "250px",
                                          objectFit: "cover",
                                        }}
                                        onError={(e) => {
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.onerror = null;
                                          target.src =
                                            getRandomFallbackPoster();
                                        }}
                                      />
                                    </div>
                                  </Col>
                                  <Col md={4} className="mb-3">
                                    <h5 className="mb-3 text-primary">
                                      Movie Details
                                    </h5>
                                    <p>
                                      <strong>Title:</strong> {movie.title}
                                    </p>
                                    <p>
                                      <strong>Director:</strong>{" "}
                                      {movie.director || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Release Year:</strong>{" "}
                                      {movie.releaseYear}
                                    </p>
                                    <p>
                                      <strong>Rating:</strong>{" "}
                                      {movie.rating || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Duration:</strong>{" "}
                                      {movie.duration || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Country:</strong>{" "}
                                      {movie.country || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Type:</strong> {movie.type}
                                    </p>
                                  </Col>
                                  <Col md={5}>
                                    <h5 className="mb-3 text-primary">
                                      Additional Information
                                    </h5>
                                    <p>
                                      <strong>Cast:</strong>{" "}
                                      {movie.cast || "N/A"}
                                    </p>
                                    <div className="mb-3">
                                      <strong>Description:</strong>
                                      <p className="mt-2">
                                        {movie.description ||
                                          "No description available."}
                                      </p>
                                    </div>
                                    <div>
                                      <strong>Genres:</strong>
                                      <div className="mt-2">
                                        {Object.entries(movie)
                                          .filter(
                                            ([key, value]) =>
                                              value === 1 &&
                                              ![
                                                "showId",
                                                "type",
                                                "title",
                                                "director",
                                                "cast",
                                                "country",
                                                "releaseYear",
                                                "rating",
                                                "duration",
                                                "description",
                                              ].includes(key)
                                          )
                                          .map(([key], index) => (
                                            <span
                                              key={index}
                                              className="badge bg-primary me-1 mb-1 p-2"
                                            >
                                              {key
                                                .replace(/([A-Z])/g, " $1")
                                                .trim()}
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

            <hr className="my-4" />
            <h5 className="mb-3">Genres</h5>
            <Row>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  id="genre-action"
                  label="Action"
                  name="Action"
                  checked={formData.Action === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="genre-adventure"
                  label="Adventure"
                  name="Adventure"
                  checked={formData.Adventure === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="genre-comedies"
                  label="Comedies"
                  name="Comedies"
                  checked={formData.Comedies === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  id="genre-dramas"
                  label="Dramas"
                  name="Dramas"
                  checked={formData.Dramas === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="genre-documentaries"
                  label="Documentaries"
                  name="Documentaries"
                  checked={formData.Documentaries === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="genre-family"
                  label="Family Movies"
                  name="FamilyMovies"
                  checked={formData.FamilyMovies === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  id="genre-horror"
                  label="Horror Movies"
                  name="HorrorMovies"
                  checked={formData.HorrorMovies === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="genre-thrillers"
                  label="Thrillers"
                  name="Thrillers"
                  checked={formData.Thrillers === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="genre-fantasy"
                  label="Fantasy"
                  name="Fantasy"
                  checked={formData.Fantasy === 1}
                  onChange={handleChange}
                  className="mb-2"
                />
              </Col>
            </Row>
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
