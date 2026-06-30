import React from "react";

const inspections = [
  {
    date: "26 May 2025",
    ward: "Ward 1",
    toiletId: "CT-101",
    toiletName: "Shivaji Chowk",
    vendor: "CleanCare Services",
    mukadamStatus: "Approved",
    siStatus: "Approved",
    remarks: "Good",
  },
  {
    date: "26 May 2025",
    ward: "Ward 2",
    toiletId: "PT-205",
    toiletName: "Market Road",
    vendor: "Sai Swachh Seva",
    mukadamStatus: "Approved",
    siStatus: "Pending",
    remarks: "Pending Verification",
  },
  {
    date: "26 May 2025",
    ward: "Ward 3",
    toiletId: "CT-312",
    toiletName: "School Road",
    vendor: "City Clean Solutions",
    mukadamStatus: "Rejected",
    siStatus: "Pending",
    remarks: "Not Clean",
  },
  {
    date: "26 May 2025",
    ward: "Ward 4",
    toiletId: "PT-410",
    toiletName: "Bus Stand",
    vendor: "Green Planet Enterprises",
    mukadamStatus: "Approved",
    siStatus: "Approved",
    remarks: "Good",
  },
  {
    date: "26 May 2025",
    ward: "Ward 5",
    toiletId: "CT-501",
    toiletName: "Municipal Office",
    vendor: "CleanCare Services",
    mukadamStatus: "Approved",
    siStatus: "Approved",
    remarks: "Good",
  },
];

const statusBadge = (status) => {
  const map = {
    Approved: "badge-approved",
    Pending: "badge-pending",
    Rejected: "badge-rejected",
  };
  return <span className={`status-badge ${map[status] || ""}`}>{status}</span>;
};

const InspectionRecent = ({filters}) => {
  return (
    <div className="inspections-card">
      <h6 className="inspections-title">Recent Inspections</h6>
      <div className="inspections-table-wrapper">
        <table className="inspections-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ward / Prabhag</th>
              <th>Toilet ID / Name</th>
              <th>Vendor Name</th>
              <th>Mukadam Status</th>
              <th>SI Status</th>
              <th>Remarks</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((row, i) => (
              <tr key={i}>
                <td className="nowrap">{row.date}</td>
                <td>{row.ward}</td>
                <td>
                  <div className="toilet-id">{row.toiletId}</div>
                  <div className="toilet-name">{row.toiletName}</div>
                </td>
                <td>{row.vendor}</td>
                <td>{statusBadge(row.mukadamStatus)}</td>
                <td>{statusBadge(row.siStatus)}</td>
                <td className="remarks-cell">{row.remarks}</td>
                <td>
                  <button className="view-btn">View &raquo;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="inspections-footer">
        <button className="view-all-btn">View All Inspections &raquo;</button>
      </div>
    </div>
  );
};

export default InspectionRecent;
