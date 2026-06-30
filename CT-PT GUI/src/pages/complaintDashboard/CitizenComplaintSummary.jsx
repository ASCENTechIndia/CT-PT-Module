import React from "react";
import { Users, AlertCircle, Loader, CheckCircle2 } from "lucide-react";

const complaintData = {
  total: 186,
  items: [
    {
      label: "Open",
      count: 48,
      pct: 25.81,
      icon: AlertCircle,
      colorClass: "card-red",
    },
    {
      label: "In Progress",
      count: 62,
      pct: 33.33,
      icon: Loader,
      colorClass: "card-orange",
    },
    {
      label: "Resolved",
      count: 76,
      pct: 40.86,
      icon: CheckCircle2,
      colorClass: "card-green",
    },
  ],
};

const CitizenComplaintSummary = ({ filters }) => {
  // Build cards array
  const cards = [
    {
      id: 0,
      label: "Total Complaints",
      value: complaintData.total,
      sub: "All Complaints",
      icon: Users,
      colorClass: "card-blue",
    },
    ...complaintData.items.map((item, idx) => ({
      id: idx + 1,
      label: `${item.label} Complaints`,
      value: item.count,
      sub: `${item.pct}%`,
      icon: item.icon,
      colorClass: item.colorClass,
    })),
  ];

  // Format numbers
  const formatValue = (value) => value.toLocaleString("en-IN");

  return (
    <div className="row g-2">
      {cards.map(({ id, label, value, sub, icon: Icon, colorClass }) => (
        <div key={id} className="col-6 col-sm-4 col-md-3">
          <div className={`summary-card ${colorClass}`}>
            <div className="summary-card-icon">
              <Icon size={18} strokeWidth={1.8} />
            </div>
            <div className="summary-card-body">
              <span className="summary-card-label" style={{fontSize: "13px"}}>{label}</span>
              <span className="summary-card-value" style={{fontSize: "16px"}}>{formatValue(value)}</span>
              <span className="summary-card-sub" style={{fontSize: "11px"}}>{sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CitizenComplaintSummary;
