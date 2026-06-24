import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import ResponseModal from "../../components/ResponseModal";
import { useAuth } from "../../context/AuthContext";
import { useLoader } from "../../context/LoaderContext";

const FineList = () => {
  const { user } = useAuth();
  const ulbId = user?.orgId;

  const [applications, setApplications] = useState([]);
  const { setLoader } = useLoader();

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

  const getBreakdownData = (totalFine) => {
    if (!totalFine || totalFine === 0) {
      return [
        { amount: 0, label: "Fine 1" },
        { amount: 0, label: "Fine 2" },
        { amount: 0, label: "Fine 3" },
      ];
    }

    const base = Math.floor(totalFine / 3);
    const remainder = totalFine - base * 3;
    return [
      { amount: base + (remainder > 0 ? 1 : 0), label: "Fine 1" },
      { amount: base + (remainder > 1 ? 1 : 0), label: "Fine 2" },
      { amount: base, label: "Fine 3" },
    ];
  };

  // Fetch applications from API
  const fetchApplications = async (page = 1) => {
    if (!ulbId) {
      setModalMessage("UlbId is not set");
      return;
    }
    try {
      setLoader(true);
      const params = new URLSearchParams();
      params.append("ulbid", ulbId);
      params.append("page", page);
      params.append("limit", pageSize);
      if (dateFilter.from) params.append("fromDate", dateFilter.from);
      if (dateFilter.to) params.append("toDate", dateFilter.to);

      const response = await apiClient.get(
        `/report/get-fine-application-list?${params.toString()}`,
      );

      if (response.success && response.data) {
        setApplications(response.data.data);
        // ✅ Handle both 0‑based and 1‑based page numbers
        const apiPage = response.data.pagination.page;
        setCurrentPage(apiPage === 0 ? 1 : apiPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalRecords(response.data.pagination.total);
      } else {
        setApplications([]);
        setTotalRecords(0);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error fetching fine list:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage(
        "Failed to load fine applications. Please try again later.",
      );
      setIsModalOpen(true);
    } finally {
      setLoader(false);
    }
  };

  // Initial load and when date filters change
  useEffect(() => {
    if (ulbId) {
      fetchApplications(1);
    }
  }, [ulbId]);

  useEffect(() => {
    if (ulbId) {
      fetchApplications(1);
    }
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

  // Placeholder approve/reject (commented out – kept for future use)
  // const handleApprove = () => { ... };
  // const handleReject = () => { ... };

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
          <table
            className="table align-middle mb-0"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr>
                <th scope="col" style={{ width: "8%" }} className="text-center">
                  Work ID
                </th>
                <th scope="col" style={{ width: "8%" }} className="text-center">
                  Ward ID
                </th>
                <th scope="col" style={{ width: "8%" }} className="text-center">
                  Toilet ID
                </th>
                <th
                  scope="col"
                  style={{ width: "15%" }}
                  className="text-center"
                >
                  Toilet Location
                </th>
                <th
                  scope="col"
                  style={{ width: "10%" }}
                  className="text-center"
                >
                  Supervisor ID
                </th>
                <th
                  scope="col"
                  style={{ width: "10%" }}
                  className="text-center"
                >
                  SI ID
                </th>
                <th
                  scope="col"
                  style={{ width: "12%" }}
                  className="text-center"
                >
                  Work Date
                </th>
                <th
                  scope="col"
                  style={{ width: "12%" }}
                  className="text-center"
                >
                  Total Fine (₹)
                </th>
                <th
                  scope="col"
                  style={{ width: "17%" }}
                  className="text-center"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.WORK_ID}>
                  <td className="fw-semibold text-center">{app.WORK_ID}</td>
                  <td className="text-center">{app.WARD_ID}</td>
                  <td className="text-center">{app.TOILET_ID}</td>
                  <td className="text-center">{app.TOILET_LOCATION}</td>
                  <td className="text-center">{app.SUPERID || "—"}</td>
                  <td className="text-center">{app.SIID || "—"}</td>
                  <td className="text-center">{formatDate(app.WORK_DATE)}</td>
                  <td className="text-center">
                    ₹{app.TOTAL_FINE?.toLocaleString() || 0}
                  </td>
                  <td className="text-center" style={{ whiteSpace: "nowrap" }}>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleReviewClick(app)}
                      style={{ whiteSpace: "nowrap" }}
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
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
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
        )}
      </div>

      {/* Review Modal with Breakdown Table */}
      {showModal && selectedApplication && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
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
                    <label className="form-label fw-semibold text-muted">
                      Work ID
                    </label>
                    <p className="h6 mb-0">{selectedApplication.WORK_ID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Ward ID
                    </label>
                    <p className="h6 mb-0">{selectedApplication.WARD_ID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Toilet ID
                    </label>
                    <p className="h6 mb-0">{selectedApplication.TOILET_ID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Toilet Location
                    </label>
                    <p className="h6 mb-0">
                      {selectedApplication.TOILET_LOCATION}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Supervisor ID
                    </label>
                    <p className="h6 mb-0">
                      {selectedApplication.SUPERID || "—"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      SI ID
                    </label>
                    <p className="h6 mb-0">{selectedApplication.SIID || "—"}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Work Date
                    </label>
                    <p className="h6 mb-0">
                      {formatDate(selectedApplication.WORK_DATE)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Total Fine
                    </label>
                    <p className="h6 mb-0 text-success fw-bold">
                      ₹{selectedApplication.TOTAL_FINE?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                {/* Breakdown Table Section */}
                <div className="mt-4 pt-3 border-top">
                  <h6 className="mb-3">
                    <i className="bi bi-list-ul me-2"></i>
                    Fine Breakdown
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">Work ID</th>
                          <th className="text-center">Ward ID</th>
                          <th className="text-center">Toilet ID</th>
                          <th className="text-center">Toilet Location</th>
                          <th className="text-center">Supervisor ID</th>
                          <th className="text-center">SI ID</th>
                          <th className="text-center">Work Date</th>
                          <th className="text-center">Fine (₹)</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const totalFine = selectedApplication.TOTAL_FINE || 0;
                          const breakdown = getBreakdownData(totalFine);
                          return breakdown.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">
                                {selectedApplication.WORK_ID}
                              </td>
                              <td className="text-center">
                                {selectedApplication.WARD_ID}
                              </td>
                              <td className="text-center">
                                {selectedApplication.TOILET_ID}
                              </td>
                              <td className="text-center">
                                {selectedApplication.TOILET_LOCATION}
                              </td>
                              <td className="text-center">
                                {selectedApplication.SUPERID || "—"}
                              </td>
                              <td className="text-center">
                                {selectedApplication.SIID || "—"}
                              </td>
                              <td className="text-center">
                                {formatDate(selectedApplication.WORK_DATE)}
                              </td>
                              <td className="text-center">
                                ₹{item.amount.toLocaleString()}
                              </td>
                              <td className="text-center">
                                <span className="badge bg-secondary">—</span>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                      <tfoot className="table-active fw-bold">
                        <tr>
                          <td colSpan="7" className="text-end">
                            <i className="bi bi-calculator me-2"></i>Total Fine
                          </td>
                          <td className="text-center text-success">
                            ₹
                            {selectedApplication.TOTAL_FINE?.toLocaleString() ||
                              0}
                          </td>
                          <td className="text-center"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <small className="text-muted d-block mt-2">
                    <i className="bi bi-info-circle me-1"></i>
                    The fine is distributed across 3 entries. The sum of
                    individual fines equals the total fine.
                  </small>
                </div>

                {/* Approval section (commented out – kept for future use) */}
                {/* <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-semibold">Approval Remark *</label>
                  <textarea ... />
                </div> */}
              </div>
              {/* <div className="modal-footer"> ... </div> */}
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
