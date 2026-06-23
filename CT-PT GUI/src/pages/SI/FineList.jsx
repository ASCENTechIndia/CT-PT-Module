import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import ResponseModal from "../../components/ResponseModal";
import { useAuth } from "../../context/AuthContext";

const FineList = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [approveRemark, setApproveRemark] = useState("");

  // Response Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  // Filters (only date)
  const [dateFilter, setDateFilter] = useState({
    from: getTodayDate(),
    to: getTodayDate(),
  });

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch applications from API
  const fetchApplications = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("ulbid", 4);
      params.append("page", page);
      params.append("limit", pageSize);
      if (dateFilter.from) params.append("fromDate", dateFilter.from);
      if (dateFilter.to) params.append("toDate", dateFilter.to);

      const response = await apiClient.get(
        `/authComplaint/get-fine-application-list?${params.toString()}`
      );

      if (response.success && response.data) {
        setApplications(response.data.data);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
        setTotalRecords(response.data.pagination.total);
      } else {
        setApplications([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching fine list:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("Failed to load fine applications. Please try again later.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, []);

  useEffect(() => {
    fetchApplications(1);
  }, [dateFilter]);

  // Filter handlers
  const handleDateChangeFilter = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setDateFilter({ from: "", to: "" });
  };

  // Page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchApplications(newPage);
    }
  };

  // Pagination pages generator
  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Open review modal
  const handleReviewClick = (application) => {
    setSelectedApplication(application);
    setApproveRemark("");
    setShowModal(true);
  };

  // Placeholder approve/reject (API not ready)
  const handleApprove = () => {
    if (!approveRemark.trim()) {
      setModalType("warning");
      setModalTitle("Warning");
      setModalMessage("Please add a remark before approving.");
      setIsModalOpen(true);
      return;
    }
    setModalType("success");
    setModalTitle("Success");
    setModalMessage("Work approved successfully (dummy).");
    setIsModalOpen(true);
    setShowModal(false);
    setApproveRemark("");
  };

  const handleReject = () => {
    if (!approveRemark.trim()) {
      setModalType("warning");
      setModalTitle("Warning");
      setModalMessage("Please add a remark before rejecting.");
      setIsModalOpen(true);
      return;
    }
    setModalType("success");
    setModalTitle("Success");
    setModalMessage("Work rejected successfully (dummy).");
    setIsModalOpen(true);
    setShowModal(false);
    setApproveRemark("");
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      {loading ? (
        <div className="panel text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading fine list...</p>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header d-flex justify-content-between">
            <div>
              <h2 className="h5 mb-1 section-title">
                <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
                <span>Fine Applications ({applications.length})</span>
              </h2>
              <p className="text-muted mb-0">
                View and manage fines related to work orders.
              </p>
            </div>
            <div>
              <div className="filter-bar">
                <div className="filter-group">
                  <label htmlFor="fromDate">From</label>
                  <input
                    type="date"
                    name="from"
                    className="filter-input"
                    style={{ width: "150px" }}
                    value={dateFilter.from}
                    onChange={handleDateChangeFilter}
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="toDate">To</label>
                  <input
                    type="date"
                    name="to"
                    style={{ width: "150px" }}
                    className="filter-input"
                    value={dateFilter.to}
                    onChange={handleDateChangeFilter}
                  />
                </div>
                <div
                  className="filter-group"
                  style={{ justifyContent: "flex-end" }}
                >
                  <button
                    type="button"
                    className="btn-clear-filters"
                    onClick={handleClearFilters}
                  >
                    <i className="bi bi-x-lg me-1"></i> Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Work ID</th>
                  <th scope="col">Ward ID</th>
                  <th scope="col">Toilet ID</th>
                  <th scope="col">Toilet Location</th>
                  <th scope="col">Supervisor ID</th>
                  <th scope="col">SI ID</th>
                  <th scope="col">Work Date</th>
                  <th scope="col">Total Fine (₹)</th>
                  <th scope="col" className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.WORK_ID}>
                    <td className="fw-semibold">{app.WORK_ID}</td>
                    <td>{app.WARD_ID}</td>
                    <td>{app.TOILET_ID}</td>
                    <td>{app.TOILET_LOCATION}</td>
                    <td>{app.SUPERID}</td>
                    <td>{app.SIID}</td>
                    <td>{formatDate(app.WORK_DATE)}</td>
                    <td>₹{app.TOTAL_FINE?.toLocaleString() || 0}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleReviewClick(app)}
                      >
                        <i className="bi bi-eye me-1"></i> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalRecords > 0 && (
            <div className="d-flex align-items-center justify-content-between mt-4">
              <div className="text-muted small">
                Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(currentPage * pageSize, totalRecords)}</strong>{" "}
                of <strong>{totalRecords}</strong> applications
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                      <i className="bi bi-chevron-double-left"></i>
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  {getPaginationPages().map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                      <i className="bi bi-chevron-double-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {showModal && selectedApplication && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-file-earmark-check me-2"></i>
                  Work Details #{selectedApplication.WORK_ID}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Work ID</label>
                    <p className="h6 mb-0">{selectedApplication.WORK_ID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Ward ID</label>
                    <p className="h6 mb-0">{selectedApplication.WARD_ID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Toilet ID</label>
                    <p className="h6 mb-0">{selectedApplication.TOILET_ID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Toilet Location</label>
                    <p className="h6 mb-0">{selectedApplication.TOILET_LOCATION}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Supervisor ID</label>
                    <p className="h6 mb-0">{selectedApplication.SUPERID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">SI ID</label>
                    <p className="h6 mb-0">{selectedApplication.SIID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Work Date</label>
                    <p className="h6 mb-0">{formatDate(selectedApplication.WORK_DATE)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">Total Fine</label>
                    <p className="h6 mb-0">₹{selectedApplication.TOTAL_FINE?.toLocaleString() || 0}</p>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Approval Remark *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Add your remarks before approving or rejecting..."
                      value={approveRemark}
                      onChange={(e) => setApproveRemark(e.target.value)}
                    ></textarea>
                    <small className="text-muted mt-2 d-block">
                      Remark is required to proceed (dummy action).
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleReject}
                  disabled={!approveRemark.trim()}
                >
                  <i className="bi bi-x-circle me-1"></i> Reject
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApprove}
                  disabled={!approveRemark.trim()}
                >
                  <i className="bi bi-check-circle me-1"></i> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      <ResponseModal
        isOpen={isModalOpen}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
};

export default FineList;