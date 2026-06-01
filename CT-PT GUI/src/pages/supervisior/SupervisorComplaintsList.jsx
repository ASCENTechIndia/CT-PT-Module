import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../services/apiClient";
import ResponseModal from "../../components/ResponseModal";
import { useAuth } from "../../context/AuthContext";

const getToday = () => {
  const d = new Date();
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

const SupervisorComplaintsList = () => {
  const { user } = useAuth();
  const ulbid = user?.orgId;
  console.log(user);
//   console.log("user Id", user);
  const userId = user?.userId;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [supervisorRemark, setSupervisorRemark] = useState("");
  const [supervisorStatus, setSupervisorStatus] = useState("");

  // Response Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [filters, setFilters] = useState({
    fromDate: getToday(),
    toDate: getToday(),
    status: "",
  });

  const handleDateChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      fromDate: "",
      toDate: "",
      status: "",
    };
    setFilters(clearedFilters);
    // Call API with cleared filters
    setTimeout(() => {
      fetchComplaints(1);
    }, 0);
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch complaints on filter change
  useEffect(() => {
    fetchComplaints(1);
  }, [filters, ulbid]);

  // Handle submit complaint status update
  const handleSubmitComplaintStatus = async () => {
    // Validation
    if (!supervisorRemark.trim()) {
      setModalType("warning");
      setModalTitle("Validation Error");
      setModalMessage("Please add a remark before submitting.");
      setIsModalOpen(true);
      return;
    }

    if (!supervisorStatus.trim()) {
      setModalType("warning");
      setModalTitle("Validation Error");
      setModalMessage("Please select a status before submitting.");
      setIsModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId: userId,
        mode: 1,
        complaintId: selectedComplaint.COMPLAINTID,
        superwiserId: selectedComplaint.SUPERWISER_ID,
        superstatus: supervisorStatus,
        superremark: supervisorRemark,
        wardno: selectedComplaint.PRBHAGID,
        ulbid: ulbid,
      };

      console.log("Submitting complaint status:", payload);

      const response = await apiClient.post(
        `/authComplaint/complaintStatusUpdate`,
        payload
      );

      if (response.success) {
        setModalType("success");
        setModalTitle("Success");
        setModalMessage("Complaint status has been updated successfully.");
        setIsModalOpen(true);

        // Close modal and reset form
        setShowModal(false);
        setSupervisorRemark("");
        setSupervisorStatus("");
        
        // Refresh the complaints list
        setTimeout(() => {
          fetchComplaints(currentPage);
        }, 1500);
      } else {
        setModalType("error");
        setModalTitle("Error");
        setModalMessage(
          response.message || "Failed to update complaint status. Please try again."
        );
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error updating complaint status:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage(
        err.message || "Failed to update complaint status. Please try again."
      );
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async (dataPage = 1) => {
    if (!ulbid || !userId) {
      return;
    }
    try {
      setLoading(true);

      const response = await apiClient.get(
        `/authComplaint/rslvdListbyVendor?ulbid=${ulbid}&page=${dataPage}&limit=${pageSize}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&status=${filters.status || "ASSIGN"}&supervisorId=${userId}`,
      );

      console.log("resp :", response);

      if (response.success && response.data.data) {
        setComplaints(response.data.data);
        setCurrentPage(response?.data?.pagination?.page || dataPage);
        setTotalPages(response?.data?.pagination?.totalPages || 1);
        setTotalRecords(response?.data?.pagination?.total || 0);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  // Open modal and display selected complaint details (read-only)
  const handleReviewClick = (complaint) => {
    console.log("popup complaint :", complaint);
    setSelectedComplaint(complaint);
    setShowModal(true);
    setSelectedImageIndex(0);
    setSupervisorRemark("");
    setSupervisorStatus("");
  };

  // Open image in full view
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchComplaints(page);
    }
  };

  // Generate pagination page numbers
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

  // Navigate to next image
  const nextImage = () => {
    if (selectedComplaint) {
      const images = getComplaintImages(selectedComplaint);
      if (selectedImageIndex < images.length - 1) {
        setSelectedImageIndex(selectedImageIndex + 1);
      }
    }
  };

  // Navigate to previous image
  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
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

  // Helper function to extract images from complaint
  const getComplaintImages = (complaint) => {
    return [
      complaint?.BLOB_COMPLAINT_UNITIMG1,
      complaint?.BLOB_COMPLAINT_UNITIMG2,
      complaint?.BLOB_COMPLAINT_UNITIMG3,
      complaint?.BLOB_COMPLAINT_UNITIMG4,
      complaint?.BLOB_COMPLAINT_UNITIMG5,
    ].filter((img) => img && img.trim() !== "");
  };

  // Helper to render image thumbnails with click handler
  const renderThumbnails = (complaint) => {
  const images = getComplaintImages(complaint);

  return (
    <div className="d-flex gap-2 flex-wrap mt-2">
      {images.length > 0 ? (
        images.map((img, idx) => (
          <img
            key={idx}
            src={`data:image/png;base64,${img}`}
            alt={`complaint-${idx}`}
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "2px solid #dee2e6",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={() => handleImageClick(idx)}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "none")
            }
          />
        ))
      ) : (
        <p className="text-muted mb-0">No images available</p>
      )}
    </div>
  );
};

  const getBadge = (flag) => {
    if (flag === "A") {
      return (
        <span className="badge bg-success rounded-pill px-3 py-2">
          <i className="bi bi-check-circle me-1"></i> Approve
        </span>
      );
    } else if (flag === "R") {
      return (
        <span className="badge bg-danger rounded-pill px-3 py-2">
          <i className="bi bi-x-circle me-1"></i> Rejected
        </span>
      );
    } else {
      return (
        <span className="badge bg-warning rounded-pill px-3 py-2 text-dark">
          <i className="bi bi-clock-history me-1"></i> Pending
        </span>
      );
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="panel text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading complaints...</p>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header d-flex justify-content-between">
            <div>
              <h2 className="h5 mb-1 section-title">
                <i className="bi bi-table" aria-hidden="true"></i>
                <span>All Complaints ({complaints?.length})</span>
              </h2>
              <p className="text-muted mb-0">
                View and manage complaints submitted by citizens.
              </p>
            </div>
            <div>
              <div className="filter-bar">
                <div className="filter-group">
                  <label htmlFor="fromDate">From Date</label>
                  <input
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    className="filter-input"
                    style={{ width: "150px" }}
                    value={filters.fromDate}
                    onChange={handleDateChangeFilter}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="toDate">To Date</label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    className="filter-input"
                    style={{ width: "150px" }}
                    value={filters.toDate}
                    onChange={handleDateChangeFilter}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    className="filter-select"
                    style={{ width: "120px" }}
                    value={filters.status}
                    onChange={handleStatusChange}
                  >
                    <option value="">All</option>
                    <option value="P">Pending</option>
                    <option value="Y">Resolved</option>
                    <option value="R">Rejected</option>
                  </select>
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
                  {/* <th scope="col">Complaint ID</th> */}
                  <th scope="col">Name</th>
                  <th scope="col">Ward</th>
                  <th scope="col">Supervisior Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.NUM_COMPLAINT_ID}>
                    {/* <td className="fw-semibold">#{complaint.NUM_COMPLAINT_ID}</td> */}
                    <td>{complaint.VAR_COMPLAINT_CITIZNAME}</td>
                    <td>{complaint.PRBHAG}</td>
                    <td>{complaint.SUPERWISER}</td>
                    <td>{complaint.MOBILENO}</td>
                    <td>{getBadge(complaint.VAR_COMPLAINT_STATUS)}</td>
                    <td>{formatDate(complaint.COMPLAINT_DATE)}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleReviewClick(complaint)}
                      >
                        <i className="bi bi-eye me-1"></i> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex align-items-center justify-content-between mt-4">
            <div className="text-muted small">
              Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
              <strong>{Math.min(currentPage * pageSize, totalRecords)}</strong>{" "}
              of <strong>{totalRecords}</strong> applications
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {getPaginationPages().map((page) => (
                  <li
                    key={page}
                    className={`page-item ${currentPage === page ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-double-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Review Complaint Modal */}
      {showModal && selectedComplaint && (
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
                  <i className="bi bi-chat-dots me-2"></i>
                  Review Complaint #{selectedComplaint.NUM_COMPLAINT_ID}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Read-only Details Section */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Name
                    </label>
                    <p className="h6 mb-0">
                      {selectedComplaint.VAR_COMPLAINT_CITIZNAME}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Ward
                    </label>
                    <p className="h6 mb-0">{selectedComplaint.PRBHAG}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Toilet
                    </label>
                    <p className="h6 mb-0">
                      {selectedComplaint.NUM_COMPLAINT_TOILET}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Address
                    </label>
                    <p className="h6 mb-0">{selectedComplaint.LOCATION}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Phone
                    </label>
                    <p className="h6 mb-0">{selectedComplaint.MOBILENO}</p>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-muted">
                      Citizen's Remark
                    </label>
                    <p className="h6 mb-0">
                      {selectedComplaint.VAR_COMPLAINT_REMARK}
                    </p>
                  </div>
                </div>

                {/* Complaint Images Section */}
                <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-images me-2"></i>Complaint Images
                  </label>
                  {renderThumbnails(selectedComplaint)}
                </div>

                {/* Supervisor Actions */}
                <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-semibold">Supervisor Remark <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Add your remarks about this complaint before approving or rejecting..."
                    value={supervisorRemark}
                    onChange={(e) => setSupervisorRemark(e.target.value)}
                  ></textarea>
                  <small className="text-muted mt-2 d-block">
                    Remark is required to submit this complaint.
                  </small>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-semibold">Status <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={supervisorStatus}
                    onChange={(e) => { setSupervisorStatus(e.target.value) }}
                  >
                    <option value="">--Select Status--</option>
                    <option value="WIP">WIP</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <small className="text-muted mt-2 d-block">
                    Status is required to submit this complaint.
                  </small>
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
                  className="btn btn-primary"
                  disabled={!(supervisorRemark.trim() && supervisorStatus.trim())}
                  onClick={handleSubmitComplaintStatus}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-View Image Modal */}
      {showImageModal &&
        selectedComplaint &&
        getComplaintImages(selectedComplaint).length > 0 && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 2000,
            }}
          >
            <div
              className="modal-dialog"
              style={{
                maxWidth: "90vw",
                height: "90vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="modal-content bg-dark" style={{ border: "none" }}>
                <div className="modal-header bg-dark border-secondary">
                  <h5 className="modal-title text-white">
                    Image {selectedImageIndex + 1} of{" "}
                    {getComplaintImages(selectedComplaint).length}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowImageModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-0 d-flex align-items-center justify-content-center">
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "100%",
                      maxHeight: "70vh",
                    }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${getComplaintImages(selectedComplaint)[selectedImageIndex]}`}
                      alt={`complaint-full-${selectedImageIndex}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "70vh",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-dark border-secondary justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={prevImage}
                    disabled={selectedImageIndex === 0}
                  >
                    <i className="bi bi-chevron-left me-1"></i> Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={nextImage}
                    disabled={
                      selectedImageIndex === getComplaintImages(selectedComplaint).length - 1
                    }
                  >
                    Next <i className="bi bi-chevron-right ms-1"></i>
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

export default SupervisorComplaintsList;
