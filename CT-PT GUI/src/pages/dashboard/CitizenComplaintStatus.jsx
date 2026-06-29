import React from "react";
import { AlertCircle, Loader, CheckCircle2, Users } from "lucide-react";

const complaintData = {
  total: 186,
  items: [
    {
      label: "Open Complaints",
      count: 48,
      pct: 25.81,
      icon: AlertCircle,
      colorClass: "complaint-red",
    },
    {
      label: "In Progress Complaints",
      count: 62,
      pct: 33.33,
      icon: Loader,
      colorClass: "complaint-yellow",
    },
    {
      label: "Resolved Complaints",
      count: 76,
      pct: 40.86,
      icon: CheckCircle2,
      colorClass: "complaint-green",
    },
  ],
};

const CitizenComplaintStatus = ({filters}) => {
  return (
    <div className="complaint-card">
      <h6 className="complaint-title">Citizen Complaint Status</h6>

      <div className="d-flex">
        <div className="complaint-hero">
          <div className="complaint-icon-wrap">
            <Users size={36} strokeWidth={1.5} color="#7C3AED" />
          </div>
          <div className="complaint-total-label text-center">
            Total Complaints
          </div>
          <div className="complaint-total-value">{complaintData.total}</div>
        </div>
        <div className="complaint-items">
          {complaintData.items.map(
            ({ label, count, pct, icon: Icon, colorClass }) => (
              <div key={label} className={`complaint-item ${colorClass}`}>
                <div className="complaint-item-icon">
                  <Icon size={18} strokeWidth={2} />
                </div>
                <div className="complaint-item-label">{label}</div>
                <div className="complaint-item-count">
                  {count} ({pct}%)
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="complaint-updated">
        Last Updated: 26 May 2025 04:30 PM
      </div>
    </div>
  );
};

export default CitizenComplaintStatus;
