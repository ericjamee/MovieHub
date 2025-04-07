import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  Alert,
  Card,
  Badge,
  InputGroup,
  FormControl,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import { Movie } from '../types/movie';
import { movieService } from '../services/movieService';

const AdminMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [formData, setFormData] = useState<Partial<Movie>>({
    title: '',
    description: '',
    imageUrl: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    director: '',
    cast: [],
    duration: 0,
    price: 0,
  });

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovies({
        page: currentPage,
        pageSize,
        searchTerm: searchTerm || undefined,
        genre: genreFilter || undefined,
      });
      setMovies(response.movies);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [currentPage, pageSize, searchTerm, genreFilter]);

  // Sort movies client-side when sort parameters change
  useEffect(() => {
    if (sortField) {
      const sortedMovies = [...movies].sort((a: any, b: any) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      setMovies(sortedMovies);
    }
  }, [sortField, sortDirection]);

  const handleShowModal = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData(movie);
    } else {
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        genre: '',
        releaseYear: new Date().getFullYear(),
        director: '',
        cast: [],
        duration: 0,
        price: 0,
        rating: 0,
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
        await movieService.updateMovie(editingMovie.id, formData);
      } else {
        await movieService.createMovie(formData as Omit<Movie, 'id'>);
      }
      handleCloseModal();
      loadMovies();
    } catch (err) {
      setError('Failed to save movie');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieService.deleteMovie(id);
        loadMovies();
      } catch (err) {
        setError('Failed to delete movie');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'releaseYear' || name === 'duration' || name === 'price' 
        ? Number(value) 
        : value,
    }));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    loadMovies();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setGenreFilter('');
    setCurrentPage(1);
  };

  // Extract unique genres for the filter dropdown
  const uniqueGenres = Array.from(new Set(movies.map(movie => movie.genre)));

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
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
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <Row className="mb-4">
            <Col md={6} lg={4}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <FormControl
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="primary" type="submit">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={6} lg={4} className="my-2 my-md-0">
              <InputGroup>
                <DropdownButton
                  variant="outline-secondary"
                  title={genreFilter || "Filter by Genre"}
                  id="genre-filter-dropdown"
                >
                  <Dropdown.Item onClick={() => setGenreFilter('')}>All Genres</Dropdown.Item>
                  <Dropdown.Divider />
                  {uniqueGenres.map(genre => (
                    <Dropdown.Item 
                      key={genre} 
                      onClick={() => setGenreFilter(genre)}
                      active={genreFilter === genre}
                    >
                      {genre}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                {(searchTerm || genreFilter) && (
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : movies.length === 0 ? (
            <Alert variant="info">
              No movies found. {searchTerm || genreFilter ? 'Try clearing your filters.' : 'Add a new movie to get started.'}
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: '40%' }} onClick={() => handleSort('title')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          Title
                          {sortField === 'title' && (
                            <FaSort className={`ms-1 ${sortDirection === 'asc' ? 'text-primary' : 'text-danger'}`} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('genre')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          Genre
                          {sortField === 'genre' && (
                            <FaSort className={`ms-1 ${sortDirection === 'asc' ? 'text-primary' : 'text-danger'}`} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('releaseYear')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          Year
                          {sortField === 'releaseYear' && (
                            <FaSort className={`ms-1 ${sortDirection === 'asc' ? 'text-primary' : 'text-danger'}`} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('rating')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          Rating
                          {sortField === 'rating' && (
                            <FaSort className={`ms-1 ${sortDirection === 'asc' ? 'text-primary' : 'text-danger'}`} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('price')} className="cursor-pointer">
                        <div className="d-flex align-items-center">
                          Price
                          {sortField === 'price' && (
                            <FaSort className={`ms-1 ${sortDirection === 'asc' ? 'text-primary' : 'text-danger'}`} />
                          )}
                        </div>
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map(movie => (
                      <tr key={movie.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={movie.imageUrl} 
                              alt={movie.title} 
                              className="me-2" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50x50?text=No+Image'}
                            />
                            <div>
                              <h6 className="mb-0">{movie.title}</h6>
                              <small className="text-muted">{movie.director}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary" pill>
                            {movie.genre}
                          </Badge>
                        </td>
                        <td>{movie.releaseYear}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-1">{movie.rating.toFixed(1)}</span>
                            <div className="stars-outer">
                              <div className="stars-inner" style={{ width: `${(movie.rating / 5) * 100}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td>${movie.price.toFixed(2)}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2 d-flex align-items-center"
                              onClick={() => handleShowModal(movie)}
                            >
                              <FaEdit className="me-1" /> Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="d-flex align-items-center"
                              onClick={() => handleDelete(movie.id)}
                            >
                              <FaTrash className="me-1" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <div className="d-md-flex justify-content-between align-items-center mt-4">
                <div className="mb-3 mb-md-0">
                  <span className="text-muted">
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <Form.Select
                    className="me-3"
                    style={{ width: 'auto' }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page when changing page size
                    }}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </Form.Select>
                  
                  <Pagination className="mb-0">
                    <Pagination.First
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    />
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    />
                    
                    {getPageNumbers().map(page => (
                      <Pagination.Item 
                        key={page} 
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    />
                    <Pagination.Last
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    />
                  </Pagination>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                  />
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="mt-2 img-thumbnail" 
                      style={{ height: '100px' }}
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x150?text=No+Image'}
                    />
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Release Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    required
                    min="1900"
                    max={new Date().getFullYear() + 5}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Director</Form.Label>
                  <Form.Control
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cast (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="cast"
                    value={formData.cast?.join(', ')}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        cast: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                      }));
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminMovies; 