import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../services/apiClient";
import ResponseModal from "../../components/ResponseModal";

const ComplaintsTable = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [supervisorRemark, setSupervisorRemark] = useState("");

  // Response Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch complaints from API on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        "/registerComplaint/getComplaintList?ulbid=4"
      );

      if (response.success && response.data) {
        // Transform API response to component format
        const transformedComplaints = response.data.map((complaint) => ({
          NUM_COMPLAINT_ID: complaint.NUM_COMPLAINT_ID,
          VAR_COMPLAINT_CITIZNAME: complaint.VAR_COMPLAINT_CITIZNAME,
          NUM_COMPLAINT_WARDID: complaint.NUM_COMPLAINT_WARDID,
          NUM_COMPLAINT_TOILET: complaint.NUM_COMPLAINT_TOILET,
          VAR_COMPLAINT_REMARK: complaint.VAR_COMPLAINT_REMARK,
          NUM_COMPLAINT_MOBILENO: complaint.NUM_COMPLAINT_MOBILENO,
          VAR_COMPLAINT_STATUS: complaint.VAR_COMPLAINT_STATUS,
          DAT_COMPLAINT_INSDT: complaint.DAT_COMPLAINT_INSDT,
          images: [
            complaint.BLOB_COMPLAINT_UNITIMG1,
            complaint.BLOB_COMPLAINT_UNITIMG2,
            complaint.BLOB_COMPLAINT_UNITIMG3,
            complaint.BLOB_COMPLAINT_UNITIMG4,
            complaint.BLOB_COMPLAINT_UNITIMG5,
          ].filter((img) => img !== null),
        }));

        setComplaints(transformedComplaints);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage(
        "Failed to load complaints. Please try again later."
      );
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and display selected complaint details (read-only)
  const handleReviewClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
    setSelectedImageIndex(0);
    setSupervisorRemark("");
  };

  // Handle Approve action
  const handleApprove = async () => {
    if (!supervisorRemark.trim()) {
      setModalType("warning");
      setModalTitle("Warning");
      setModalMessage("Please add a remark before approving this complaint.");
      setIsModalOpen(true);
      return;
    }

    try {
      // TODO: Call API to update complaint status to approved
      // const response = await apiClient.post("/registerComplaint/updateComplaint", {
      //   complaintId: selectedComplaint.NUM_COMPLAINT_ID,
      //   status: "Y",
      //   supervisorRemark: supervisorRemark
      // });
      
      setModalType("success");
      setModalTitle("Success");
      setModalMessage("Complaint has been approved successfully.");
      setIsModalOpen(true);
      
      setShowModal(false);
      setSupervisorRemark("");
      // Refresh the complaints list
      fetchComplaints();
    } catch (err) {
      console.error("Error approving complaint:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("Failed to approve complaint. Please try again.");
      setIsModalOpen(true);
    }
  };

  // Handle Reject action
  const handleReject = async () => {
    if (!supervisorRemark.trim()) {
      setModalType("warning");
      setModalTitle("Warning");
      setModalMessage("Please add a remark before rejecting this complaint.");
      setIsModalOpen(true);
      return;
    }

    try {
      // TODO: Call API to update complaint status to rejected
      // const response = await apiClient.post("/registerComplaint/updateComplaint", {
      //   complaintId: selectedComplaint.NUM_COMPLAINT_ID,
      //   status: "R",
      //   supervisorRemark: supervisorRemark
      // });
      
      setModalType("success");
      setModalTitle("Success");
      setModalMessage("Complaint has been rejected successfully.");
      setIsModalOpen(true);
      
      setShowModal(false);
      setSupervisorRemark("");
      // Refresh the complaints list
      fetchComplaints();
    } catch (err) {
      console.error("Error rejecting complaint:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("Failed to reject complaint. Please try again.");
      setIsModalOpen(true);
    }
  };

  // Open image in full view
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  // Navigate to next image
  const nextImage = () => {
    if (selectedComplaint && selectedImageIndex < selectedComplaint.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
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

  // Helper to render image thumbnails with click handler
  const renderThumbnails = (images) => {
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
              onMouseEnter={(e) => (e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")}
              onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
            />
          ))
        ) : (
          <p className="text-muted mb-0">No images available</p>
        )}
      </div>
    );
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
          <div className="panel-header">
            <div>
              <h2 className="h5 mb-1 section-title">
                <i className="bi bi-table" aria-hidden="true"></i>
                <span>All Complaints ({complaints.length})</span>
              </h2>
              <p className="text-muted mb-0">
                View and manage complaints submitted by citizens.
              </p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  {/* <th scope="col">Complaint ID</th> */}
                  <th scope="col">Name</th>
                  <th scope="col">Ward</th>
                  <th scope="col">Toilet Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.NUM_COMPLAINT_ID}>
                    {/* <td className="fw-semibold">#{complaint.NUM_COMPLAINT_ID}</td> */}
                    <td>{complaint.VAR_COMPLAINT_CITIZNAME}</td>
                    <td>Ward {complaint.NUM_COMPLAINT_WARDID}</td>
                    <td>Toilet {complaint.NUM_COMPLAINT_TOILET}</td>
                    <td>{complaint.NUM_COMPLAINT_MOBILENO}</td>
                    <td>
                      <span
                        className={`badge ${
                          complaint.VAR_COMPLAINT_STATUS === "P"
                            ? "bg-warning"
                            : complaint.VAR_COMPLAINT_STATUS === "Y"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {complaint.VAR_COMPLAINT_STATUS === "P"
                          ? "Pending"
                          : complaint.VAR_COMPLAINT_STATUS === "Y"
                          ? "Resolved"
                          : "Unknown"}
                      </span>
                    </td>
                    <td>{formatDate(complaint.DAT_COMPLAINT_INSDT)}</td>
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
                    <p className="h6 mb-0">{selectedComplaint.VAR_COMPLAINT_CITIZNAME}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Ward
                    </label>
                    <p className="h6 mb-0">Ward {selectedComplaint.NUM_COMPLAINT_WARDID}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Toilet
                    </label>
                    <p className="h6 mb-0">Toilet {selectedComplaint.NUM_COMPLAINT_TOILET}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Address
                    </label>
                    <p className="h6 mb-0">-</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-muted">
                      Phone
                    </label>
                    <p className="h6 mb-0">{selectedComplaint.NUM_COMPLAINT_MOBILENO}</p>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-semibold text-muted">
                      Citizen's Remark
                    </label>
                    <p className="h6 mb-0">{selectedComplaint.VAR_COMPLAINT_REMARK}</p>
                  </div>
                </div>

                {/* Complaint Images Section */}
                <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-images me-2"></i>Complaint Images
                  </label>
                  {renderThumbnails(selectedComplaint.images)}
                </div>

                {/* Supervisor Actions */}
                <div className="mt-4 pt-3 border-top">
                  <label className="form-label fw-semibold">Supervisor Remark *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Add your remarks about this complaint before approving or rejecting..."
                    value={supervisorRemark}
                    onChange={(e) => setSupervisorRemark(e.target.value)}
                  ></textarea>
                  <small className="text-muted mt-2 d-block">
                    Remark is required to approve or reject this complaint.
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
                  className="btn btn-danger"
                  onClick={handleReject}
                  disabled={!supervisorRemark.trim()}
                >
                  <i className="bi bi-x-circle me-1"></i> Reject
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApprove}
                  disabled={!supervisorRemark.trim()}
                >
                  <i className="bi bi-check-circle me-1"></i> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-View Image Modal */}
      {showImageModal && selectedComplaint && selectedComplaint.images.length > 0 && (
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
                  Image {selectedImageIndex + 1} of {selectedComplaint.images.length}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowImageModal(false)}
                ></button>
              </div>
              <div className="modal-body p-0 d-flex align-items-center justify-content-center">
                <div style={{ position: "relative", maxWidth: "100%", maxHeight: "70vh" }}>
                  <img
                    src={`data:image/png;base64,${selectedComplaint.images[selectedImageIndex]}`}
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
                  disabled={selectedImageIndex === selectedComplaint.images.length - 1}
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

export default ComplaintsTable;