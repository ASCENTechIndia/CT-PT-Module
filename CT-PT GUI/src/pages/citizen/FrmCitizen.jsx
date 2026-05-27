import React, { useState } from "react";
import { useForm } from "react-hook-form";

const FrmCitizen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Ward options (sample – replace with actual data)
  const wardOptions = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"];
  const toiletOptions = ["Toilet 1", "Toilet 2", "Toilet 3"];

  // Unit options 1 to 10
  const unitOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  // Handle multiple image upload & preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Generate preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const onSubmit = (data) => {
    // Combine form data with images
    const formData = new FormData();
    formData.append("ward", data.ward);
    formData.append("citizenName", data.citizenName);
    formData.append("mobileNumber", data.mobileNumber);
    formData.append("unit", data.unit);
    selectedImages.forEach((image, index) => {
      formData.append(`complaintImage${index}`, image);
    });

    // For now, just log to console (you will send to Node.js later)
    console.log("Form Data:", Object.fromEntries(formData));
    alert("Complaint submitted successfully!");
    reset(); // reset form fields
    setSelectedImages([]);
    setPreviewUrls([]);
    // Also reset file input
    document.getElementById("imageUpload").value = "";
  };

  return (
    <div className="main-wrapper">
      {/* Header Section */}
      <div className="top-header">
        <div className="page-heading">
          <div className="page-title">Register Your Complaint</div>
          <div className="page-subtitle">
            Submit CT/PT Complaint with photos
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Ward Dropdown */}
            <div className="field-box">
              <i className="bi bi-diagram-3"></i>
              <select {...register("ward", { required: "Ward is required" })}>
                <option value="">Select Ward</option>
                {wardOptions.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>
            {errors.ward && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.ward.message}
              </p>
            )}

            <div className="field-box">
              <i className="bi bi-diagram-3"></i>
              <select {...register("toilet", { required: "Toilet is required" })}>
                <option value="">Select Toilet</option>
                {toiletOptions.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select> 
            </div>
            {errors.toilet && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.toilet.message}
              </p>
            )}

            {/* Citizen Name */}
            <div className="field-box">
              <i className="bi bi-person"></i>
              <input
                type="text"
                placeholder="Citizen Name"
                {...register("citizenName", { required: "Name is required" })}
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
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                })}
              />
            </div>
            {errors.mobileNumber && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>
                {errors.mobileNumber.message}
              </p>
            )}

            {/* Unit Dropdown */}
            <div className="field-box">
              <i className="bi bi-ui-checks-grid"></i>
              <select {...register("unit", { required: "Unit is required" })}>
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
    </div>
  );
};

export default FrmCitizen;
