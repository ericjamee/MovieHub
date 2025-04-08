interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const maxVisiblePages = 5; // Number of visible pages
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show the first page
      pages.push(1);

      if (currentPage > 3) {
        // Add ellipsis if current page is far from the start
        pages.push("...");
      }

      // Add pages around the current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        // Add ellipsis if current page is far from the end
        pages.push("...");
      }

      // Always show the last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="d-flex flex-column align-items-center mt-4">
      <div className="btn-group mb-3">
        <button
          className={`btn ${currentPage === 1 ? 'btn-secondary' : 'btn-primary'}`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`btn ${currentPage === page ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => onPageChange(page)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="btn btn-outline-secondary disabled">
              {page}
            </span>
          )
        )}

        <button
          className={`btn ${currentPage === totalPages ? 'btn-secondary' : 'btn-primary'}`}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <div className="d-flex align-items-center">
        <span className="me-2">Results per page:</span>
        <select
          className="form-select form-select-sm"
          style={{ width: '80px' }}
          value={pageSize}
          onChange={(p) => {
            onPageSizeChange(Number(p.target.value));
            onPageChange(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
