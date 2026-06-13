import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../services/apiClient";
import ResponseModal from "../../components/ResponseModal";
import "../../assets/css/form-validation.css";
import { useSearchParams } from "react-router-dom";

const FrmCitizen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [toiletOptions, setToiletOptions] = useState([]);
  const [complaintTypeOptions, setComplaintTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWard, setSelectedWard] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("info"); // success, error, warning, info
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [searchParams] = useSearchParams();

const wardIdFromUrl = searchParams.get("wardId");
const toiletIdFromUrl = searchParams.get("toiletId");

const isWardLocked = !!wardIdFromUrl;
const isToiletLocked = !!toiletIdFromUrl;

  const ulbId = 4; // Default ULB ID

const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
  reset,
  watch,
} = useForm({
  mode: "onBlur",
  reValidateMode: "onChange",
});

  const unitOptions = Array.from({ length: 5}, (_, i) => i + 1);

  // Helper function to show modal
  const showModal = (type, title, message) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch Ward List on component mount
useEffect(() => {
  const fetchWardList = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/registerComplaint/wardList", {
        params: { ulbid: ulbId },
      });

      if (response.success && response.data) {
        setWardOptions(response.data);

        if (wardIdFromUrl) {
          setSelectedWard(String(wardIdFromUrl));
          setValue("ward", String(wardIdFromUrl));
        }
      }
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      showModal("error", "Warning", "Failed to fetch ward list");
      console.error("Error fetching ward list:", err);
    }
  };

  fetchWardList();
}, [setValue, wardIdFromUrl]);

  // Fetch Complaint Type List on component mount
  useEffect(() => {
    const fetchComplaintTypeList = async () => {
      try {
        const response = await apiClient.get(
          "/registerComplaint/complaintTypeList",
          { params: { ulbid: ulbId } }
        );
        if (response.success && response.data) {
          setComplaintTypeOptions(response.data);
        }
      } catch (err) {
        const errorMsg = err.message;
        setError(errorMsg);
        showModal("error", "Warning", "Failed to fetch complaint types");
        console.error("Error fetching complaint types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaintTypeList();
  }, []);

  // Fetch Toilet List when ward is selected
useEffect(() => {
  if (!selectedWard) return;

  const fetchToiletList = async () => {
    try {
      const response = await apiClient.get(
        "/registerComplaint/toiletList",
        {
          params: {
            ulbid: ulbId,
            wardid: selectedWard,
          },
        }
      );

      if (response.success && response.data) {
        setToiletOptions(response.data);

        if (toiletIdFromUrl) {
          const toiletExists = response.data.some(
            (item) =>
              String(item.NUM_CTPTTYPE_ID) === String(toiletIdFromUrl)
          );

          if (toiletExists) {
            setValue("toilet", String(toiletIdFromUrl));
          }
        }
      }
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      showModal("error", "Warning", "Failed to fetch toilet list");
      console.error("Error fetching toilet list:", err);
    }
  };

  fetchToiletList();
}, [selectedWard, toiletIdFromUrl, setValue]);

  // Handle multiple image upload & preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result.split(",")[1]; // Extract base64 part
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Convert images to base64
      const base64Images = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const base64 = await fileToBase64(selectedImages[i]);
        base64Images.push(base64);
      }

      // Prepare complaint payload
      const complaintPayload = {
        userId: "GUEST",
        ulbId: ulbId,
        wardId: parseInt(data.ward),
        toiletId: parseInt(data.toilet), // Toilet location string from API
        complaintTypeId: parseInt(data.complaintType),
        citizenMn: data.citizenName,
        mobileNo: parseInt(data.mobileNumber),
        unitNo: parseInt(data.unit),
        complaintStatus: "P",
        complntRemark: data.remark,
        unitImg1: base64Images[0] || null,
        unitImg2: base64Images[1] || null,
        unitImg3: base64Images[2] || null,
        unitImg4: base64Images[3] || null,
        unitImg5: base64Images[4] || null,
      };

      console.log("Submitting complaint:", complaintPayload);

      // Call API
      const response = await apiClient.post(
        "/registerComplaint/insertComplaint",
        complaintPayload
      );

      if (response.success) {
        setError(null);
        showModal(
          "success",
          "Success!",response.data.message
        );
        reset();
        setSelectedImages([]);
        setPreviewUrls([]);
        document.getElementById("imageUpload").value = "";
        setSelectedWard(""); // Reset ward selection
      } else {
        const errorMsg = response.message || "Failed to submit complaint";
        setError(errorMsg);
        showModal("error", "Error", errorMsg);
      }
    } catch (err) {
      const errorMessage = err.message || "Error submitting complaint";
      setError(errorMessage);
      showModal("error", "Error", errorMessage);
      console.error("Complaint submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      {/* Header Section */}
      <div className="top-header">
        <div>
          <img
            src="/assets/images/dhule-logo.png"
            alt=""
            style={{ height: "50px" }}
          />
        </div>
        <div className="page-heading">
          <div className="page-title">Register Your Complaint</div>
          <div className="page-subtitle">
            Submit CT/PT Complaint with photos
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-container">
        {error && (
          <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
            Error: {error}
          </div>
        )}
        {loading && (
          <div style={{ color: "blue", padding: "10px", marginBottom: "10px" }}>
            Loading form data...
          </div>
        )}
        <div className="form-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Select Ward */}
            <div className="field-box">
              <i className="bi bi-diagram-3"></i>
            <select
  {...register("ward", {
    required: "Ward is required",
  })}
  value={watch("ward") || ""}
  disabled={isWardLocked}
  onChange={(e) => {
    const value = e.target.value;

    setSelectedWard(value);
    setValue("ward", value);
    setToiletOptions([]);
    setValue("toilet", "");
  }}
  className={errors.ward ? "input-error" : ""}
>
  <option value="">Select Ward</option>

  {wardOptions.map((ward) => (
    <option
      key={ward.NUM_CTPTTYPE_WARDID}
      value={ward.NUM_CTPTTYPE_WARDID}
    >
      Ward {ward.NUM_CTPTTYPE_WARDID}
    </option>
  ))}
</select>
            </div>
            {errors.ward && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.ward.message}
              </p>
            )}

            {/* Select Toilet */}
            <div className="field-box">
              <i className="bi bi-building"></i>
             <select
  {...register("toilet", {
    required: "Toilet is required",
  })}
  value={watch("toilet") || ""}
  disabled={toiletOptions.length === 0 || isToiletLocked}
  className={errors.toilet ? "input-error" : ""}
>
  <option value="">Select Toilet</option>

  {toiletOptions.map((toilet) => (
    <option
      key={toilet.NUM_CTPTTYPE_ID}
      value={toilet.NUM_CTPTTYPE_ID}
    >
      {toilet.VAR_CTPTTYPE_TOILETLOCATION}
    </option>
  ))}
</select>
            </div>
            {errors.toilet && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.toilet.message}
              </p>
            )}

            {/* Select Complaint Type */}
            <div className="field-box">
              <i className="bi bi-ui-checks-grid"></i>
              <select
                {...register("complaintType", {
                  required: "Complaint type is required",
                })}
                className={errors.complaintType ? "input-error" : ""}
              >
                <option value="">Select Complaint Type</option>
                {complaintTypeOptions.map((type) => (
                  <option
                    key={type.NUM_CTPTCOMPLTYPE_ID}
                    value={type.NUM_CTPTCOMPLTYPE_ID}
                  >
                    {type.VAR_CTPTCOMPLTYPE_NAME}
                  </option>
                ))}
              </select>
            </div>
            {errors.complaintType && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.complaintType.message}
              </p>
            )}

            {/* Citizen Name */}
            <div className="field-box">
              <i className="bi bi-person"></i>
              <input
                type="text"
                placeholder="Citizen Name"
                {...register("citizenName", {
                  required: "Citizen name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "Name should only contain letters and spaces",
                  },
                })}
                className={errors.citizenName ? "input-error" : ""}
              />
            </div>
            {errors.citizenName && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.citizenName.message}
              </p>
            )}

            {/* Mobile Number */}
            <div className="field-box">
              <i className="bi bi-phone"></i>
              <input
                type="tel"
                placeholder="Mobile Number"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  validate: (value) => {
                    // Remove any non-numeric characters
                    const cleanValue = value.replace(/\D/g, "");
                    
                    // Check if it's exactly 10 digits
                    if (cleanValue.length !== 10) {
                      return "Mobile number must be exactly 10 digits";
                    }
                    
                    // Check if it's a valid Indian mobile number (starts with 6-9)
                    if (!/^[6-9][0-9]{9}$/.test(cleanValue)) {
                      return "Mobile number must start with 6, 7, 8, or 9";
                    }
                    
                    return true;
                  },
                })}
                className={errors.mobileNumber ? "input-error" : ""}
                maxLength="10"
              />
            </div>
            {errors.mobileNumber && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.mobileNumber.message}
              </p>
            )}

            {/* Remark - NEW (textarea) */}
            <div className="field-box">
              <i className="bi bi-chat-left-text"></i>
              <textarea
                placeholder="Remark (additional details)"
                rows="3"
                {...register("remark", {
                  required: "Remark is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                })}
                className={errors.remark ? "input-error" : ""}
              ></textarea>
            </div>
            {errors.remark && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.remark.message}
              </p>
            )}

            {/* Unit Dropdown */}
            <div className="field-box">
              <i className="bi bi-grid-3x3-gap-fill"></i>
              <select
                {...register("unit", { required: "Unit is required" })}
                className={errors.unit ? "input-error" : ""}
              >
                <option value="">Select Unit</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            {errors.unit && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.unit.message}
              </p>
            )}

            {/* Upload Complaint Images */}
            <div className="upload-box">
              <i className="bi bi-cloud-arrow-up"></i>
              <h6>Upload Complaint Photos</h6>
              <p>Multiple image upload supported</p>
              <label className="upload-btn">
                Choose Photos
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
              <div className="preview-images">
                {previewUrls.map((url, idx) => (
                  <img key={idx} src={url} alt={`preview-${idx}`} />
                ))}
              </div>
            </div>
            {selectedImages.length === 0 && (
              <p
                style={{ color: "red", fontSize: "12px", textAlign: "center" }}
              >
                At least one image is required
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={selectedImages.length === 0}
            >
              Submit Complaint
            </button>
          </form>
        </div>
      </div>

      {/* Response Modal */}
      <ResponseModal
        isOpen={isModalOpen}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
    </div>
  );
};

export default FrmCitizen;
