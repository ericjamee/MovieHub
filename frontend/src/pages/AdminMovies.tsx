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
  Badge,
  InputGroup,
  FormControl,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSort } from "react-icons/fa";
import { Movie } from "../types/movie";
import { movieService } from "../services/movieService";
import Pagination from "../components/Pagination";

const AdminMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [formData, setFormData] = useState<Partial<Movie>>({
    showId: "",
    type: "",
    title: "",
    director: "",
    cast: "",
    country: "",
    releaseYear: new Date().getFullYear(),
    rating: "",
    duration: 0,
    description: "",
    imageUrl: "",
    genre: "",
  });

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovies({
        pageSize,
        page: currentPage,
        searchTerm: searchTerm || undefined,
        genre: genreFilter || undefined,
      });
      setMovies(response.movies);
      setTotalPages(Math.ceil(response.totalNumMovies / pageSize));
      setTotalCount(response.totalNumMovies);
    } catch (err) {
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [currentPage, pageSize, searchTerm, genreFilter]);

  const handleShowModal = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData(movie);
    } else {
      setEditingMovie(null);
      setFormData({
        showId: "",
        type: "",
        title: "",
        director: "",
        cast: "",
        country: "",
        releaseYear: new Date().getFullYear(),
        rating: "",
        duration: 0,
        description: "",
        imageUrl: "",
        genre: "",
      });
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
      setError("Failed to save movie");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await movieService.deleteMovie(id);
        loadMovies();
      } catch (err) {
        setError("Failed to delete movie");
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
      [name]:
        name === "releaseYear" || name === "duration" ? Number(value) : value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setGenreFilter("");
    setCurrentPage(1);
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
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.showId}>
                    <td>{movie.title}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.releaseYear}</td>
                    <td>{movie.rating}</td>
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
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={formData.genre || ""}
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
