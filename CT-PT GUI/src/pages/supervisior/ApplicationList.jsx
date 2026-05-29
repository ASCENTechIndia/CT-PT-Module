import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import ResponseModal from "../../components/ResponseModal";
import { useAuth } from "../../context/AuthContext";

const ApplicationList = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stageWiseImages, setStageWiseImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Supervisor action states
  const [supervisorRemark, setSupervisorRemark] = useState("");

  // Response Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        "/authComplaint/getCompListForSup?ulbid=4"
      );

      if (response.success && response.data) {
        setApplications(response.data);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("Failed to load applications. Please try again later.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch stage-wise images for selected application
  const fetchStageWiseImages = async (application) => {
    try {
      const response = await apiClient.get(
        `/authComplaint/getImages?ulbid=4&toiletId=${application.NUM_EMPCTPTENTRY_TOILETID}&applid=${application.NUM_EMPCTPTENTRY_ID}`
      );

      if (response.success && response.data) {
        setStageWiseImages(response.data);
      }
    } catch (err) {
      console.error("Error fetching stage-wise images:", err);
      // Don't show error for images, they might already be in the main response
    }
  };

  // Open modal and display selected application details
  const handleReviewClick = async (application) => {
    setSelectedApplication(application);
    setSupervisorRemark("");
    setStageWiseImages([]); // Reset images
    
    // Fetch stage-wise images
    await fetchStageWiseImages(application);
    
    setShowModal(true);
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

  // Group images by stage
  const getImagesByStage = () => {
    const stagesMap = new Map();
    
    // If stageWiseImages is populated, use it
    if (stageWiseImages && stageWiseImages.length > 0) {
      stageWiseImages.forEach((entry) => {
        const stageName = entry.VAR_CTPTSTAGE_NAME;
        if (!stagesMap.has(stageName)) {
          stagesMap.set(stageName, {
            stageName: stageName,
            images: [],
          });
        }
        
        const images = [
          entry.BOLB_EMPCTPTENTRY_IMAGE,
          entry.BOLB_EMPCTPTENTRY_IMAGE2,
          entry.BOLB_EMPCTPTENTRY_IMAGE3,
        ].filter((img) => img && img !== null && img.trim() !== "");
        
        stagesMap.get(stageName).images.push(...images);
      });
    }

    return Array.from(stagesMap.values());
  };

  // Handle Approve action
  const handleApprove = async () => {
    if (!supervisorRemark.trim()) {
      setModalType("warning");
      setModalTitle("Warning");
      setModalMessage(
        "Please add a remark before approving this application."
      );
      setIsModalOpen(true);
      return;
    }

    try {
      const payload = {
        userId: user.userId, // TODO: Get from user context/login
        applId: selectedApplication.NUM_EMPCTPTENTRY_ID,
        ulbId: 4,
        mode: 1, // 1 for supervisor
        status: "A", // A for approve
        remark: supervisorRemark,
      };

      const response = await apiClient.post(
        "/authComplaint/authComplaint",
        payload
      );

      if (response.success) {
        setModalType("success");
        setModalTitle("Success");
        setModalMessage(response.data.message);
        setIsModalOpen(true);

        setShowModal(false);
        setSupervisorRemark("");
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error("Error approving application:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("Failed to approve application. Please try again.");
      setIsModalOpen(true);
    }
  };

  // Handle Reject action
  const handleReject = async () => {
    if (!supervisorRemark.trim()) {
      setModalType("warning");
      setModalTitle("Warning");
      setModalMessage(
        "Please add a remark before rejecting this application."
      );
      setIsModalOpen(true);
      return;
    }

    try {
      const payload = {
        userId: user.userId, // TODO: Get from user context/login
        applId: selectedApplication.NUM_EMPCTPTENTRY_ID,
        ulbId: 4,
        mode: 1, // 1 for supervisor
        status: "R", // R for reject
        remark: supervisorRemark,
      };

      const response = await apiClient.post(
        "/authComplaint/authComplaint",
        payload
      );

      if (response.success) {
        setModalType("success");
        setModalTitle("Success");
        setModalMessage(response.data.message);
        setIsModalOpen(true);

        setShowModal(false);
        setSupervisorRemark("");
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
      setModalType("error");
      setModalTitle("Error");
      setModalMessage("Failed to reject application. Please try again.");
      setIsModalOpen(true);
    }
  };

  // Render image thumbnails with click handler
  const renderImageGallery = (images) => {
    const openImageInNewTab = (img) => {
      try {
        // Convert base64 to blob
        const binaryString = atob(img);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "image/jpeg" });
        
        // Create object URL from blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Open in new tab
        window.open(blobUrl, "_blank");
      } catch (err) {
        console.error("Error opening image:", err);
        alert("Unable to open image. Please try again.");
      }
    };

    return (
      <div className="d-flex gap-2 flex-wrap">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={`data:image/jpeg;base64,${img}`}
                alt={`stage-${idx}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #dee2e6",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => openImageInNewTab(img)}
                onMouseEnter={(e) => (e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")}
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>
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
          <p className="text-muted mt-3">Loading applications...</p>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="h5 mb-1 section-title">
                <i className="bi bi-file-earmark-text" aria-hidden="true"></i>
                <span>All Applications ({applications.length})</span>
              </h2>
              <p className="text-muted mb-0">
                Click on an application to view details, images, and location.
              </p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Ward</th>
                  <th scope="col">Toilet Location</th>
                  <th scope="col">Toilet Manager</th>
                  <th scope="col">Employee</th>
                  <th scope="col">Remark</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app.NUM_EMPCTPTENTRY_ID || idx}>
                    <td className="fw-semibold">Ward {app.NUM_CTPTTYPE_WARDID}</td>
                    <td>{app.VAR_CTPTTYPE_TOILETLOCATION}</td>
                    <td>{app.VAR_CTPTTYPE_USERNAME}</td>
                    <td>{app.USERNAME}</td>
                    <td style={{ maxWidth: "250px" }}>
                      <small>{app.VAR_EMPCTPTENTRY_REMARK}</small>
                    </td>
                    <td>{formatDate(app.DAT_EMPCTPTENTRY_DATE)}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleReviewClick(app)}
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

      {/* Review Application Modal - Two Column Layout */}
      {showModal && selectedApplication && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" style={{ maxWidth: "1000px" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-file-earmark-check me-2"></i>
                  Review Application #{selectedApplication.NUM_EMPCTPTENTRY_ID}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Left Column - Application Details and Supervisor Action */}
                  <div className="col-lg-5">
                    {/* Application Details */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Application Details</h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">
                              Ward
                            </label>
                            <p className="h6 mb-0">
                              Ward {selectedApplication.NUM_CTPTTYPE_WARDID}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">
                              Toilet Location
                            </label>
                            <p className="h6 mb-0">
                              {selectedApplication.VAR_CTPTTYPE_TOILETLOCATION}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">
                              Toilet Manager
                            </label>
                            <p className="h6 mb-0">
                              {selectedApplication.VAR_CTPTTYPE_USERNAME}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">
                              Employee Name
                            </label>
                            <p className="h6 mb-0">
                              {selectedApplication.USERNAME}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">
                              Employee ID
                            </label>
                            <p className="h6 mb-0">
                              {selectedApplication.USERID}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">
                              Submission Date
                            </label>
                            <p className="h6 mb-0">
                              {formatDate(selectedApplication.DAT_EMPCTPTENTRY_DATE)}
                            </p>
                          </div>
                          <div className="col-md-12">
                            <label className="form-label fw-semibold text-muted">
                              Remark
                            </label>
                            <p className="h6 mb-0">
                              {selectedApplication.VAR_EMPCTPTENTRY_REMARK}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Supervisor Action */}
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Supervisor Action</h6>
                      </div>
                      <div className="card-body">
                        <label className="form-label fw-semibold">
                          Remark *
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Add your remarks about this application before approving or rejecting..."
                          value={supervisorRemark}
                          onChange={(e) => setSupervisorRemark(e.target.value)}
                        ></textarea>
                        <small className="text-muted mt-2 d-block">
                          Remark is required to approve or reject this application.
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location Map and Stage Wise Images */}
                  <div className="col-lg-7">
                    {/* Location Map */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Location</h6>
                      </div>
                      <div className="card-body">
                        <div
                          style={{
                            width: "100%",
                            height: "250px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "2px solid #dee2e6",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAMu4Ig2LTmXqP2uIRuDWvj2eqaCpYXNao&q=${selectedApplication.VAR_EMPCTPTENTRY_LATITUDE},${selectedApplication.VAR_EMPCTPTENTRY_LONGITUDE}`}
                            title="Location Map"
                          ></iframe>
                        </div>
                        <div className="mt-2 small text-muted">
                          <p className="mb-1">
                            <strong>Latitude:</strong>{" "}
                            {selectedApplication.VAR_EMPCTPTENTRY_LATITUDE}
                          </p>
                          <p className="mb-0">
                            <strong>Longitude:</strong>{" "}
                            {selectedApplication.VAR_EMPCTPTENTRY_LONGITUDE}
                          </p>
                        </div>
                      </div>
                    </div>

                  <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Stage Wise Images</h6>
                      </div>
                      <div className="card-body" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        {getImagesByStage().length > 0 ? (
                          getImagesByStage().map((stage, idx) => (
                            <div key={idx} className="mb-4">
                              <div className="mb-3">
                                <i className="bi bi-images me-2"></i>
                                <strong>{stage.stageName}</strong>
                              </div>
                              {renderImageGallery(stage.images)}
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No images available</p>
                        )}
                      </div>
                    </div>
                   
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

export default ApplicationList;
