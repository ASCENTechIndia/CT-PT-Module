import React from "react";

const DashboardFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="dashboard-filter-bar">
      <div className="filter-group">
        <label htmlFor="fromDate">From</label>
        <input
          type="date"
          id="fromDate"
          name="fromDate"
          className="filter-input"
          value={filters.fromDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="toDate">To</label>
        <input
          type="date"
          id="toDate"
          name="toDate"
          className="filter-input"
          value={filters.toDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="ward">Ward</label>
        <select
          id="ward"
          name="ward"
          className="filter-select"
          value={filters.ward}
          onChange={handleChange}
        >
          <option value="all">All</option>
          <option value="1">Ward 1</option>
          <option value="2">Ward 2</option>
          <option value="3">Ward 3</option>
          <option value="4">Ward 4</option>
          <option value="5">Ward 5</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="vendor">Vendor</label>
        <select
          id="vendor"
          name="vendor"
          className="filter-select"
          value={filters.vendor}
          onChange={handleChange}
        >
          <option value="all">All</option>
          <option value="vendor1">Vendor A</option>
          <option value="vendor2">Vendor B</option>
          <option value="vendor3">Vendor C</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="complaintStatus">Complaint Status</label>
        <select
          id="complaintStatus"
          name="complaintStatus"
          className="filter-select"
          value={filters.complaintStatus}
          onChange={handleChange}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="filter-group filter-actions">
        <button className="btn-clear-filters" onClick={onClearFilters}>
          <i className="bi bi-x-lg me-1"></i> Clear
        </button>
      </div>
    </div>
  );
};

export default DashboardFilter;
