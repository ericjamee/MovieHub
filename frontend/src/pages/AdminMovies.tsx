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
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
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

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovies(pageSize, currentPage);
      setMovies(response.movies);
      setTotalPages(Math.ceil(response.totalNumMovies / pageSize));
    } catch (err) {
      setError("Failed to load movies: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        console.log("I'm here");
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
            <Table hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Show ID</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Director</th>
                  <th>Cast</th>
                  <th>Country</th>
                  <th>Release Year</th>
                  <th>Rating</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.showId}>
                    <td>{movie.showId}</td>
                    <td>{movie.type}</td>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.cast}</td>
                    <td>{movie.country}</td>
                    <td>{movie.releaseYear}</td>
                    <td>{movie.rating}</td>
                    <td>{movie.duration}</td>
                    <td>{movie.description}</td>
                    <td></td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(movie)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(movie.showId)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cast</Form.Label>
              <Form.Control
                type="text"
                name="cast"
                value={formData.cast || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                required
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
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={formData.duration || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                required
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
    </Container>
  );
};

export default AdminMovies;
