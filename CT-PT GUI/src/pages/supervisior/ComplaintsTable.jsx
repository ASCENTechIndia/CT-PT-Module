import Layout from "../../components/Layout";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ComplaintsTable = () => {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      ward: "Ward A",
      toilet: "Community Toilet - Sector 4",
      address: "Near Gandhi Chowk, Main Road",
      phone: "9876543210",
      remark: "Toilet cleanliness is very poor, need immediate attention.",
      images: [
        "https://picsum.photos/id/20/80/80",
        "https://picsum.photos/id/21/80/80",
        "https://picsum.photos/id/22/80/80",
      ],
    },
    {
      id: 2,
      name: "Priya Mehta",
      ward: "Ward B",
      toilet: "Public Toilet - Market Complex",
      address: "Near Bus Stand, Shop No. 12",
      phone: "8765432109",
      remark: "Water tap broken, water overflowing since 2 days.",
      images: [
        "https://picsum.photos/id/24/80/80",
        "https://picsum.photos/id/25/80/80",
      ],
    },
    {
      id: 3,
      name: "Amit Patil",
      ward: "Ward C",
      toilet: "CT/PT - Railway Station",
      address: "Platform 1, Railway Station",
      phone: "7654321098",
      remark: "No lights inside toilet, very unsafe for women.",
      images: [
        "https://picsum.photos/id/26/80/80",
        "https://picsum.photos/id/27/80/80",
        "https://picsum.photos/id/28/80/80",
        "https://picsum.photos/id/29/80/80",
      ],
    },
    {
      id: 4,
      name: "Sneha Kulkarni",
      ward: "Ward D",
      toilet: "Toilet - Garden Area",
      address: "Jijamata Udyan, Near Main Gate",
      phone: "6543210987",
      remark: "Foul smell and no cleaning staff seen.",
      images: ["https://picsum.photos/id/30/80/80"],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Open modal and populate form with selected complaint data
  const handleEditClick = (complaint) => {
    setSelectedComplaint(complaint);
    // Populate form fields with complaint data
    setValue("name", complaint.name);
    setValue("ward", complaint.ward);
    setValue("toilet", complaint.toilet);
    setValue("address", complaint.address);
    setValue("phone", complaint.phone);
    setValue("citizenRemark", complaint.remark);
    setValue("supervisorRemark", "");
    setShowModal(true);
  };

  // Submit handler for Approve/Reject actions
  const onSubmit = (data, action) => {
    if (!selectedComplaint) return;
    const formData = {
      complaintId: selectedComplaint.id,
      ...data,
      action: action, // 'approve' or 'reject'
    };
    console.log("Form Data:", formData);
    // Later: API call to update complaint status
    alert(`Complaint ${selectedComplaint.id} has been ${action}ed.\nSupervisor Remark: ${data.supervisorRemark}`);
    setShowModal(false);
    setSelectedComplaint(null);
    reset();
  };

  // Helper to render images in modal
  const renderModalImages = (images) => {
    return (
      <div className="d-flex gap-3 flex-wrap mt-2 mb-3">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt="complaint"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #dee2e6",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="page-heading">
        <div className="page-heading-copy">
          <div>
            <p className="eyebrow mb-1">Citizen Complaints</p>
            <h1 className="h3 mb-1">Complaints List (Supervisor View)</h1>
            <p className="text-muted mb-0">
              View and manage complaints submitted by citizens.
            </p>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="h5 mb-1 section-title">
              <i className="bi bi-table" aria-hidden="true"></i>
              <span>All Complaints</span>
            </h2>
            <p className="text-muted mb-0">
              Click Edit to review details and take action.
            </p>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Ward</th>
                <th scope="col">Toilet</th>
                <th scope="col">Address</th>
                <th scope="col">Phone</th>
                <th scope="col">Remark</th>
                <th scope="col" className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className="fw-semibold">{complaint.name}</td>
                  <td>{complaint.ward}</td>
                  <td>{complaint.toilet}</td>
                  <td>{complaint.address}</td>
                  <td>{complaint.phone}</td>
                  <td style={{ maxWidth: "250px" }}>{complaint.remark}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditClick(complaint)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - uses React Hook Form */}
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
                  Review Complaint #{selectedComplaint.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Ward *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.ward ? 'is-invalid' : ''}`}
                        {...register("ward", { required: "Ward is required" })}
                      />
                      {errors.ward && <div className="invalid-feedback">{errors.ward.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Toilet *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.toilet ? 'is-invalid' : ''}`}
                        {...register("toilet", { required: "Toilet is required" })}
                      />
                      {errors.toilet && <div className="invalid-feedback">{errors.toilet.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Address *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        {...register("address", { required: "Address is required" })}
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone *</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        {...register("phone", { 
                          required: "Phone is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Enter a valid 10-digit mobile number"
                          }
                        })}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </div>
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">Citizen's Remark *</label>
                      <textarea
                        className={`form-control ${errors.citizenRemark ? 'is-invalid' : ''}`}
                        rows="2"
                        {...register("citizenRemark", { required: "Citizen remark is required" })}
                      ></textarea>
                      {errors.citizenRemark && <div className="invalid-feedback">{errors.citizenRemark.message}</div>}
                    </div>
                  </div>

                  {/* Complaint Images */}
                  <div className="mt-3">
                    <label className="form-label fw-semibold">Complaint Images</label>
                    {renderModalImages(selectedComplaint.images)}
                  </div>

                  {/* Supervisor Remark */}
                  <div className="mt-3">
                    <label className="form-label fw-semibold">Supervisor Remark *</label>
                    <textarea
                      className={`form-control ${errors.supervisorRemark ? 'is-invalid' : ''}`}
                      rows="2"
                      placeholder="Add your remarks before approving or rejecting..."
                      {...register("supervisorRemark", { required: "Supervisor remark is required" })}
                    ></textarea>
                    {errors.supervisorRemark && <div className="invalid-feedback">{errors.supervisorRemark.message}</div>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleSubmit((data) => onSubmit(data, "reject"))}
                  >
                    <i className="bi bi-x-circle me-1"></i> Reject
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSubmit((data) => onSubmit(data, "approve"))}
                  >
                    <i className="bi bi-check-circle me-1"></i> Approve
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ComplaintsTable;